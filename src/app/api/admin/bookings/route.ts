import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const date = searchParams.get('date') || ''

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(date && { date }),
      ...(search && {
        OR: [
          { clientName: { contains: search, mode: 'insensitive' } },
          { clientEmail: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: { service: true },
    orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
  })

  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clientName, clientEmail, clientPhone, serviceId, date, startTime, endTime, notes, customFields } = body

  if (!clientName || !clientEmail || !date || !startTime || !endTime) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const booking = await prisma.booking.create({
    data: {
      clientName,
      clientEmail,
      clientPhone: clientPhone || null,
      serviceId: serviceId || null,
      date,
      startTime,
      endTime,
      notes: notes || null,
      customFields: customFields || {},
      status: 'PENDING',
    },
    include: { service: true },
  })

  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
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
          '[admin bookings POST] admin new-booking alert was not sent. Check template alias/id, EMAIL_FROM, and admin recipient.'
        )
      }
    } else {
      console.error(
        '[admin bookings POST] admin recipient missing. Set Settings.businessEmail or ADMIN_ALERT_EMAIL/EMAIL_ADMIN.'
      )
    }
  } catch (e) {
    console.error('Admin create alert email error (non-fatal):', e)
  }

  return NextResponse.json(booking, { status: 201 })
}
