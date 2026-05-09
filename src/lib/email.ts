/**
 * Resend transactional emails — dashboard templates only (no raw HTML here).
 * Set template UUIDs in env (Resend Dashboard → Templates → copy id).
 *
 * RESEND_TEMPLATE_ID_BOOKING_RECEIVED
 * RESEND_TEMPLATE_ID_BOOKING_CONFIRMED
 * RESEND_TEMPLATE_ID_BOOKING_REJECTED
 * RESEND_TEMPLATE_ID_BOOKING_REMINDER
 * RESEND_TEMPLATE_ID_ADMIN_NEW_BOOKING_ALERT
 * RESEND_TEMPLATE_ID_ADMIN_MEETING_REMINDER
 */
import { Resend } from 'resend'
import type { Booking, Service } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Resend template UUIDs (dashboard names: booking-received, booking-confirmed, booking-reminder,
 * booking-rejected, admin-new-booking-alert, admin-meeting-reminder).
 * Prefer env vars in production; you can paste ids into env or a local wrapper.
 */
export const TEMPLATE_IDS = {
  bookingReceived:
    process.env.RESEND_TEMPLATE_ID_BOOKING_RECEIVED ?? 'booking-received',
  bookingConfirmed:
    process.env.RESEND_TEMPLATE_ID_BOOKING_CONFIRMED ?? 'booking-confirmed',
  bookingRejected:
    process.env.RESEND_TEMPLATE_ID_BOOKING_REJECTED ?? 'booking-rejected',
  bookingReminder:
    process.env.RESEND_TEMPLATE_ID_BOOKING_REMINDER ?? 'booking-reminder',
  adminNewBookingAlert:
    process.env.RESEND_TEMPLATE_ID_ADMIN_NEW_BOOKING_ALERT ??
    'admin-new-booking-alert',
  adminMeetingReminder:
    process.env.RESEND_TEMPLATE_ID_ADMIN_MEETING_REMINDER ??
    'admin-meeting-reminder',
} as const

type BookingWithService = Booking & { service: Service | null }

function str(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return ''
  return String(v)
}

/** Never use Gmail as the sender domain. */
export function resolveEmailFrom(): string | null {
  const raw = process.env.EMAIL_FROM?.trim()
  if (!raw) {
    console.error('[email] EMAIL_FROM is not set')
    return null
  }
  const extracted = raw.match(/<([^>]+)>/)?.[1]?.trim() || raw
  if (/@gmail\.com/i.test(extracted)) {
    console.error('[email] EMAIL_FROM must not be a Gmail address')
    return null
  }
  return raw.includes('<') ? raw : `Akbar Tax Store <${extracted}>`
}

export function getReminderHeading(minutes: number): string {
  const m = minutes || 60
  if (m <= 60) return 'Your appointment starts in 1 hour!'
  if (m <= 120) return 'Your appointment starts in 2 hours!'
  if (m <= 360) return 'Your appointment is later today!'
  return 'Your appointment is tomorrow!'
}

export function getCountdownText(minutes: number): string {
  const m = minutes || 60
  if (m <= 60) return '⏰ Starting in 1 hour'
  if (m <= 120) return '⏰ Starting in 2 hours'
  if (m <= 360) return '⏰ Later today'
  return '⏰ Tomorrow'
}

export function getPreviewText(minutes: number): string {
  const m = minutes || 60
  if (m <= 60) return 'Your appointment starts in 1 hour!'
  if (m <= 120) return 'Your appointment is in 2 hours.'
  if (m <= 360) return 'You have an appointment later today.'
  return 'Reminder: you have an appointment tomorrow.'
}

export function getClientInitial(name: string): string {
  const t = (name || '').trim()
  return t ? t.charAt(0).toUpperCase() : '?'
}

export function getSubmittedAt(): string {
  return new Date().toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  })
}

export function getServiceName(
  booking: Pick<BookingWithService, 'service'>,
  serviceOverride?: Service | null
): string {
  const s = serviceOverride !== undefined ? serviceOverride : booking.service
  return s?.name ?? 'General Consultation'
}

export function getMeetingType(isVirtual: boolean): string {
  return isVirtual ? 'Virtual Meeting 📹' : 'In-Person Meeting 🏢'
}

const templateIdCache = new Map<string, string>()

function looksLikeTemplateId(v: string): boolean {
  // Resend template IDs are UUID-like strings.
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v.trim()
  )
}

async function resolveTemplateId(templateRef: string): Promise<string | null> {
  const ref = templateRef.trim()
  if (!ref) return null
  if (looksLikeTemplateId(ref)) return ref

  const cached = templateIdCache.get(ref)
  if (cached) return cached

  const { data, error } = await resend.templates.get(ref)
  if (error || !data?.id) {
    const msg =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error || 'Template not found')
    console.error(`[email] failed to resolve template alias "${ref}":`, msg)
    return null
  }

  templateIdCache.set(ref, data.id)
  return data.id
}

async function sendTemplate(
  to: string,
  templateIdOrAlias: string,
  variables: Record<string, string>,
  context: string
): Promise<boolean> {
  const from = resolveEmailFrom()
  if (!from) return false
  if (!templateIdOrAlias) {
    console.error(`[email] missing template id for ${context}`)
    return false
  }
  if (!to?.trim()) {
    console.error(`[email] missing recipient for ${context}`)
    return false
  }

  const templateId = await resolveTemplateId(templateIdOrAlias)
  if (!templateId) {
    console.error(`[email] could not resolve template for ${context}`)
    return false
  }

  const { data, error } = await resend.emails.send({
    from,
    to: to.trim(),
    template: {
      id: templateId,
      variables,
    },
  })

  if (error) {
    const msg =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error)
    console.error(`[email] ${context} Resend error:`, msg)
    return false
  }
  console.log(`[email] ${context} sent`, data?.id)
  return true
}

export async function sendBookingReceivedEmail(
  booking: BookingWithService,
  service?: Service | null
): Promise<boolean> {
  try {
    return await sendTemplate(
      booking.clientEmail,
      TEMPLATE_IDS.bookingReceived,
      {
        clientName: str(booking.clientName),
        clientEmail: str(booking.clientEmail),
        date: str(booking.date),
        startTime: str(booking.startTime),
        endTime: str(booking.endTime),
        serviceName: getServiceName(booking, service),
      },
      'booking-received'
    )
  } catch (e) {
    console.error('[email] sendBookingReceivedEmail exception:', e)
    return false
  }
}

export async function sendBookingConfirmedEmail(
  booking: BookingWithService,
  service?: Service | null
): Promise<boolean> {
  try {
    const isVirtual = !!booking.isVirtual
    const meet = (booking.meetLink || '').trim() || '#'
    return await sendTemplate(
      booking.clientEmail,
      TEMPLATE_IDS.bookingConfirmed,
      {
        clientName: str(booking.clientName),
        date: str(booking.date),
        startTime: str(booking.startTime),
        endTime: str(booking.endTime),
        serviceName: getServiceName(booking, service),
        meetingType: getMeetingType(isVirtual),
        meetLink: meet,
        notes: booking.notes?.trim() ? str(booking.notes) : 'None',
      },
      'booking-confirmed'
    )
  } catch (e) {
    console.error('[email] sendBookingConfirmedEmail exception:', e)
    return false
  }
}

export async function sendBookingRejectedEmail(
  booking: BookingWithService,
  customMessage?: string | null
): Promise<boolean> {
  try {
    const msg =
      (customMessage || '').trim() ||
      'Unfortunately we are unable to accommodate your booking at this time. Please try booking another slot.'
    return await sendTemplate(
      booking.clientEmail,
      TEMPLATE_IDS.bookingRejected,
      {
        clientName: str(booking.clientName),
        date: str(booking.date),
        startTime: str(booking.startTime),
        customMessage: msg,
      },
      'booking-rejected'
    )
  } catch (e) {
    console.error('[email] sendBookingRejectedEmail exception:', e)
    return false
  }
}

export async function sendBookingReminderEmail(
  booking: BookingWithService,
  service?: Service | null
): Promise<boolean> {
  try {
    const minutes = booking.reminderTime ?? 60
    const isVirtual = !!booking.isVirtual
    const meet = (booking.meetLink || '').trim() || '#'
    return await sendTemplate(
      booking.clientEmail,
      TEMPLATE_IDS.bookingReminder,
      {
        clientName: str(booking.clientName),
        date: str(booking.date),
        startTime: str(booking.startTime),
        endTime: str(booking.endTime),
        serviceName: getServiceName(booking, service),
        meetingType: getMeetingType(isVirtual),
        meetLink: meet,
        reminderHeading: getReminderHeading(minutes),
        countdownText: getCountdownText(minutes),
        previewText: getPreviewText(minutes),
      },
      'booking-reminder'
    )
  } catch (e) {
    console.error('[email] sendBookingReminderEmail exception:', e)
    return false
  }
}

export async function sendAdminNewBookingAlert(
  booking: BookingWithService,
  adminEmail: string,
  service?: Service | null
): Promise<boolean> {
  try {
    const to = adminEmail.trim()
    if (!to) {
      console.error('[email] sendAdminNewBookingAlert: adminEmail empty')
      return false
    }
    return await sendTemplate(
      to,
      TEMPLATE_IDS.adminNewBookingAlert,
      {
        clientName: str(booking.clientName),
        clientInitial: getClientInitial(booking.clientName),
        clientEmail: str(booking.clientEmail),
        clientPhone: booking.clientPhone?.trim() ? str(booking.clientPhone) : 'Not provided',
        date: str(booking.date),
        startTime: str(booking.startTime),
        endTime: str(booking.endTime),
        serviceName: getServiceName(booking, service),
        notes: booking.notes?.trim() ? str(booking.notes) : 'No notes provided',
        bookingId: str(booking.id),
        submittedAt: getSubmittedAt(),
      },
      'admin-new-booking-alert'
    )
  } catch (e) {
    console.error('[email] sendAdminNewBookingAlert exception:', e)
    return false
  }
}

export async function sendAdminMeetingReminderEmail(
  booking: BookingWithService,
  adminEmail: string,
  service?: Service | null
): Promise<boolean> {
  try {
    const to = adminEmail.trim()
    if (!to) {
      console.error('[email] sendAdminMeetingReminderEmail: adminEmail empty')
      return false
    }
    const minutes = booking.reminderTime ?? 60
    const isVirtual = !!booking.isVirtual
    const meet = (booking.meetLink || '').trim() || '#'
    return await sendTemplate(
      to,
      TEMPLATE_IDS.adminMeetingReminder,
      {
        clientName: str(booking.clientName),
        clientInitial: getClientInitial(booking.clientName),
        clientEmail: str(booking.clientEmail),
        clientPhone: booking.clientPhone?.trim() ? str(booking.clientPhone) : 'Not provided',
        date: str(booking.date),
        startTime: str(booking.startTime),
        endTime: str(booking.endTime),
        serviceName: getServiceName(booking, service),
        meetingType: getMeetingType(isVirtual),
        meetLink: meet,
        notes: booking.notes?.trim() ? str(booking.notes) : 'No notes provided',
        bookingId: str(booking.id),
        countdownText: getCountdownText(minutes),
      },
      'admin-meeting-reminder'
    )
  } catch (e) {
    console.error('[email] sendAdminMeetingReminderEmail exception:', e)
    return false
  }
}
