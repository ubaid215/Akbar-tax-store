// src/app/api/availability/overrides/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PKT_OFFSET_HOURS = 5;

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function addDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}
function localStartOfToday() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d;
}

// ✅ Build time using UTC hours so PKT "09:00" = T04:00:00Z on any server
function buildPKTTime(calendarDate, timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const d = new Date(calendarDate);
  d.setUTCHours(h - PKT_OFFSET_HOURS, m, 0, 0);
  return d;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const overrides = await prisma.availabilityOverride.findMany({
      where:   { adminId: session.user.id, date: { gte: localStartOfToday() } },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json({ success: true, data: overrides });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const adminId = session.user.id;
    const { date, reason } = await request.json();
    if (!date) return NextResponse.json({ success: false, message: 'date is required' }, { status: 400 });

    const parsedDate = parseLocalDate(date);
    if (parsedDate < localStartOfToday()) {
      return NextResponse.json({ success: false, message: 'Cannot block dates in the past' }, { status: 400 });
    }

    const override = await prisma.availabilityOverride.upsert({
      where:  { adminId_date: { adminId, date: parsedDate } },
      create: { adminId, date: parsedDate, isBlocked: true, reason: reason ?? null },
      update: { isBlocked: true, reason: reason ?? null },
    });

    await prisma.slot.deleteMany({
      where: { adminId, status: 'AVAILABLE', date: { gte: parsedDate, lt: addDays(parsedDate, 1) } },
    });

    return NextResponse.json({ success: true, message: 'Date blocked successfully', data: override });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const adminId   = session.user.id;
    const dateParam = new URL(request.url).searchParams.get('date');
    if (!dateParam) return NextResponse.json({ success: false, message: 'date query param required' }, { status: 400 });

    const parsedDate = parseLocalDate(dateParam);

    await prisma.availabilityOverride.deleteMany({
      where: { adminId, date: { gte: parsedDate, lt: addDays(parsedDate, 1) } },
    });

    // Re-generate slots for this date using correct PKT times
    const dayOfWeek = parsedDate.getDay();
    const dayNames  = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];

    const avail = await prisma.availability.findFirst({
      where: { adminId, dayOfWeek: dayNames[dayOfWeek], isActive: true },
    });

    if (avail) {
      // ✅ Use buildPKTTime so times are correct on Vercel UTC server
      const dayStart = buildPKTTime(parsedDate, avail.startTime);
      const dayEnd   = buildPKTTime(parsedDate, avail.endTime);

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
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}