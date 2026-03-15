// src/app/api/public/slots/route.js
// GET /api/public/slots?date=YYYY-MM-DD
//
// Returns future slots only for the time picker.
// Includes isToday flag so the frontend can show a better message
// when today is selected but all slots have passed.

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toYMD(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ success: false, message: 'date param required' }, { status: 400 });
    }

    const admin = await prisma.user.findFirst({
      where:   { status: 'ACTIVE', role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select:  { id: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'No admin configured' }, { status: 404 });
    }

    const dayStart = parseLocalDate(date);
    const dayEnd   = addDays(dayStart, 1);
    const isToday  = toYMD(new Date()) === date;

    // Check for blocked override
    const override = await prisma.availabilityOverride.findFirst({
      where: {
        adminId:   admin.id,
        isBlocked: true,
        date:      { gte: dayStart, lt: dayEnd },
      },
    });

    if (override) {
      return NextResponse.json({
        success: true,
        data: { slots: [], blocked: true, reason: override.reason },
      });
    }

    // ── All slots for this date ───────────────────────────────
    const allSlots = await prisma.slot.findMany({
      where: {
        adminId: admin.id,
        status:  'AVAILABLE',
        date:    { gte: dayStart, lt: dayEnd },
      },
      orderBy: { startTime: 'asc' },
      select:  { id: true, startTime: true, endTime: true, capacity: true, booked: true },
    });

    const now = new Date();

    // ── Future slots only (for the time picker) ───────────────
    const futureSlots = allSlots
      .filter(s => s.booked < s.capacity && s.startTime > now)
      .map(s => ({
        id:        s.id,
        startTime: s.startTime.toISOString(),
        endTime:   s.endTime.toISOString(),
        label:     s.startTime.toLocaleTimeString('en-US', {
          hour:     'numeric',
          minute:   '2-digit',
          hour12:   true,
          timeZone: 'Asia/Karachi',
        }),
        available: s.capacity - s.booked,
      }));

    // allSlotsToday > 0 but futureSlots = 0 means today's slots all passed
    const allPassedToday = isToday && allSlots.length > 0 && futureSlots.length === 0;

    return NextResponse.json({
      success: true,
      data: {
        slots:         futureSlots,
        blocked:       false,
        isToday,
        allPassedToday, // ← frontend uses this for a better message
      },
    });
  } catch (error) {
    console.error('[GET /api/public/slots]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}