// src/app/api/public/availability/route.js
// GET /api/public/availability?month=YYYY-MM
//
// FIX: Calendar dots use DATE >= today (not startTime >= now).
// Today stays green/selectable even if morning slots have passed.
// The /api/public/slots endpoint handles future-only time slot filtering.

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function localMonthStart(year, mon) {
  return new Date(year, mon - 1, 1, 0, 0, 0, 0);
}
function localMonthEnd(year, mon) {
  // day 0 of next month = last day of this month
  return new Date(year, mon, 0, 23, 59, 59, 999);
}
function localStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// Server runs UTC. Slots stored with UTC midnight. toISOString is correct.
function getDateKey(prismaDate) {
  return new Date(prismaDate).toISOString().split('T')[0];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');

    if (!month) {
      return NextResponse.json({ success: false, message: 'month param required' }, { status: 400 });
    }

    const admin = await prisma.user.findFirst({
      where:   { status: 'ACTIVE', role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select:  { id: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!admin) {
      return NextResponse.json({ success: true, data: { availableDates: [], blockedDates: [] } });
    }

    const [year, mon] = month.split('-').map(Number);
    const monthStart  = localMonthStart(year, mon);
    const monthEnd    = localMonthEnd(year, mon);
    const todayStart  = localStartOfToday();

    // ── Calendar lower bound ──────────────────────────────────
    // Show dates from the later of: month start OR today
    // This avoids showing past months' dates as available
    const lowerBound = monthStart > todayStart ? monthStart : todayStart;

    const [slots, overrides] = await Promise.all([
      prisma.slot.findMany({
        where: {
          adminId: admin.id,
          status:  'AVAILABLE',
          // ✅ FIXED: filter by DATE field only (whole calendar days)
          // NOT by startTime >= now — that was making today disappear
          // after morning slots passed.
          date: { gte: lowerBound, lte: monthEnd },
        },
        select: { date: true, booked: true, capacity: true },
      }),
      prisma.availabilityOverride.findMany({
        where: {
          adminId:   admin.id,
          isBlocked: true,
          date:      { gte: monthStart, lte: monthEnd },
        },
        select: { date: true },
      }),
    ]);

    // Group slots by calendar date string
    const dateMap = {};
    slots.forEach(s => {
      const key = getDateKey(s.date);
      if (!dateMap[key]) dateMap[key] = { total: 0, available: 0 };
      dateMap[key].total++;
      if (s.booked < s.capacity) dateMap[key].available++;
    });

    const availableDates = Object.entries(dateMap)
      .filter(([, v]) => v.available > 0)
      .map(([date, v]) => ({ date, available: v.available, total: v.total }));

    const blockedDates = overrides.map(o => getDateKey(o.date));

    return NextResponse.json({ success: true, data: { availableDates, blockedDates } });
  } catch (error) {
    console.error('[GET /api/public/availability]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}