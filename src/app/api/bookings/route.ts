// src/app/api/bookings/route.ts  (REPLACE existing file)
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSettingsRow } from '@/lib/dashboard-security'

// ─── GET: available slots for a given date ───────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const dateObj = new Date(date)
  const dayOfWeek = dateObj.getDay()

  // 1. Full-day block?
  const blocked = await prisma.blockedDate.findFirst({ where: { date } })
  if (blocked) return NextResponse.json({ slots: [], fullyBlocked: true })

  // 2. Day availability
  const availability = await prisma.availability.findUnique({
    where: { dayOfWeek },
    include: { slots: true },
  })
  if (!availability?.isOpen || !availability.slots.length) {
    return NextResponse.json({ slots: [], closed: true })
  }

  // 3. Settings
  const settings = await getSettingsRow()
  const slotDuration = settings?.slotDuration || 60
  const bufferTime = settings?.bufferTime || 0

  // 4. Existing client bookings (confirmed or pending)
  const clientBookings = await prisma.booking.findMany({
    where: { date, status: { in: ['PENDING', 'CONFIRMED'] } },
    select: { startTime: true, endTime: true },
  })

  // 5. Admin personal blocks → also shown as "booked" to clients
  const adminBlocks = await prisma.adminBlock.findMany({
    where: { date },
    select: { startTime: true, endTime: true },
  })

  // Combine both into one busy list
  const busyRanges = [
    ...clientBookings.map(b => ({ start: b.startTime, end: b.endTime, type: 'booked' as const })),
    ...adminBlocks.map(b => ({ start: b.startTime, end: b.endTime, type: 'booked' as const })),
  ]

  // 6. Generate slots
  const slots: { time: string; status: 'available' | 'booked' }[] = []

  for (const window of availability.slots) {
    const [sh, sm] = window.startTime.split(':').map(Number)
    const [eh, em] = window.endTime.split(':').map(Number)
    let current = sh * 60 + sm
    const windowEnd = eh * 60 + em

    while (current + slotDuration <= windowEnd) {
      const slotStart = toTime(current)
      const slotEnd = toTime(current + slotDuration)

      const isBusy = busyRanges.some(({ start, end }) => {
        const bStart = toMinutes(start)
        const bEnd = toMinutes(end)
        return current < bEnd && current + slotDuration > bStart
      })

      slots.push({ time: slotStart, status: isBusy ? 'booked' : 'available' })
      current += slotDuration + bufferTime
    }
  }

  return NextResponse.json({ slots, slotDuration })
}

// ─── POST: submit a new booking ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clientName, clientEmail, clientPhone, serviceId, date, startTime, endTime, notes, customFields } = body

  if (!clientName || !clientEmail || !date || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Conflict check — client bookings
  const conflict = await prisma.booking.findFirst({
    where: {
      date,
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        { startTime: { gte: startTime, lt: endTime } },
        { endTime: { gt: startTime, lte: endTime } },
        { startTime: { lte: startTime }, endTime: { gte: endTime } },
      ],
    },
  })
  if (conflict) return NextResponse.json({ error: 'This slot is no longer available' }, { status: 409 })

  // Conflict check — admin blocks
  const adminConflict = await prisma.adminBlock.findFirst({
    where: {
      date,
      OR: [
        { startTime: { gte: startTime, lt: endTime } },
        { endTime: { gt: startTime, lte: endTime } },
        { startTime: { lte: startTime }, endTime: { gte: endTime } },
      ],
    },
  })
  if (adminConflict) return NextResponse.json({ error: 'This slot is not available' }, { status: 409 })

  // Full-day block check
  const blocked = await prisma.blockedDate.findFirst({ where: { date } })
  if (blocked) return NextResponse.json({ error: 'This date is not available' }, { status: 409 })

  const booking = await prisma.booking.create({
    data: {
      clientName, clientEmail, clientPhone,
      serviceId: serviceId || null,
      date, startTime, endTime, notes,
      customFields: customFields || {},
      status: 'PENDING',
    },
    include: { service: true },
  })

  try {
    const { sendBookingReceivedEmail } = await import('@/lib/email')
    await sendBookingReceivedEmail(booking, booking.service)
  } catch (e) {
    console.error('[bookings POST] client booking-received email failed:', e)
  }

  try {
    const settings = await getSettingsRow()
    const adminTo =
      settings?.businessEmail?.trim() ||
      process.env.ADMIN_ALERT_EMAIL?.trim() ||
      process.env.EMAIL_ADMIN?.trim() ||
      process.env.EMAIL_FROM?.match(/<([^>]+)>/)?.[1]?.trim() ||
      process.env.EMAIL_FROM?.trim() ||
      ''
    if (adminTo) {
      const { sendAdminNewBookingAlert } = await import('@/lib/email')
      const sent = await sendAdminNewBookingAlert(booking, adminTo, booking.service)
      if (!sent) {
        console.error(
          '[bookings POST] admin new-booking alert was not sent. Check template alias/id, EMAIL_FROM, and admin recipient.'
        )
      }
    } else {
      console.error(
        '[bookings POST] admin recipient missing. Set Settings.businessEmail or ADMIN_ALERT_EMAIL/EMAIL_ADMIN.'
      )
    }
  } catch (e) {
    console.error('[bookings POST] admin new-booking alert failed:', e)
  }

  return NextResponse.json({ success: true, bookingId: booking.id }, { status: 201 })
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}
function toTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}
