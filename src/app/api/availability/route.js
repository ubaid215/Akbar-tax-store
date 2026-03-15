// src/app/api/availability/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DAY_MAP = {
  MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
};

// ── SAFE date helpers ─────────────────────────────────────────

function localStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Add days to a date (returns new Date)
 */
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}


function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0); // local midnight ✅
}

/**
 * Return local midnight of a given Date object
 */
function localMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── Slot generator ────────────────────────────────────────────
async function generateSlots(adminId, availabilities, daysAhead = 60) {
  const today    = localStartOfToday();
  const slotsData = [];

  for (let i = 0; i < daysAhead; i++) {
    const date      = addDays(today, i);
    const dayOfWeek = date.getDay(); // 0=Sun…6=Sat in LOCAL time ✅

    const avail = availabilities.find(
      a => DAY_MAP[a.dayOfWeek] === dayOfWeek && a.isActive
    );
    if (!avail) continue;

    // Check for a blocked override on this local calendar date
    const dayMidnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())); // store UTC midnight ✅
    const override = await prisma.availabilityOverride.findFirst({
      where: {
        adminId,
        // Match any override record whose date column falls on this calendar day
        date: {
          gte: dayMidnight,
          lt:  addDays(dayMidnight, 1),
        },
        isBlocked: true,
      },
    });
    if (override) continue;

    const [startH, startM] = avail.startTime.split(':').map(Number);
    const [endH,   endM]   = avail.endTime.split(':').map(Number);

    // Build slot times using local calendar date
    const dayStart = new Date(date);
    dayStart.setHours(startH, startM, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(endH, endM, 0, 0);

    let cursor = new Date(dayStart);
    while (true) {
      const slotEnd   = new Date(cursor.getTime() + avail.slotDuration * 60_000);
      const bufferEnd = new Date(slotEnd.getTime()  + avail.bufferTime  * 60_000);
      if (slotEnd > dayEnd) break;

      slotsData.push({
        adminId,
        date:      dayMidnight,   // store exact UTC midnight so Prisma @db.Date doesn't shift it
        startTime: new Date(cursor),
        endTime:   new Date(slotEnd),
        bufferEnd: new Date(bufferEnd),
        status:    'AVAILABLE',
        capacity:  avail.maxBookings,
        booked:    0,
      });

      cursor = bufferEnd;
    }
  }

  return slotsData;
}

// ── GET ───────────────────────────────────────────────────────
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();

    const [availabilities, overrides] = await Promise.all([
      prisma.availability.findMany({
        where:   { adminId: session.user.id },
        orderBy: { dayOfWeek: 'asc' },
      }),
      prisma.availabilityOverride.findMany({
        where:   { adminId: session.user.id, date: { gte: localStartOfToday() } },
        orderBy: { date: 'asc' },
      }),
    ]);

    return NextResponse.json({ success: true, data: { availabilities, overrides } });
  } catch (error) {
    console.error('[GET /api/availability]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ── POST ──────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const adminId        = session.user.id;
    const body           = await request.json();
    const { days, timezone = 'UTC' } = body;

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json({ success: false, message: 'days array is required' }, { status: 400 });
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (const day of days) {
      if (!day.isActive) continue; // skip validation for inactive days
      if (!timeRegex.test(day.startTime) || !timeRegex.test(day.endTime)) {
        return NextResponse.json({ success: false, message: `Invalid time format for ${day.dayOfWeek}` }, { status: 400 });
      }
      if (day.startTime >= day.endTime) {
        return NextResponse.json({ success: false, message: `Start time must be before end time for ${day.dayOfWeek}` }, { status: 400 });
      }
      if (![15, 30, 45, 60, 90, 120].includes(day.slotDuration)) {
        return NextResponse.json({ success: false, message: `Invalid slot duration for ${day.dayOfWeek}` }, { status: 400 });
      }
    }

    // Upsert all 7 days
    const upsertOps = days.map(day =>
      prisma.availability.upsert({
        where:  { adminId_dayOfWeek: { adminId, dayOfWeek: day.dayOfWeek } },
        create: {
          adminId,
          dayOfWeek:    day.dayOfWeek,
          startTime:    day.isActive ? day.startTime : '09:00',
          endTime:      day.isActive ? day.endTime   : '17:00',
          slotDuration: day.slotDuration ?? 60,
          bufferTime:   day.bufferTime   ?? 10,
          maxBookings:  day.maxBookings  ?? 1,
          timezone,
          isActive:     day.isActive ?? false,
        },
        update: {
          startTime:    day.isActive ? day.startTime : '09:00',
          endTime:      day.isActive ? day.endTime   : '17:00',
          slotDuration: day.slotDuration ?? 60,
          bufferTime:   day.bufferTime   ?? 10,
          maxBookings:  day.maxBookings  ?? 1,
          timezone,
          isActive:     day.isActive ?? false,
        },
      })
    );

    const savedAvailabilities = await prisma.$transaction(upsertOps);

    // Delete future available slots and regenerate
    await prisma.slot.deleteMany({
      where: { adminId, status: 'AVAILABLE', startTime: { gte: new Date() } },
    });

    const allAvailabilities = await prisma.availability.findMany({
      where: { adminId, isActive: true },
    });

    const slotsData = await generateSlots(adminId, allAvailabilities, 60);

    let generatedCount = 0;
    if (slotsData.length > 0) {
      const result = await prisma.slot.createMany({
        data: slotsData, skipDuplicates: true,
      });
      generatedCount = result.count;
    }

    await prisma.auditLog.create({
      data: {
        userId:    adminId,
        action:    'UPDATE',
        entity:    'Availability',
        newValues: { daysConfigured: days.length, slotsGenerated: generatedCount },
        endpoint:  '/api/availability',
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: `Availability saved. ${generatedCount} slots generated for the next 60 days.`,
      data:    { availabilities: savedAvailabilities, slotsGenerated: generatedCount },
    });
  } catch (error) {
    console.error('[POST /api/availability]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}