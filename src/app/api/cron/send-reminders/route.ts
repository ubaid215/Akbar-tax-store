import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isReminderDue } from '@/lib/appointmentTime'
import {
  sendBookingReminderEmail,
  sendAdminMeetingReminderEmail,
} from '@/lib/email'

const WINDOW_MS = 8 * 60 * 1000 // slightly wider than 5 min cron tick for drift

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function run(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    console.error('[cron/send-reminders] CRON_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const headerSecret = req.headers.get('x-cron-secret')
  const auth = req.headers.get('authorization')
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null
  if (headerSecret !== secret && bearer !== secret) {
    return unauthorized()
  }

  const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } })
  const adminEmail = settings?.businessEmail?.trim() || ''

  const candidates = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      sendReminder: true,
      reminderSent: false,
    },
    include: { service: true },
  })

  const now = Date.now()
  let processed = 0

  for (const booking of candidates) {
    const minutes = booking.reminderTime ?? 60
    if (!isReminderDue(booking.date, booking.startTime, minutes, now, WINDOW_MS)) {
      continue
    }

    let clientOk = false
    try {
      clientOk = await sendBookingReminderEmail(booking)
    } catch (e) {
      console.error('[cron/send-reminders] client reminder failed', booking.id, e)
    }

    if (adminEmail) {
      try {
        await sendAdminMeetingReminderEmail(booking, adminEmail)
      } catch (e) {
        console.error('[cron/send-reminders] admin reminder failed', booking.id, e)
      }
    } else {
      console.warn('[cron/send-reminders] businessEmail empty — admin meeting reminder skipped')
    }

    if (!clientOk) {
      console.error('[cron/send-reminders] client reminder not sent — will retry on next run', booking.id)
      continue
    }

    try {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSent: true },
      })
      processed++
    } catch (e) {
      console.error('[cron/send-reminders] failed to mark reminderSent', booking.id, e)
    }
  }

  return NextResponse.json({ ok: true, processed })
}

export async function GET(req: NextRequest) {
  return run(req)
}

export async function POST(req: NextRequest) {
  return run(req)
}
