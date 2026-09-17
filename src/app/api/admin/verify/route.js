import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// POST: Update order status (Admin Verification)
export async function POST(request) {
  try {
    await dbConnect();
    const userPayload = await getUserFromRequest(request);
    if (!userPayload || !userPayload.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403, headers: NO_CACHE_HEADERS });
    }

    const { orderId, status } = await request.json();

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
    await order.save();

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status} successfully.`,
      order
    }, { status: 200, headers: NO_CACHE_HEADERS });

  } catch (error) {
    console.error('Verify order error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order status' }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
