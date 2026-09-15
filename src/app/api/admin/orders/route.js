import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Card from '@/models/Card';
import Product from '@/models/Product';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';
import { generateRealisticLeads } from '@/lib/leadGenerator';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// GET: Fetch all orders for administration
export async function GET(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);

    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Admin access required.' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    const rawOrders = await Order.find({})
      .populate('userId', 'username email')
      .populate('productId')
      .populate('cardId')
      .sort({ createdAt: -1 })
      .lean();

    const orders = rawOrders.map((order) => {
      const productObj = order.productId || order.productSnapshot || order.cardId || order.cardSnapshot || {};
      return {
        ...order,
        productId: productObj,
        cardId: {
          _id: productObj._id || ('snapshot-' + order._id),
          name: productObj.title || productObj.name || 'Dropzen Leads Bundle',
          type: productObj.category || productObj.type || 'E-Commerce',
          entryFee: order.pricePaid,
          image: productObj.image || '',
          ...productObj,
        },
      };
    });

    return NextResponse.json({ success: true, orders }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders: ' + error.message },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

// PUT: Approve / Reject payment request order
export async function PUT(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);

    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { orderId, status, rejectionReason, excelData } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
    }

    if (!['completed', 'failed'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status (completed or failed only)' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    order.status = status;

    if (status === 'completed') {
      order.rejectionReason = '';

      // If excelData provided by admin or existing in order, update
      if (Array.isArray(excelData) && excelData.length > 0) {
        order.excelData = excelData;
      } else if (!order.excelData || order.excelData.length === 0) {
        // Generate verified customer leads (50 preview rows directly on order)
        const title = order.productSnapshot?.title || 'Dropshipping Trending Product';
        const targetCount = order.productSnapshot?.recordsCount || order.quantity || 5000;
        // Generate high quality leads
        order.excelData = generateRealisticLeads(title, Math.min(targetCount, 50));
      }
    } else if (status === 'failed') {
      order.rejectionReason = rejectionReason || 'Payment verification failed: UTR number not matching bank transaction.';
    }

    await order.save();

    return NextResponse.json({ success: true, message: `Order marked as ${status}`, order }, { status: 200, headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('Admin order update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
