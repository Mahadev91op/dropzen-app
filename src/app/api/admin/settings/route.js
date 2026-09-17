import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// PUT: Update site global settings (Admin only)
export async function PUT(request) {
  try {
    await dbConnect();
    const currentUser = await getUserFromRequest(request);

    if (!currentUser || !currentUser.isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    let settings = await Settings.findOne();
    
    // Seed default settings if none exist
    if (!settings) {
      settings = await Settings.create({});
    } else {
      // Guarantee exactly one configuration document in the collection
      await Settings.deleteMany({ _id: { $ne: settings._id } });
    }

    const allowedFields = [
      'telegramLink',
      'instagramLink',
      'announcementText',
      'announcementActive',
      'maintenanceMode',
      'globalDiscount',
      'upiId',
      'usdToInrRate',
      'globalMinQuantity'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'globalDiscount' || field === 'usdToInrRate') {
          updateData[field] = Number(body[field]);
        } else if (field === 'globalMinQuantity') {
          updateData[field] = Math.max(1, parseInt(body[field]) || 1);
        } else if (field === 'announcementActive' || field === 'maintenanceMode') {
          updateData[field] = body[field] === true || body[field] === 'true';
        } else {
          updateData[field] = body[field];
        }
      }
    });

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({
      success: true,
      message: 'Global configurations updated successfully.',
      settings: updatedSettings
    }, { status: 200 });

  } catch (error) {
    console.error('Admin settings update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update global configurations' }, { status: 500 });
  }
}
