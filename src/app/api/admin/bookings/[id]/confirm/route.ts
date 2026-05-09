import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSettingsRow } from '@/lib/dashboard-security'
import { sendBookingConfirmedEmail } from '@/lib/email'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const {
    sendReminder,
    reminderMinutes,
    isVirtual: isVirtualRaw,
    meetLink: meetLinkBody,
  } = body as {
    sendReminder?: boolean
    reminderMinutes?: number
    isVirtual?: boolean
    meetLink?: string
  }

  const isVirtual = !!isVirtualRaw
  const manualMeet =
    typeof meetLinkBody === 'string' ? meetLinkBody.trim() : ''

  const settings = await getSettingsRow()
  const calendarId = settings?.googleCalendarId || process.env.GOOGLE_CALENDAR_ID

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  })
  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let calendarEventId: string | null = booking.calendarEventId
  let meetLink: string | null = booking.meetLink

  try {
    if (calendarId) {
      const { addCalendarEvent } = await import('@/lib/googleCalendar')
      const event = await addCalendarEvent({
        title: booking.service
          ? `${booking.service.name} — ${booking.clientName}`
          : `Appointment — ${booking.clientName}`,
        description: booking.notes || '',
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        attendeeEmail: booking.clientEmail,
        attendeeName: booking.clientName,
        isVirtual,
        bookingId: id,
        calendarId,
      })
      calendarEventId = event.id || null
      const hangout = (event as { hangoutLink?: string }).hangoutLink
      meetLink = hangout || null
    }
  } catch (e) {
    console.error('Calendar error (non-fatal):', e)
  }

  if (manualMeet) {
    meetLink = manualMeet
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status: 'CONFIRMED',
      calendarEventId,
      meetLink: meetLink || null,
      isVirtual,
      sendReminder: sendReminder ?? false,
      reminderTime: reminderMinutes ?? 60,
      reminderSent: false,
    },
    include: { service: true },
  })

  try {
    await sendBookingConfirmedEmail(updated, updated.service)
  } catch (e) {
    console.error('Confirmation email error (non-fatal):', e)
  }

  return NextResponse.json(updated)
}
