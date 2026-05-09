import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBookingRejectedEmail } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { customMessage } = await req.json().catch(() => ({}))

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const calendarId = settings?.googleCalendarId || process.env.GOOGLE_CALENDAR_ID

  if (booking.calendarEventId) {
    try {
      const { deleteCalendarEvent } = await import('@/lib/googleCalendar')
      await deleteCalendarEvent(booking.calendarEventId, calendarId)
    } catch (e) {
      console.error('Calendar delete error (non-fatal):', e)
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'REJECTED', calendarEventId: null },
    include: { service: true },
  })

  try {
    await sendBookingRejectedEmail(updated, customMessage)
  } catch (e) {
    console.error('Rejection email error (non-fatal):', e)
  }

  return NextResponse.json(updated)
}
