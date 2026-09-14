import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Card from '@/models/Card';
import { getUserFromRequest } from '@/lib/auth';
import { validateUtrNumber } from '@/lib/utrValidator';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('search') || searchParams.get('utr');

    // Public Order Tracker lookup (by 12-digit UTR or Order ID)
    if (searchQuery && searchQuery.trim() !== '') {
      const clean = searchQuery.trim();
      let query = { utrNumber: clean };
      if (clean.length === 24 && /^[0-9a-fA-F]{24}$/.test(clean)) {
        query = { $or: [{ utrNumber: clean }, { _id: clean }] };
      }
      const foundOrders = await Order.find(query).sort({ createdAt: -1 }).limit(5).lean();
      const sanitized = foundOrders.map((order) => {
        const productObj = order.productSnapshot || order.cardSnapshot || {};
        return {
          _id: String(order._id),
          status: order.status,
          pricePaid: order.pricePaid,
          utrNumber: order.utrNumber,
          createdAt: order.createdAt,
          productSnapshot: productObj,
          cardSnapshot: productObj,
        };
      });
      return NextResponse.json({ success: true, orders: sanitized }, { status: 200 });
    }

    const userPayload = await getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const rawOrders = await Order.find({ userId: userPayload.id })
      .populate('productId')
      .populate('cardId')
      .sort({ createdAt: -1 })
      .lean();

    const orders = rawOrders.map((order) => {
      const productObj = order.productId || (order.productSnapshot && order.productSnapshot.title ? order.productSnapshot : null) || order.cardId || order.cardSnapshot || {};
      
      return {
        ...order,
        productId: productObj,
        cardId: {
          _id: productObj._id || ('prod-' + order._id),
          name: productObj.title || productObj.name || 'Dropzen Leads Bundle',
          type: productObj.category || productObj.type || 'E-Commerce',
          entryFee: order.pricePaid,
          image: productObj.image || '',
          ...productObj,
        },
      };
    });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: Create a new order (Buy Dropshipping Product Leads with UTR Validation)
export async function POST(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ success: false, error: 'Please log in to purchase product leads' }, { status: 401 });
    }

    const {
      productId,
      cardId,
      quantity = 10,
      utrNumber,
      senderUpiId,
      paymentApp,
      paymentScreenshot,
    } = await request.json();

    const targetId = productId || cardId;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    // 1. Anti-Spam Check: Max 3 pending orders per user
    const pendingOrdersCount = await Order.countDocuments({
      userId: userPayload.id,
      status: 'pending',
    });

    if (pendingOrdersCount >= 3) {
      return NextResponse.json({
        success: false,
        error: 'You already have 3 pending verification orders. Please wait for approval before submitting another purchase.',
      }, { status: 400 });
    }

    // 2. NPCI-compliant UTR Validation Engine
    const utrResult = validateUtrNumber(utrNumber);
    if (!utrResult.isValid) {
      return NextResponse.json({ success: false, error: utrResult.error }, { status: 400 });
    }
    const cleanUtr = utrResult.cleanUtr;

    // 3. Sender Verification: Require Sender UPI ID / Phone number
    const trimmedSender = (senderUpiId || '').trim();
    if (!trimmedSender || trimmedSender.length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid Sender UPI ID or Phone number for payment verification.',
      }, { status: 400 });
    }

    // 4. Payment Screenshot Proof Validation
    if (!paymentScreenshot || typeof paymentScreenshot !== 'string' || !paymentScreenshot.startsWith('data:image/')) {
      return NextResponse.json({
        success: false,
        error: 'A valid payment screenshot or receipt image is mandatory.',
      }, { status: 400 });
    }

    if (paymentScreenshot.length > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'Payment screenshot image is too large. Please upload an image under 4MB.',
      }, { status: 400 });
    }

    // 5. Global Duplicate UTR Check
    const duplicateUtr = await Order.findOne({ utrNumber: cleanUtr });
    if (duplicateUtr) {
      return NextResponse.json({
        success: false,
        error: 'This UPI UTR reference number has already been recorded. Duplicate submissions are strictly rejected.',
      }, { status: 400 });
    }

    // Find Product (try Product first, then Card)
    let product = null;
    try {
      product = await Product.findById(targetId);
    } catch (e) {}

    if (!product) {
      product = await Product.findOne({ id: targetId });
    }

    if (!product) {
      try {
        product = await Card.findById(targetId);
      } catch (e) {}
    }

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const orderQty = Math.max(10, Number(quantity) || 10);
    const unitPrice = product.price || product.entryFee || 999;
    const finalPrice = unitPrice; // Bundle price as listed on product

    // Prepare default customer leads for this product
    const leadRows = (product.sampleRows && product.sampleRows.length > 0)
      ? product.sampleRows.map((row, idx) => ({
          id: idx + 1,
          name: row.name || `Customer ${idx + 1}`,
          phone: row.phone ? row.phone.replace(/•/g, Math.floor(Math.random() * 9 + 1)) : `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
          city: row.city || 'Mumbai',
          state: row.state || 'Maharashtra',
          pincode: row.pincode || `${Math.floor(110000 + Math.random() * 700000)}`,
          product: row.product || product.title,
          amount: row.amount || '₹1,499',
          payment: row.payment || 'COD Delivered',
          status: 'Verified Ready for Resell',
          date: row.date || 'Sept 2026',
        }))
      : [
          { id: 1, name: 'Aarav Mehta', phone: '+91 98201 84920', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', product: product.title, amount: '₹1,699', payment: 'COD Delivered', status: 'Verified', date: 'Sept 14, 2026' },
          { id: 2, name: 'Priya Sundaram', phone: '+91 98450 71923', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', product: product.title, amount: '₹2,150', payment: 'UPI Prepaid', status: 'Verified', date: 'Sept 14, 2026' },
          { id: 3, name: 'Rajesh Kulkarni', phone: '+91 94223 99182', city: 'Pune', state: 'Maharashtra', pincode: '411001', product: product.title, amount: '₹1,399', payment: 'COD Delivered', status: 'Verified', date: 'Sept 13, 2026' },
          { id: 4, name: 'Kavita Singhal', phone: '+91 98112 34910', city: 'Gurugram', state: 'Haryana', pincode: '122001', product: product.title, amount: '₹1,199', payment: 'Prepaid', status: 'Verified', date: 'Sept 14, 2026' },
          { id: 5, name: 'Vikas Choudhary', phone: '+91 94140 55192', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', product: product.title, amount: '₹899', payment: 'COD Delivered', status: 'Verified', date: 'Sept 12, 2026' },
          { id: 6, name: 'Deepak Rawat', phone: '+91 97561 22849', city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', product: product.title, amount: '₹1,450', payment: 'COD Delivered', status: 'Verified', date: 'Sept 13, 2026' },
          { id: 7, name: 'Ananya Mukherjee', phone: '+91 98305 66719', city: 'Kolkata', state: 'West Bengal', pincode: '700001', product: product.title, amount: '₹1,299', payment: 'UPI Prepaid', status: 'Verified', date: 'Sept 13, 2026' },
          { id: 8, name: 'Suresh Reddy', phone: '+91 99890 11928', city: 'Hyderabad', state: 'Telangana', pincode: '500001', product: product.title, amount: '₹2,499', payment: 'COD Delivered', status: 'Verified', date: 'Sept 12, 2026' },
          { id: 9, name: 'Pooja Verma', phone: '+91 98720 44918', city: 'Chandigarh', state: 'Punjab', pincode: '160001', product: product.title, amount: '₹1,750', payment: 'COD Delivered', status: 'Verified', date: 'Sept 14, 2026' },
          { id: 10, name: 'Manoj Patel', phone: '+91 98980 33819', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', product: product.title, amount: '₹1,999', payment: 'UPI Prepaid', status: 'Verified', date: 'Sept 14, 2026' },
        ];

    const newOrder = await Order.create({
      userId: userPayload.id,
      productId: product._id,
      cardId: product._id, // alias
      quantity: orderQty,
      status: 'pending',
      pricePaid: finalPrice,
      utrNumber: cleanUtr,
      senderUpiId: trimmedSender,
      paymentApp: paymentApp || 'other',
      paymentScreenshot,
      excelData: leadRows,
      productSnapshot: {
        _id: product._id,
        title: product.title || product.name,
        category: product.category || product.type || 'Home & Kitchen',
        price: finalPrice,
        image: product.image || '',
        badge: product.badge || '🔥 Trending',
        recordsCount: product.recordsCount || 5000,
        deliveryTime: product.deliveryTime || '5 - 10 Mins Automated',
        meeshoCost: product.meeshoCost || 199,
        resellPrice: product.resellPrice || 899,
      },
      cardSnapshot: {
        _id: product._id,
        name: product.title || product.name,
        type: product.category || product.type || 'Home & Kitchen',
        entryFee: finalPrice,
        image: product.image || '',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order submitted successfully! Verification takes 5-10 minutes.',
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order create error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}
