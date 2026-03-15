// src/app/api/notifications/route.js
// GET   /api/notifications — list admin notifications (unread first)
// PATCH /api/notifications — mark all or one as read
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit      = Math.min(50, parseInt(searchParams.get('limit') ?? '30'));

    const notifications = await prisma.notification.findMany({
      where: {
        adminId: session.user.id,
        channel: 'PUSH',
        ...(unreadOnly ? { sentAt: null } : {}),
      },
      orderBy: [{ sentAt: 'asc' }, { createdAt: 'desc' }],
      take:    limit,
      include: { booking: { select: { bookingRef: true, clientName: true, startTime: true } } },
    });

    const unreadCount = await prisma.notification.count({
      where: { adminId: session.user.id, channel: 'PUSH', sentAt: null },
    });

    return NextResponse.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { id, markAll } = await request.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { adminId: session.user.id, channel: 'PUSH', sentAt: null },
        data:  { sentAt: new Date() },
      });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (id) {
      await prisma.notification.updateMany({
        where: { id, adminId: session.user.id },
        data:  { sentAt: new Date() },
      });
      return NextResponse.json({ success: true, message: 'Marked as read' });
    }

    return NextResponse.json({ success: false, message: 'id or markAll required' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await prisma.notification.deleteMany({ where: { id, adminId: session.user.id } });
    } else {
      // Delete all read notifications older than 7 days
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      await prisma.notification.deleteMany({
        where: { adminId: session.user.id, sentAt: { not: null, lt: cutoff } },
      });
    }

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}