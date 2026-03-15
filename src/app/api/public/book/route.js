// src/app/api/public/book/route.js
// POST /api/public/book — public endpoint, no auth
// Creates a booking, sends client confirmation email, sends admin web push

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import webpush from 'web-push';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── VAPID setup ──────────────────────────────────────────────
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.MAILTRAP_FROM_EMAIL || 'admin@akbartaxstore.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}


// ── Booking ref generator ────────────────────────────────────
async function generateBookingRef() {
  const year  = new Date().getFullYear();
  const count = await prisma.booking.count();
  return `BK-${year}-${String(count + 1).padStart(4, '0')}`;
}

// ── Format datetime for Pakistan display ─────────────────────
function fmtPK(isoStr) {
  return new Date(isoStr).toLocaleString('en-US', {
    timeZone:  'Asia/Karachi',
    weekday:   'long',
    year:      'numeric',
    month:     'long',
    day:       'numeric',
    hour:      'numeric',
    minute:    '2-digit',
    hour12:    true,
  });
}

// ── Client confirmation email ─────────────────────────────────
async function sendClientEmail(booking, service, slotStart, slotEnd) {
  if (!process.env.RESEND_API_KEY) return;

  const dateStr     = fmtPK(slotStart);
  const endStr      = new Date(slotEnd).toLocaleTimeString('en-US', {
    timeZone: 'Asia/Karachi', hour: 'numeric', minute: '2-digit', hour12: true,
  });

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #D9E8FF;border-radius:8px;overflow:hidden;">
      <div style="background:#0040A8;padding:20px;text-align:center;">
        <h1 style="color:#fff;margin:0;">Akbar Tax Store</h1>
        <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Professional Tax Consultation</p>
      </div>
      <div style="padding:28px 24px;background:#fff;">
        <h2 style="color:#072971;margin:0 0 8px;">✅ Booking Confirmed!</h2>
        <p style="color:#374151;margin:0 0 20px;">Hello ${booking.clientName.split(' ')[0]},</p>
        <p style="color:#374151;margin:0 0 20px;">Your tax consultation has been scheduled. Please find the details below:</p>

        <div style="background:#F0F6FF;border-left:4px solid #0040A8;border-radius:6px;padding:16px 20px;margin:0 0 20px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#5D7A96;font-size:13px;font-weight:600;width:100px;">Reference</td>
              <td style="padding:6px 0;color:#0040A8;font-size:14px;font-weight:800;font-family:monospace;">${booking.bookingRef}</td>
            </tr>
            ${service ? `
            <tr>
              <td style="padding:6px 0;color:#5D7A96;font-size:13px;font-weight:600;">Service</td>
              <td style="padding:6px 0;color:#0B1E3D;font-size:13px;font-weight:600;">${service.name}</td>
            </tr>
            ${service.price ? `
            <tr>
              <td style="padding:6px 0;color:#5D7A96;font-size:13px;font-weight:600;">Fee</td>
              <td style="padding:6px 0;color:#059669;font-size:13px;font-weight:700;">$${Number(service.price).toFixed(2)}</td>
            </tr>` : ''}` : ''}
            <tr>
              <td style="padding:6px 0;color:#5D7A96;font-size:13px;font-weight:600;">Date & Time</td>
              <td style="padding:6px 0;color:#0B1E3D;font-size:13px;font-weight:600;">${dateStr} – ${endStr}</td>
            </tr>
          </table>
        </div>

        <p style="color:#6B7280;font-size:13px;margin:0 0 8px;">📍 Need to reschedule or cancel? Please contact us at least 24 hours before your appointment.</p>
        <p style="color:#6B7280;font-size:13px;margin:0 0 20px;">📞 +92-301-6832064</p>
        <p style="color:#374151;font-size:13px;margin:0;">Best regards,<br/><strong>The Akbar Tax Store Team</strong></p>
      </div>
      <div style="background:#072971;padding:12px;text-align:center;">
        <p style="color:rgba(255,255,255,0.6);margin:0;font-size:11px;">© ${new Date().getFullYear()} Akbar Tax Store. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from:    `Akbar Tax Store <${process.env.FROM_EMAIL || 'noreply@akbartaxstore.com'}>`,
      to:      booking.clientEmail,
      subject: `Appointment Confirmed — ${booking.bookingRef}`,
      html,
    });
  } catch (err) {
    console.error('[sendClientEmail]', err);
  }
}

// ── Web push to admin ─────────────────────────────────────────
async function pushAdminNotification(adminId, booking) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

  try {
    const admin = await prisma.user.findUnique({
      where:  { id: adminId },
      select: { pushToken: true, pushEnabled: true },
    });

    if (!admin?.pushEnabled || !admin?.pushToken) return;

    let subscription;
    try {
      subscription = JSON.parse(admin.pushToken);
    } catch {
      return; // not a valid push subscription JSON
    }

    // Only send if it looks like a browser push subscription
    if (!subscription?.endpoint) return;

    const payload = JSON.stringify({
      title: '📅 New Booking!',
      body:  `${booking.clientName} — ${booking.bookingRef}`,
      url:   '/dashboard/bookings',
    });

    await webpush.sendNotification(subscription, payload);
  } catch (err) {
    // Non-critical — push can fail silently
    console.error('[pushAdminNotification]', err.message);
  }
}

// ── POST handler ─────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { slotId, firstName, lastName, email, phone, serviceId, notes, timezone } = body;

    // Validation
    if (!slotId || !firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Required fields: slotId, firstName, lastName, email, phone' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    // Find slot
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });

    if (!slot) {
      return NextResponse.json({ success: false, message: 'Slot not found' }, { status: 404 });
    }
    if (slot.status !== 'AVAILABLE' || slot.booked >= slot.capacity) {
      return NextResponse.json(
        { success: false, message: 'This slot is no longer available. Please choose another time.' },
        { status: 409 }
      );
    }
    if (new Date(slot.startTime) < new Date()) {
      return NextResponse.json({ success: false, message: 'This slot has already passed.' }, { status: 409 });
    }

    // Validate service
    let service = null;
    if (serviceId) {
      service = await prisma.service.findFirst({ where: { id: serviceId, status: 'ACTIVE' } });
    }

    const bookingRef = await generateBookingRef();

    // Atomic: create booking + update slot
    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          bookingRef,
          adminId:        slot.adminId,
          slotId:         slot.id,
          serviceId:      service?.id ?? null,
          clientName:     `${firstName.trim()} ${lastName.trim()}`,
          clientEmail:    email.trim().toLowerCase(),
          clientPhone:    phone.trim(),
          clientTimezone: timezone ?? 'Asia/Karachi',
          clientNotes:    notes?.trim() ?? null,
          status:         'PENDING',
          startTime:      slot.startTime,
          endTime:        slot.endTime,
          bufferEndTime:  slot.bufferEnd ?? null,
          pricePaid:      service?.price ?? null,
          currency:       'USD',
        },
      }),
      prisma.slot.update({
        where: { id: slot.id },
        data: {
          booked: { increment: 1 },
          status: slot.booked + 1 >= slot.capacity ? 'BOOKED' : 'AVAILABLE',
        },
      }),
    ]);

    // Booking history
    await prisma.bookingHistory.create({
      data: {
        bookingId: booking.id,
        toStatus:  'PENDING',
        changedBy: 'client',
        reason:    'Booking created via public form',
      },
    }).catch(() => {});

    // In-app notification record (SSE stream picks this up)
    await prisma.notification.create({
      data: {
        adminId:     slot.adminId,
        clientEmail: booking.clientEmail,
        clientName:  booking.clientName,
        bookingId:   booking.id,
        type:        'NEW_BOOKING',
        channel:     'PUSH',
        status:      'PENDING',
        body:        `New booking from ${booking.clientName} — ${bookingRef}`,
        scheduledAt: new Date(),
      },
    }).catch(() => {});

    // Fire-and-forget: web push + client email (don't block response)
    Promise.allSettled([
      pushAdminNotification(slot.adminId, booking),
      sendClientEmail(booking, service, slot.startTime.toISOString(), slot.endTime.toISOString()),
    ]).catch(() => {});

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed!',
      data: {
        bookingRef,
        bookingId:  booking.id,
        clientName: booking.clientName,
        startTime:  slot.startTime.toISOString(),
        endTime:    slot.endTime.toISOString(),
        service:    service ? { name: service.name, price: service.price ? Number(service.price) : null } : null,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('[POST /api/public/book]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}