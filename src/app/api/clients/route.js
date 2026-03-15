// src/app/api/clients/route.js
// GET /api/clients — paginated client list derived from bookings
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') ?? '';
    const page   = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
    const skip   = (page - 1) * limit;

    // Aggregate unique clients from bookings
    const where = {
      adminId: session.user.id,
      ...(search && {
        OR: [
          { clientName:  { contains: search, mode: 'insensitive' } },
          { clientEmail: { contains: search, mode: 'insensitive' } },
          { clientPhone: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // Get unique clients grouped by email
    const raw = await prisma.booking.groupBy({
      by:      ['clientEmail'],
      where,
      _count:  { id: true },
      _max:    { createdAt: true, startTime: true },
      orderBy: { _max: { createdAt: 'desc' } },
      skip,
      take:    limit,
    });

    const total = await prisma.booking.groupBy({
      by:    ['clientEmail'],
      where,
      _count: { id: true },
    }).then(r => r.length);

    // Enrich with latest booking data per client
    const clients = await Promise.all(
      raw.map(async (group) => {
        const latest = await prisma.booking.findFirst({
          where:   { adminId: session.user.id, clientEmail: group.clientEmail },
          orderBy: { createdAt: 'desc' },
          select:  { clientName: true, clientEmail: true, clientPhone: true, clientTimezone: true },
        });

        const stats = await prisma.booking.groupBy({
          by:    ['status'],
          where: { adminId: session.user.id, clientEmail: group.clientEmail },
          _count: { id: true },
        });

        const revenue = await prisma.booking.aggregate({
          where: { adminId: session.user.id, clientEmail: group.clientEmail, status: { in: ['CONFIRMED', 'COMPLETED'] } },
          _sum:  { pricePaid: true },
        });

        const statusMap = Object.fromEntries(stats.map(s => [s.status, s._count.id]));

        return {
          email:         group.clientEmail,
          name:          latest?.clientName  ?? group.clientEmail,
          phone:         latest?.clientPhone ?? null,
          timezone:      latest?.clientTimezone ?? 'UTC',
          totalBookings: group._count.id,
          lastBooking:   group._max.createdAt,
          nextBooking:   group._max.startTime,
          totalSpent:    Number(revenue._sum.pricePaid ?? 0),
          confirmed:     statusMap['CONFIRMED']  ?? 0,
          completed:     statusMap['COMPLETED']  ?? 0,
          cancelled:     statusMap['CANCELLED']  ?? 0,
          pending:       statusMap['PENDING']    ?? 0,
          noShow:        statusMap['NO_SHOW']    ?? 0,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        clients,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error('[GET /api/clients]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}