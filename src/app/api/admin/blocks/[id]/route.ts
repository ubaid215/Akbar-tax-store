import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCalendarEvent } from '@/lib/googleCalendar'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const block = await prisma.adminBlock.findUnique({ where: { id } })
  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const calendarId = settings?.googleCalendarId || process.env.GOOGLE_CALENDAR_ID

  if (block?.calendarEventId) {
    try {
      await deleteCalendarEvent(block.calendarEventId, calendarId)
    } catch (e) {
      console.error('Calendar delete failed:', e)
    }
  }

  await prisma.adminBlock.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
