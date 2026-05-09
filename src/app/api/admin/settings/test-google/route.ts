import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
    const calendarId = settings?.googleCalendarId || process.env.GOOGLE_CALENDAR_ID

    if (!calendarId) {
      return NextResponse.json({ success: false, error: 'No Calendar ID configured in settings' })
    }

    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (!email || !key) {
      return NextResponse.json({ success: false, error: 'GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY missing from .env' })
    }

    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // calendars.get works for externally shared calendars; calendarList.get only works for the SA's own list
    await calendar.calendars.get({ calendarId })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
