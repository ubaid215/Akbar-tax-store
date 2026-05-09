import { NextResponse } from 'next/server'
import { sendContactFormEmails } from '@/lib/contactEmails'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(str: unknown, max: number): string {
  if (typeof str !== 'string') return ''
  return str.trim().slice(0, max).replace(/\0/g, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 })
    }

    const name = sanitize(body.name, 200)
    const email = sanitize(body.email, 254)
    const phone = sanitize(body.phone, 40)
    const subject = sanitize(body.subject, 200)
    const message = sanitize(body.message, 8000)

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'Please fill in name, email, subject, and message.' },
        { status: 400 }
      )
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ message: 'Please enter a valid email address.' }, { status: 400 })
    }

    const { adminOk, clientOk } = await sendContactFormEmails({
      name,
      email,
      phone,
      subject,
      message,
    })

    if (!adminOk) {
      return NextResponse.json(
        {
          message:
            'We could not deliver your message right now. Please try again later or contact us on WhatsApp.',
        },
        { status: 502 }
      )
    }

    if (!clientOk) {
      return NextResponse.json({
        ok: true,
        partial: true,
        message:
          'Your message was received. If you do not see a confirmation email shortly, please check your spam folder.',
      })
    }

    return NextResponse.json({ ok: true, message: 'Message sent successfully.' })
  } catch (e) {
    console.error('[api/contact] POST error:', e)
    return NextResponse.json({ message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
