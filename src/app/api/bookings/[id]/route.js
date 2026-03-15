// src/app/api/bookings/[id]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = await params; // ← Next.js 15: params is a Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const booking = await prisma.booking.findFirst({
      where: { id, adminId: session.user.id },
      include: {
        service: true,
        slot:    true,
        history: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!booking) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('[GET /api/bookings/:id]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; // ← Next.js 15: params is a Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { status, adminNotes, cancellationReason } = body;

    const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', 'RESCHEDULED'];
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const existing = await prisma.booking.findFirst({
      where: { id, adminId: session.user.id },
    });

    if (!existing) return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });

    const updateData = {};
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    if (status && status !== existing.status) {
      updateData.status = status;
      if (status === 'CANCELLED') {
        updateData.cancelledAt        = new Date();
        updateData.cancelledBy        = 'admin';
        updateData.cancellationReason = cancellationReason ?? null;
      }
    }

    const ops = [
      prisma.booking.update({
        where:   { id },
        data:    updateData,
        include: { service: { select: { name: true, color: true } } },
      }),
    ];

    if (status === 'CANCELLED') {
      ops.push(
        prisma.slot.update({
          where: { id: existing.slotId },
          data:  { status: 'AVAILABLE', booked: { decrement: 1 } },
        })
      );
    }

    if (status && status !== existing.status) {
      ops.push(
        prisma.bookingHistory.create({
          data: {
            bookingId:   id,
            fromStatus:  existing.status,
            toStatus:    status,
            changedBy:   'admin',
            changedById: session.user.id,
            reason:      cancellationReason ?? undefined,
          },
        })
      );
    }

    const [updated] = await prisma.$transaction(ops);

    await prisma.auditLog.create({
      data: {
        userId:    session.user.id,
        action:    'UPDATE',
        entity:    'Booking',
        entityId:  id,
        oldValues: { status: existing.status },
        newValues: updateData,
        endpoint:  `/api/bookings/${id}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, data: updated, message: 'Booking updated' });
  } catch (error) {
    console.error('[PATCH /api/bookings/:id]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}