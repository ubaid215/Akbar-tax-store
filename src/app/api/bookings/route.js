// src/app/api/bookings/route.js
// GET  /api/bookings  — paginated list with filters
// POST /api/bookings  — create new booking (admin side)
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const status   = searchParams.get('status');   // PENDING | CONFIRMED | etc
    const search   = searchParams.get('search');   // client name or email
    const dateFrom = searchParams.get('dateFrom'); // ISO date string
    const dateTo   = searchParams.get('dateTo');
    const skip     = (page - 1) * limit;

    const where = {
      adminId: session.user.id,
      ...(status && status !== 'ALL' && { status }),
      ...(search && {
        OR: [
          { clientName:  { contains: search, mode: 'insensitive' } },
          { clientEmail: { contains: search, mode: 'insensitive' } },
          { bookingRef:  { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(dateFrom || dateTo ? {
        startTime: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo   && { lte: new Date(new Date(dateTo).setHours(23, 59, 59, 999)) }),
        },
      } : {}),
    };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { startTime: 'desc' },
        skip,
        take: limit,
        include: {
          service: { select: { name: true, color: true, price: true } },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('[GET /api/bookings]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}