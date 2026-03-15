// src/app/api/services/route.js
// GET  /api/services  — list all services for admin
// POST /api/services  — create new service
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const services = await prisma.service.findMany({
      where:   { adminId: session.user.id, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { bookings: true } } },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('[GET /api/services]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, description, price, duration, bufferTime, color, icon, status } = body;

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Service name is required' }, { status: 400 });
    if (duration && (duration < 5 || duration > 480)) return NextResponse.json({ success: false, message: 'Duration must be between 5 and 480 minutes' }, { status: 400 });

    // Get max sort order
    const last = await prisma.service.findFirst({
      where:   { adminId: session.user.id, deletedAt: null },
      orderBy: { sortOrder: 'desc' },
      select:  { sortOrder: true },
    });

    const service = await prisma.service.create({
      data: {
        adminId:     session.user.id,
        name:        name.trim(),
        description: description?.trim() ?? null,
        price:       price != null && price !== '' ? parseFloat(price) : null,
        duration:    duration ? parseInt(duration) : null,
        bufferTime:  bufferTime ? parseInt(bufferTime) : null,
        color:       color ?? '#3B82F6',
        icon:        icon ?? null,
        status:      status ?? 'ACTIVE',
        sortOrder:   (last?.sortOrder ?? 0) + 1,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId:   session.user.id,
        action:   'CREATE',
        entity:   'Service',
        entityId: service.id,
        newValues: { name: service.name, status: service.status },
        endpoint: '/api/services',
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, data: service, message: 'Service created' }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/services]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}