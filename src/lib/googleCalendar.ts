// src/lib/googleCalendar.ts
import { google } from 'googleapis'

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
}

const getCalendar = () => google.calendar({ version: 'v3', auth: getAuth() })

export async function addCalendarEvent(booking: {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  attendeeEmail: string
  attendeeName: string
  isVirtual?: boolean
  bookingId?: string
  calendarId?: string
}) {
  const calendar = getCalendar()
  const startDateTime = `${booking.date}T${booking.startTime}:00`
  const endDateTime = `${booking.date}T${booking.endTime}:00`
  const calendarId = booking.calendarId || process.env.GOOGLE_CALENDAR_ID

  const insertParams: any = {
    calendarId,
    requestBody: {
      summary: booking.title,
      description: `${booking.description}\n\nClient: ${booking.attendeeName} <${booking.attendeeEmail}>`.trim(),
      start: { dateTime: startDateTime, timeZone: process.env.TIMEZONE || 'Asia/Karachi' },
      end: { dateTime: endDateTime, timeZone: process.env.TIMEZONE || 'Asia/Karachi' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    },
  }

  if (booking.isVirtual && booking.bookingId) {
    insertParams.conferenceDataVersion = 1
    insertParams.requestBody.conferenceData = {
      createRequest: {
        requestId: `booking-${booking.bookingId}`,
      },
    }
  }

  try {
    const event = await calendar.events.insert(insertParams)
    return event.data
  } catch (error: any) {
    const message = String(error?.message || '')
    const causeMessage = String(error?.cause?.message || '')
    const invalidConferenceType =
      message.includes('Invalid conference type value') ||
      causeMessage.includes('Invalid conference type value')

    // Some calendars/accounts reject conference creation; gracefully fall back
    // to creating a normal event so booking confirmation flow remains stable.
    if (booking.isVirtual && invalidConferenceType) {
      const fallbackParams = { ...insertParams }
      delete fallbackParams.conferenceDataVersion
      if (fallbackParams.requestBody) {
        delete fallbackParams.requestBody.conferenceData
      }
      const fallbackEvent = await calendar.events.insert(fallbackParams)
      return fallbackEvent.data
    }

    throw error
  }
}

export async function deleteCalendarEvent(eventId: string, calendarIdInput?: string) {
  const calendar = getCalendar()
  const calendarId = calendarIdInput || process.env.GOOGLE_CALENDAR_ID
  await calendar.events.delete({
    calendarId: calendarId!,
    eventId,
    sendUpdates: 'all',
  })
}

export async function testCalendarConnection() {
  try {
    const calendar = getCalendar()
    await calendar.calendars.get({ calendarId: process.env.GOOGLE_CALENDAR_ID! })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
