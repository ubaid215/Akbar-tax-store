// src/app/api/analytics/route.js
// GET /api/analytics?range=7|30|90
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
    const range   = parseInt(searchParams.get('range') ?? '30');
    const adminId = session.user.id;
    const now     = new Date();

    const rangeStart = new Date(now);
    rangeStart.setDate(now.getDate() - (range - 1));
    rangeStart.setHours(0, 0, 0, 0);

    const prevStart = new Date(rangeStart);
    prevStart.setDate(prevStart.getDate() - range);

    const [
      bookingsInRange, bookingsPrev,
      revenueInRange,  revenuePrev,
      statusBreakdown, topServices,
      dailySnapshots,  allTimeTotal,
    ] = await Promise.all([
      prisma.booking.count({ where: { adminId, createdAt: { gte: rangeStart } } }),
      prisma.booking.count({ where: { adminId, createdAt: { gte: prevStart, lt: rangeStart } } }),

      prisma.booking.aggregate({
        where: { adminId, status: { in: ['CONFIRMED','COMPLETED'] }, createdAt: { gte: rangeStart } },
        _sum: { pricePaid: true },
      }),
      prisma.booking.aggregate({
        where: { adminId, status: { in: ['CONFIRMED','COMPLETED'] }, createdAt: { gte: prevStart, lt: rangeStart } },
        _sum: { pricePaid: true },
      }),

      prisma.booking.groupBy({
        by: ['status'],
        where: { adminId, createdAt: { gte: rangeStart } },
        _count: { id: true },
      }),

      prisma.service.findMany({
        where:   { adminId, deletedAt: null },
        include: {
          _count: { select: { bookings: true } },
          bookings: {
            where: { createdAt: { gte: rangeStart } },
            select: { pricePaid: true, status: true },
          },
        },
        orderBy: { sortOrder: 'asc' },
      }),

      // Daily breakdown for chart
      prisma.booking.findMany({
        where:   { adminId, createdAt: { gte: rangeStart } },
        select:  { createdAt: true, pricePaid: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),

      prisma.booking.count({ where: { adminId } }),
    ]);

    // Build daily chart data
    const chartMap = {};
    dailySnapshots.forEach(b => {
      const key = b.createdAt.toISOString().split('T')[0];
      if (!chartMap[key]) chartMap[key] = { bookings: 0, revenue: 0, completed: 0, cancelled: 0 };
      chartMap[key].bookings++;
      if (['CONFIRMED','COMPLETED'].includes(b.status)) chartMap[key].revenue += Number(b.pricePaid ?? 0);
      if (b.status === 'COMPLETED') chartMap[key].completed++;
      if (b.status === 'CANCELLED') chartMap[key].cancelled++;
    });

    const chartData = [];
    for (let i = range - 1; i >= 0; i--) {
      const d   = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      chartData.push({
        date:      key,
        label:     d.toLocaleDateString('en-US', range <= 7 ? { weekday: 'short' } : range <= 31 ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric' }),
        bookings:  chartMap[key]?.bookings  ?? 0,
        revenue:   chartMap[key]?.revenue   ?? 0,
        completed: chartMap[key]?.completed ?? 0,
        cancelled: chartMap[key]?.cancelled ?? 0,
      });
    }

    // Status breakdown
    const statusMap = Object.fromEntries(statusBreakdown.map(s => [s.status, s._count.id]));

    // Trend calculation
    const trendPct = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const currRevenue = Number(revenueInRange._sum.pricePaid ?? 0);
    const prevRevenue = Number(revenuePrev._sum.pricePaid    ?? 0);

    // Services enriched
    const services = topServices.map(s => ({
      id:           s.id,
      name:         s.name,
      color:        s.color,
      price:        s.price ? Number(s.price) : null,
      totalBookings: s._count.bookings,
      rangeBookings: s.bookings.length,
      rangeRevenue:  s.bookings
        .filter(b => ['CONFIRMED','COMPLETED'].includes(b.status))
        .reduce((sum, b) => sum + Number(b.pricePaid ?? 0), 0),
    }));

    // Completion rate
    const completionRate = bookingsInRange > 0
      ? Math.round(((statusMap['COMPLETED'] ?? 0) / bookingsInRange) * 100)
      : 0;
    const cancellationRate = bookingsInRange > 0
      ? Math.round(((statusMap['CANCELLED'] ?? 0) / bookingsInRange) * 100)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        range,
        overview: {
          totalBookings:   bookingsInRange,
          bookingsTrend:   trendPct(bookingsInRange, bookingsPrev),
          totalRevenue:    currRevenue,
          revenueTrend:    trendPct(currRevenue, prevRevenue),
          completionRate,
          cancellationRate,
          allTimeTotal,
        },
        statusBreakdown: {
          pending:     statusMap['PENDING']     ?? 0,
          confirmed:   statusMap['CONFIRMED']   ?? 0,
          completed:   statusMap['COMPLETED']   ?? 0,
          cancelled:   statusMap['CANCELLED']   ?? 0,
          noShow:      statusMap['NO_SHOW']     ?? 0,
          rescheduled: statusMap['RESCHEDULED'] ?? 0,
        },
        chartData,
        services,
      },
    });
  } catch (error) {
    console.error('[GET /api/analytics]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}