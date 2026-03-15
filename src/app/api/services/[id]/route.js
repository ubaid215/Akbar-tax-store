// src/app/api/services/[id]/route.js
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

    const service = await prisma.service.findFirst({
      where:   { id, adminId: session.user.id, deletedAt: null },
      include: { _count: { select: { bookings: true } } },
    });

    if (!service) return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params; // ← Next.js 15: params is a Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, description, price, duration, bufferTime, color, icon, status, sortOrder } = body;

    const existing = await prisma.service.findFirst({
      where: { id, adminId: session.user.id, deletedAt: null },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });

    if (name !== undefined && !name?.trim()) {
      return NextResponse.json({ success: false, message: 'Service name cannot be empty' }, { status: 400 });
    }

    const updateData = {};
    if (name        !== undefined) updateData.name        = name.trim();
    if (description !== undefined) updateData.description = description?.trim() ?? null;
    if (price       !== undefined) updateData.price       = price !== '' && price != null ? parseFloat(price) : null;
    if (duration    !== undefined) updateData.duration    = duration ? parseInt(duration) : null;
    if (bufferTime  !== undefined) updateData.bufferTime  = bufferTime ? parseInt(bufferTime) : null;
    if (color       !== undefined) updateData.color       = color;
    if (icon        !== undefined) updateData.icon        = icon;
    if (status      !== undefined) updateData.status      = status;
    if (sortOrder   !== undefined) updateData.sortOrder   = parseInt(sortOrder);

    const updated = await prisma.service.update({
      where:   { id },
      data:    updateData,
      include: { _count: { select: { bookings: true } } },
    });

    await prisma.auditLog.create({
      data: {
        userId:    session.user.id,
        action:    'UPDATE',
        entity:    'Service',
        entityId:  id,
        oldValues: { status: existing.status, name: existing.name },
        newValues: updateData,
        endpoint:  `/api/services/${id}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, data: updated, message: 'Service updated' });
  } catch (error) {
    console.error('[PATCH /api/services/:id]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // ← Next.js 15: params is a Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const existing = await prisma.service.findFirst({
      where:   { id, adminId: session.user.id, deletedAt: null },
      include: { _count: { select: { bookings: true } } },
    });
    if (!existing) return NextResponse.json({ success: false, message: 'Service not found' }, { status: 404 });

    await prisma.service.update({
      where: { id },
      data:  { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    await prisma.auditLog.create({
      data: {
        userId:    session.user.id,
        action:    'DELETE',
        entity:    'Service',
        entityId:  id,
        oldValues: { name: existing.name, bookings: existing._count.bookings },
        endpoint:  `/api/services/${id}`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}