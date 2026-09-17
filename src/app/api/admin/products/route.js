import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch all products for admin
export async function GET(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error('Admin fetch products error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: Add new product (Meesho / Dropshipping Item)
export async function POST(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      price,
      originalPrice,
      discount,
      rating,
      badge,
      description,
      image,
      meeshoCost,
      resellPrice,
      minQuantity,
      recordsCount,
      highlightFeatures,
      sampleRows,
      customerLeads,
    } = body;

    if (!title || !price) {
      return NextResponse.json({ success: false, error: 'Title and price are required.' }, { status: 400 });
    }

    const newProduct = await Product.create({
      id: 'dropzen-' + Date.now().toString(36),
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: category || 'General Dropshipping',
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price) * 2,
      discount: discount || '50% OFF',
      rating: Number(rating) || 4.9,
      badge: badge || '🔥 Trending',
      description: description || '',
      image: image || '',
      meeshoCost: Number(meeshoCost) || 199,
      resellPrice: Number(resellPrice) || Number(price),
      minQuantity: Math.max(1, Number(minQuantity) || 1),
      recordsCount: Number(recordsCount) || 5000,
      highlightFeatures: Array.isArray(highlightFeatures) ? highlightFeatures : [],
      sampleRows: Array.isArray(sampleRows) ? sampleRows : [],
      customerLeads: Array.isArray(customerLeads) ? customerLeads : [],
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT: Update product
export async function PUT(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { _id, id, ...updateData } = body;
    const targetId = _id || id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    if (updateData.minQuantity !== undefined) {
      updateData.minQuantity = Math.max(1, Number(updateData.minQuantity) || 1);
    }

    const updatedProduct = await Product.findByIdAndUpdate(targetId, updateData, { new: true });

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error('Admin update product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: Delete product
export async function DELETE(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required.' }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Product deleted' }, { status: 200 });
  } catch (error) {
    console.error('Admin delete product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
