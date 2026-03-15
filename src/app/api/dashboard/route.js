// src/app/api/dashboard/route.js
import { NextResponse }    from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }     from '@/lib/auth';
import { prisma }          from '@/lib/prisma'; // ← singleton, not new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const adminId = session.user.id;
    const now     = new Date();

    // ── Date ranges ────────────────────────────────────────
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const last7Start = new Date(now);
    last7Start.setDate(now.getDate() - 6);
    last7Start.setHours(0, 0, 0, 0);

    const last30Start = new Date(now);
    last30Start.setDate(now.getDate() - 29);
    last30Start.setHours(0, 0, 0, 0);

    const prev30Start = new Date(now);
    prev30Start.setDate(now.getDate() - 59);
    prev30Start.setHours(0, 0, 0, 0);

    // ── All queries in parallel ────────────────────────────
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      noShowBookings,
      todayBookings,
      recentBookings,
      upcomingToday,
      last30Revenue,
      prev30Revenue,
      last30Bookings,
      prev30BookingsCount,
      dailySnapshots,
      services,
    ] = await Promise.all([

      prisma.booking.count({ where: { adminId } }),

      prisma.booking.count({ where: { adminId, status: 'PENDING' } }),

      prisma.booking.count({ where: { adminId, status: 'CONFIRMED' } }),

      prisma.booking.count({ where: { adminId, status: 'COMPLETED' } }),

      prisma.booking.count({ where: { adminId, status: 'CANCELLED' } }),

      prisma.booking.count({ where: { adminId, status: 'NO_SHOW' } }),

      prisma.booking.count({
        where: {
          adminId,
          startTime: { gte: todayStart, lte: todayEnd },
          status:    { notIn: ['CANCELLED'] },
        },
      }),

      prisma.booking.findMany({
        where:   { adminId },
        orderBy: { createdAt: 'desc' },
        take:    8,
        include: { service: { select: { name: true, color: true } } },
      }),

      prisma.booking.findMany({
        where: {
          adminId,
          startTime: { gte: now, lte: todayEnd },
          status:    { notIn: ['CANCELLED'] },
        },
        orderBy: { startTime: 'asc' },
        take:    5,
        include: { service: { select: { name: true, color: true } } },
      }),

      // Revenue this 30 days
      prisma.booking.aggregate({
        where: {
          adminId,
          status:    { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: { gte: last30Start },
        },
        _sum: { pricePaid: true },
      }),

      // Revenue previous 30 days (for trend)
      prisma.booking.aggregate({
        where: {
          adminId,
          status:    { in: ['CONFIRMED', 'COMPLETED'] },
          createdAt: { gte: prev30Start, lt: last30Start },
        },
        _sum: { pricePaid: true },
      }),

      prisma.booking.count({
        where: { adminId, createdAt: { gte: last30Start } },
      }),

      prisma.booking.count({
        where: { adminId, createdAt: { gte: prev30Start, lt: last30Start } },
      }),

      prisma.analyticsDailySnapshot.findMany({
        where:   { adminId, date: { gte: last7Start } },
        orderBy: { date: 'asc' },
      }),

      prisma.service.findMany({
        where:   { adminId, status: 'ACTIVE' },
        orderBy: { sortOrder: 'asc' },
        take:    5,
        include: { _count: { select: { bookings: true } } },
      }),
    ]);

    // ── Trends ─────────────────────────────────────────────
    const currentRevenue  = Number(last30Revenue._sum.pricePaid ?? 0);
    const previousRevenue = Number(prev30Revenue._sum.pricePaid ?? 0);

    const revenueTrend = previousRevenue === 0
      ? 100
      : Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);

    const bookingsTrend = prev30BookingsCount === 0
      ? 100
      : Math.round(((last30Bookings - prev30BookingsCount) / prev30BookingsCount) * 100);

    // ── Chart data — fill missing days with 0 ──────────────
    const chartMap = {};
    dailySnapshots.forEach((snap) => {
      const key = snap.date.toISOString().split('T')[0];
      chartMap[key] = {
        bookings: snap.totalBookings,
        revenue:  Number(snap.totalRevenue),
      };
    });

    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key   = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      });
      chartData.push({
        date:     key,
        label,
        bookings: chartMap[key]?.bookings ?? 0,
        revenue:  chartMap[key]?.revenue  ?? 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          noShowBookings,
          todayBookings,
          totalRevenue:       currentRevenue,
          revenueTrend,
          bookingsTrend,
          last30Bookings,
        },
        recentBookings,
        upcomingToday,
        chartData,
        services: services.map((s) => ({
          id:            s.id,
          name:          s.name,
          color:         s.color,
          price:         s.price ? Number(s.price) : null,
          totalBookings: s._count.bookings,
        })),
      },
    });

  } catch (error) {
    console.error('[DASHBOARD API]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}