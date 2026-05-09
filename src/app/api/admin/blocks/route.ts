// src/app/api/admin/blocks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addCalendarEvent } from '@/lib/googleCalendar'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  const blocks = await prisma.adminBlock.findMany({
    where: date ? { date } : undefined,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  })
  return NextResponse.json(blocks)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, startTime, endTime, label, addToCalendar } = body
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const calendarId = settings?.googleCalendarId || process.env.GOOGLE_CALENDAR_ID

  // Validate times
  if (!date || !startTime || !endTime) {
    return NextResponse.json({ error: 'date, startTime and endTime are required' }, { status: 400 })
  }

  let calendarEventId: string | undefined

  // Optionally push to Google Calendar
  if (addToCalendar) {
    try {
      const event = await addCalendarEvent({
        title: label || 'Blocked — Admin',
        description: 'Admin personal block',
        date,
        startTime,
        endTime,
        attendeeEmail: process.env.BUSINESS_EMAIL || '',
        attendeeName: 'Admin',
        calendarId,
      })
      calendarEventId = event.id || undefined
    } catch (e) {
      console.error('Calendar push failed:', e)
    }
  }

  const block = await prisma.adminBlock.create({
    data: { date, startTime, endTime, label, addToCalendar, calendarEventId },
  })

  return NextResponse.json(block, { status: 201 })
}
