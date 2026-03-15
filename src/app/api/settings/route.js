// src/app/api/settings/route.js
// GET   /api/settings — get admin profile + preferences
// PATCH /api/settings — update profile + preferences
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: {
        id: true, name: true, email: true, phone: true, role: true, status: true,
        pushEnabled: true, emailEnabled: true, pushToken: true,
        googleCalendarConnected: true, googleCalendarId: true,
        createdAt: true, lastLoginAt: true,
      },
    });

    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, phone, pushEnabled, emailEnabled, currentPassword, newPassword, pushToken } = body;

    const updateData = {};

    if (name  !== undefined) updateData.name  = name.trim();
    if (phone !== undefined) updateData.phone = phone?.trim() ?? null;
    if (pushEnabled  !== undefined) updateData.pushEnabled  = Boolean(pushEnabled);
    if (emailEnabled !== undefined) updateData.emailEnabled = Boolean(emailEnabled);
    if (pushToken    !== undefined) updateData.pushToken    = pushToken;

    // Password change
    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ success: false, message: 'Current password required' }, { status: 400 });
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      const ok   = await bcrypt.compare(currentPassword, user.password);
      if (!ok) return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
      if (newPassword.length < 8) return NextResponse.json({ success: false, message: 'New password must be at least 8 characters' }, { status: 400 });
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({
      where:  { id: session.user.id },
      data:   updateData,
      select: { id: true, name: true, email: true, phone: true, pushEnabled: true, emailEnabled: true },
    });

    await prisma.auditLog.create({
      data: { userId: session.user.id, action: 'UPDATE', entity: 'User', entityId: session.user.id, newValues: { fields: Object.keys(updateData) }, endpoint: '/api/settings' },
    }).catch(() => {});

    return NextResponse.json({ success: true, data: updated, message: 'Settings saved' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}