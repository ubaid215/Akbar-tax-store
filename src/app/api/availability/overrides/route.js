// src/app/api/availability/overrides/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ── SAFE date helpers ─────────────────────────────────────────
// THE BUG: new Date("2026-03-24") parses as UTC midnight
// In UTC+5 (Pakistan) this becomes March 23 at 19:00 local = March 23 calendar day
// Fix: always parse date strings manually into LOCAL midnight

function parseUTCDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)); // exact UTC midnight ✅
}

function localMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function localStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── GET ───────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const overrides = await prisma.availabilityOverride.findMany({
      where:   { adminId: session.user.id, date: { gte: localStartOfToday() } },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ success: true, data: overrides });
  } catch (error) {
    console.error('[GET /api/availability/overrides]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ── POST (block a date) ───────────────────────────────────────
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const adminId      = session.user.id;
    const body         = await request.json();
    const { date, reason } = body;

    if (!date) {
      return NextResponse.json({ success: false, message: 'date is required' }, { status: 400 });
    }

    // ✅ Parse as UTC date
    const parsedDate = parseUTCDate(date);

    if (parsedDate < localStartOfToday()) {
      return NextResponse.json({ success: false, message: 'Cannot block dates in the past' }, { status: 400 });
    }

    // Upsert the override record
    const override = await prisma.availabilityOverride.upsert({
      where:  { adminId_date: { adminId, date: parsedDate } },
      create: { adminId, date: parsedDate, isBlocked: true, reason: reason ?? null },
      update: { isBlocked: true, reason: reason ?? null },
    });

    // Delete available slots on this calendar day
    // Use a date range to be safe across timezone storage differences
    await prisma.slot.deleteMany({
      where: {
        adminId,
        status: 'AVAILABLE',
        date: parsedDate,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Date blocked successfully',
      data:    override,
    });
  } catch (error) {
    console.error('[POST /api/availability/overrides]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ── DELETE (unblock a date) ───────────────────────────────────
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const adminId        = session.user.id;
    const { searchParams } = new URL(request.url);
    const dateParam      = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json({ success: false, message: 'date query param required' }, { status: 400 });
    }

    // ✅ Parse as UTC date
    const parsedDate = parseUTCDate(dateParam);

    // Delete using a date-range query to handle any timezone storage variation
    const deleted = await prisma.availabilityOverride.deleteMany({
      where: {
        adminId,
        date: parsedDate,
      },
    });

    if (deleted.count === 0) {
      // Try to find what's actually in the DB around this date for debugging
      const nearby = await prisma.availabilityOverride.findMany({
        where: { adminId },
        orderBy: { date: 'asc' },
        take: 5,
      });
      console.warn('[DELETE /overrides] No record found for', parsedDate, '- nearby records:', nearby.map(o => o.date));
    }

    // Re-generate slots for this date if an availability rule exists
    const dayOfWeek = parsedDate.getDay(); // local day ✅
    const dayNames  = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

    const avail = await prisma.availability.findFirst({
      where: {
        adminId,
        dayOfWeek: dayNames[dayOfWeek],
        isActive:  true,
      },
    });

    if (avail) {
      const [startH, startM] = avail.startTime.split(':').map(Number);
      const [endH,   endM]   = avail.endTime.split(':').map(Number);

      const dayStart = new Date(parsedDate);
      dayStart.setHours(startH, startM, 0, 0);

      const dayEnd = new Date(parsedDate);
      dayEnd.setHours(endH, endM, 0, 0);

      const slotsData = [];
      let cursor = new Date(dayStart);
      while (true) {
        const slotEnd   = new Date(cursor.getTime() + avail.slotDuration * 60_000);
        const bufferEnd = new Date(slotEnd.getTime()  + avail.bufferTime  * 60_000);
        if (slotEnd > dayEnd) break;
        slotsData.push({
          adminId,
          date:      parsedDate,
          startTime: new Date(cursor),
          endTime:   new Date(slotEnd),
          bufferEnd: new Date(bufferEnd),
          status:    'AVAILABLE',
          capacity:  avail.maxBookings,
          booked:    0,
        });
        cursor = bufferEnd;
      }

      if (slotsData.length > 0) {
        await prisma.slot.createMany({ data: slotsData, skipDuplicates: true });
      }
    }

    return NextResponse.json({ success: true, message: 'Date unblocked and slots restored' });
  } catch (error) {
    console.error('[DELETE /api/availability/overrides]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}