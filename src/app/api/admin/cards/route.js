import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const title = body.title || body.name;
    const price = body.price || body.entryFee;

    const newProduct = await Product.create({
      id: 'dropzen-' + Date.now().toString(36),
      title: title || 'Dropshipping Leads Bundle',
      slug: (title || 'bundle').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: body.category || body.type || 'Home & Kitchen',
      price: Number(price) || 999,
      originalPrice: Number(body.originalPrice) || (Number(price) * 2),
      discount: body.discount || '50% OFF',
      rating: Number(body.rating) || 4.9,
      badge: body.badge || '🔥 Trending',
      deliveryTime: body.deliveryTime || '5 - 10 Mins Automated',
      freshness: body.freshness || 'Updated Sept 2026',
      description: body.description || '',
      image: body.image || '',
      meeshoCost: Number(body.meeshoCost) || 199,
      resellPrice: Number(body.resellPrice) || 899,
      recordsCount: Number(body.recordsCount || body.qty || 5000),
      minQuantity: Number(body.minQuantity || 10),
      highlightFeatures: Array.isArray(body.highlightFeatures) ? body.highlightFeatures : [],
      sampleRows: Array.isArray(body.sampleRows) ? body.sampleRows : [],
    });

    return NextResponse.json({ success: true, product: newProduct, card: newProduct }, { status: 201 });
  } catch (error) {
    console.error('Admin create product error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { cardId, id, _id, ...updateData } = body;
    const targetId = cardId || id || _id;

    if (!targetId) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (updateData.name && !updateData.title) {
      updateData.title = updateData.name;
    }
    if (updateData.entryFee && !updateData.price) {
      updateData.price = Number(updateData.entryFee);
    }
    if (updateData.qty && !updateData.recordsCount) {
      updateData.recordsCount = Number(updateData.qty);
    }

    const updated = await Product.findByIdAndUpdate(targetId, updateData, { new: true });
    return NextResponse.json({ success: true, product: updated, card: updated }, { status: 200 });
  } catch (error) {
    console.error('Admin update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || searchParams.get('cardId');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 });
  }
}
