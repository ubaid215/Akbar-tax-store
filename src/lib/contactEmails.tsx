import { render } from '@react-email/render'
import { Resend } from 'resend'
import ContactAdminNotification from '@/emails/ContactAdminNotification'
import ClientConfirmationEmail from '@/emails/ClientConfirmationEmail'
import { resolveEmailFrom } from '@/lib/email'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactPayload = {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

function submittedAtPk(): string {
  return new Date().toLocaleString('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  })
}

function truncateMessage(text: string, max = 400): string {
  const t = text.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max).trim()}…`
}

function getAdminEmail(): string {
  return (
    process.env.CONTACT_ADMIN_EMAIL?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    'info@akbartaxstore.com'
  )
}

/**
 * Notifies the site owner about a new contact form submission.
 */
export async function sendContactAdminNotification(data: ContactPayload): Promise<boolean> {
  const from = resolveEmailFrom()
  if (!from) return false
  if (!process.env.RESEND_API_KEY) {
    console.error('[contactEmails] RESEND_API_KEY is not set')
    return false
  }

  const to = getAdminEmail()
  const html = await render(
    <ContactAdminNotification
      name={data.name}
      email={data.email}
      phone={data.phone}
      subject={data.subject}
      message={data.message}
      submittedAt={submittedAtPk()}
    />
  )

  const { data: sent, error } = await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `[Contact] ${data.subject} — ${data.name}`,
    html,
  })

  if (error) {
    console.error('[contactEmails] admin notification Resend error:', error)
    return false
  }
  console.log('[contactEmails] admin notification sent', sent?.id)
  return true
}

/**
 * Confirms to the visitor that their message was received.
 */
export async function sendClientConfirmationEmail(data: ContactPayload): Promise<boolean> {
  const from = resolveEmailFrom()
  if (!from) return false
  if (!process.env.RESEND_API_KEY) {
    console.error('[contactEmails] RESEND_API_KEY is not set')
    return false
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.akbartaxstore.com'
  const html = await render(
    <ClientConfirmationEmail
      name={data.name}
      subject={data.subject}
      messagePreview={truncateMessage(data.message)}
      siteUrl={siteUrl}
    />
  )

  const { data: sent, error } = await resend.emails.send({
    from,
    to: data.email.trim(),
    subject: 'We received your message — Akbar Tax Store',
    html,
  })

  if (error) {
    console.error('[contactEmails] client confirmation Resend error:', error)
    return false
  }
  console.log('[contactEmails] client confirmation sent', sent?.id)
  return true
}

export async function sendContactFormEmails(data: ContactPayload): Promise<{
  adminOk: boolean
  clientOk: boolean
}> {
  const [adminOk, clientOk] = await Promise.all([
    sendContactAdminNotification(data),
    sendClientConfirmationEmail(data),
  ])
  return { adminOk, clientOk }
}
