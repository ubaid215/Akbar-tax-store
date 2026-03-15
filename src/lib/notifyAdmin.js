// src/lib/notifyAdmin.js
// Call this whenever a new booking is created via the public form
// It writes a Notification record that the SSE stream picks up
import { prisma } from '@/lib/prisma';

/**
 * Creates a PUSH notification record for the admin.
 * The AdminHeader SSE stream polls notifications and will surface this
 * to the admin's bell icon within ~8 seconds.
 *
 * @param {object} booking  — prisma Booking record
 * @param {string} adminId  — admin's user ID
 */
export async function notifyAdminNewBooking(booking, adminId) {
  try {
    await prisma.notification.create({
      data: {
        adminId,
        clientEmail: booking.clientEmail,
        clientName:  booking.clientName,
        bookingId:   booking.id,
        type:        'NEW_BOOKING',
        channel:     'PUSH',
        status:      'PENDING', // will be picked up by SSE, not yet "sent"
        body:        `New booking from ${booking.clientName} — ${booking.bookingRef}`,
        scheduledAt: new Date(),
      },
    });
  } catch (err) {
    // Non-critical — log but don't throw
    console.error('[notifyAdminNewBooking]', err.message);
  }
}

/**
 * Creates a notification for any status change
 */
export async function notifyAdminStatusChange(booking, adminId, newStatus) {
  const typeMap = {
    CANCELLED:    'BOOKING_CANCELLED',
    CONFIRMED:    'BOOKING_CONFIRMED',
    COMPLETED:    'BOOKING_COMPLETED',
    RESCHEDULED:  'BOOKING_RESCHEDULED',
  };
  const type = typeMap[newStatus];
  if (!type) return;

  try {
    await prisma.notification.create({
      data: {
        adminId,
        clientEmail: booking.clientEmail,
        clientName:  booking.clientName,
        bookingId:   booking.id,
        type,
        channel:     'PUSH',
        status:      'PENDING',
        body:        `Booking ${booking.bookingRef} ${newStatus.toLowerCase()} by client`,
        scheduledAt: new Date(),
      },
    });
  } catch (err) {
    console.error('[notifyAdminStatusChange]', err.message);
  }
}