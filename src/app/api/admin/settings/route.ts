import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  })

  return NextResponse.json({
    ...settings,
    customFields: settings.customFields as object[],
    bookingFormFields:
      ((settings as { bookingFormFields?: unknown }).bookingFormFields as object[]) ||
      (settings.customFields as object[]) ||
      [],
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    businessName, businessEmail, businessPhone, timezone,
    slotDuration, bufferTime, maxAdvanceBooking, minAdvanceBooking,
    customFields, confirmationSubject, rejectionSubject, reminderSubject,
    googleCalendarId, adminEmailNotify,
    bookingFormFields,
  } = body
  const normalizedFields = bookingFormFields ?? customFields ?? []

  const settings = await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {
      businessName, businessEmail, businessPhone, timezone,
      slotDuration, bufferTime, maxAdvanceBooking, minAdvanceBooking,
      confirmationSubject, rejectionSubject, reminderSubject,
      googleCalendarId, adminEmailNotify,
      bookingFormFields: normalizedFields,
      customFields: normalizedFields,
    },
    create: {
      id: 'singleton',
      businessName, businessEmail, businessPhone, timezone,
      slotDuration, bufferTime, maxAdvanceBooking, minAdvanceBooking,
      confirmationSubject, rejectionSubject, reminderSubject,
      googleCalendarId, adminEmailNotify,
      bookingFormFields: normalizedFields,
      customFields: normalizedFields,
    },
  })

  return NextResponse.json(settings)
}
