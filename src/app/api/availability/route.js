// src/app/api/availability/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const DAY_MAP = {
  MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6, SUNDAY: 0,
};

// Pakistan Standard Time is UTC+5 — no DST
const PKT_OFFSET_HOURS = 5;

// ── Date helpers ──────────────────────────────────────────────

function localStartOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function localMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Build a slot DateTime from a calendar date + time string in PKT.
 * Uses setUTCHours so the result is correct regardless of server timezone.
 *
 * "09:00" PKT on 2026-03-17
 * = 9am PKT - 5h = 4am UTC
 * = 2026-03-17T04:00:00Z  ✅ stored correctly on both local PKT and Vercel UTC
 *
 * @param {Date}   calendarDate - local midnight date for the day
 * @param {string} timeStr      - "HH:MM" in PKT (admin's configured time)
 * @returns {Date}
 */
function buildPKTTime(calendarDate, timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(calendarDate);
  // Use setUTCHours: subtract PKT offset so we store the correct UTC value
  d.setUTCHours(h - PKT_OFFSET_HOURS, m, 0, 0);
  return d;
}

// ── Slot generator ────────────────────────────────────────────
async function generateSlots(adminId, availabilities, daysAhead = 60) {
  const today     = localStartOfToday();
  const slotsData = [];

  for (let i = 0; i < daysAhead; i++) {
    const date      = addDays(today, i);
    const dayOfWeek = date.getDay(); // local day — fine for calendar matching

    const avail = availabilities.find(
      a => DAY_MAP[a.dayOfWeek] === dayOfWeek && a.isActive
    );
    if (!avail) continue;

    // Check blocked override
    const dayMidnight = localMidnight(date);
    const override = await prisma.availabilityOverride.findFirst({
      where: {
        adminId,
        date:      { gte: dayMidnight, lt: addDays(dayMidnight, 1) },
        isBlocked: true,
      },
    });
    if (override) continue;

    // ✅ Build slot times in PKT using setUTCHours
    const dayStart = buildPKTTime(date, avail.startTime);
    const dayEnd   = buildPKTTime(date, avail.endTime);

    let cursor = new Date(dayStart);
    while (true) {
      const slotEnd   = new Date(cursor.getTime() + avail.slotDuration * 60_000);
      const bufferEnd = new Date(slotEnd.getTime()  + avail.bufferTime  * 60_000);
      if (slotEnd > dayEnd) break;

      slotsData.push({
        adminId,
        date:      dayMidnight,
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
    const { days, timezone = 'Asia/Karachi' } = body;

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json({ success: false, message: 'days array is required' }, { status: 400 });
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    for (const day of days) {
      if (!day.isActive) continue;
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

    // Delete future available slots and regenerate with correct PKT times
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