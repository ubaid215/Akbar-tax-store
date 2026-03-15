// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data ───────────────────────────────────
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.bookingHistory.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.availabilityOverride.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.analyticsDailySnapshot.deleteMany();
  await prisma.user.deleteMany();

  // ─── Admin User ────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@bookingsystem.com',
      name: 'System Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+1-555-0100',
      pushEnabled: true,
      emailEnabled: true,
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@bookingsystem.com',
      name: 'Jane Staff',
      password: await bcrypt.hash('Staff@123456', 12),
      role: 'ADMIN',
      status: 'ACTIVE',
      phone: '+1-555-0101',
    },
  });

  console.log('✅ Users created:', admin.email, staff.email);

  // ─── Availability (Mon–Fri, 9am–5pm) ───────────────────────
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  for (const day of days) {
    await prisma.availability.create({
      data: {
        adminId: admin.id,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 60,
        bufferTime: 10,
        maxBookings: 1,
        timezone: 'America/New_York',
        isActive: true,
      },
    });
  }

  // Saturday — half day
  await prisma.availability.create({
    data: {
      adminId: admin.id,
      dayOfWeek: 'SATURDAY',
      startTime: '10:00',
      endTime: '14:00',
      slotDuration: 60,
      bufferTime: 10,
      maxBookings: 1,
      timezone: 'America/New_York',
      isActive: true,
    },
  });

  console.log('✅ Availability created');

  // ─── Availability Override (block a day) ───────────────────
  await prisma.availabilityOverride.create({
    data: {
      adminId: admin.id,
      date: new Date('2025-12-25'),
      isBlocked: true,
      reason: 'Christmas Holiday',
    },
  });

  // ─── Services ──────────────────────────────────────────────
  const services = await Promise.all([
    prisma.service.create({
      data: {
        adminId: admin.id,
        name: 'Strategy Consultation',
        description: 'One-on-one business strategy session to align goals and roadmap.',
        status: 'ACTIVE',
        price: 150.00,
        currency: 'USD',
        duration: 60,
        bufferTime: 10,
        sortOrder: 1,
        color: '#3B82F6',
        icon: 'briefcase',
      },
    }),
    prisma.service.create({
      data: {
        adminId: admin.id,
        name: 'Technical Review',
        description: 'In-depth technical architecture and code review session.',
        status: 'ACTIVE',
        price: 200.00,
        currency: 'USD',
        duration: 90,
        bufferTime: 15,
        sortOrder: 2,
        color: '#10B981',
        icon: 'code',
      },
    }),
    prisma.service.create({
      data: {
        adminId: admin.id,
        name: 'Quick Discovery Call',
        description: 'A free 30-minute intro call to understand your needs.',
        status: 'ACTIVE',
        price: null, // free
        currency: 'USD',
        duration: 30,
        bufferTime: 5,
        sortOrder: 3,
        color: '#8B5CF6',
        icon: 'phone',
      },
    }),
    prisma.service.create({
      data: {
        adminId: admin.id,
        name: 'Workshop (Group)',
        description: 'Hands-on workshop for teams of up to 8 people.',
        status: 'INACTIVE',
        price: 500.00,
        currency: 'USD',
        duration: 180,
        bufferTime: 30,
        sortOrder: 4,
        color: '#F59E0B',
        icon: 'users',
      },
    }),
  ]);

  console.log('✅ Services created:', services.length);

  // ─── Slots ─────────────────────────────────────────────────
  const slotsData = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate slots for next 14 days
  for (let d = 0; d < 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dayNum = date.getDay(); // 0=Sun, 6=Sat
    if (dayNum === 0) continue; // skip Sunday

    const hours = [9, 10, 11, 13, 14, 15, 16];
    for (const hour of hours) {
      const start = new Date(date);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(60);
      const bufferEnd = new Date(end);
      bufferEnd.setMinutes(bufferEnd.getMinutes() + 10);

      slotsData.push({
        adminId: admin.id,
        date: new Date(date),
        startTime: start,
        endTime: end,
        bufferEnd: bufferEnd,
        status: 'AVAILABLE',
        capacity: 1,
        booked: 0,
      });
    }
  }

  await prisma.slot.createMany({ data: slotsData });
  const allSlots = await prisma.slot.findMany({
    where: { adminId: admin.id },
    orderBy: { startTime: 'asc' },
  });

  console.log('✅ Slots created:', allSlots.length);

  // ─── Sample Bookings ───────────────────────────────────────
  const bookingClients = [
    { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-1001' },
    { name: 'Bob Martinez', email: 'bob@example.com', phone: '+1-555-1002' },
    { name: 'Carol White', email: 'carol@example.com', phone: '+1-555-1003' },
    { name: 'David Kim', email: 'david@example.com', phone: '+1-555-1004' },
    { name: 'Emma Davis', email: 'emma@example.com', phone: '+1-555-1005' },
  ];

  const statuses = ['CONFIRMED', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];
  const createdBookings = [];

  for (let i = 0; i < 5; i++) {
    const slot = allSlots[i];
    await prisma.slot.update({
      where: { id: slot.id },
      data: { status: 'BOOKED', booked: 1 },
    });

    const booking = await prisma.booking.create({
      data: {
        bookingRef: `BK-2025-${String(i + 1).padStart(4, '0')}`,
        adminId: admin.id,
        slotId: slot.id,
        serviceId: i < services.length ? services[i % 3].id : null,
        clientName: bookingClients[i].name,
        clientEmail: bookingClients[i].email,
        clientPhone: bookingClients[i].phone,
        clientTimezone: 'America/New_York',
        clientNotes: i === 0 ? 'Looking forward to discussing our Q1 roadmap.' : null,
        status: statuses[i],
        startTime: slot.startTime,
        endTime: slot.endTime,
        bufferEndTime: slot.bufferEnd,
        pricePaid: i < 3 ? services[i % 3].price : null,
        currency: 'USD',
        adminNotes: i === 3 ? 'Great session, follow-up scheduled.' : null,
        cancelledAt: statuses[i] === 'CANCELLED' ? new Date() : null,
        cancelledBy: statuses[i] === 'CANCELLED' ? 'client' : null,
        cancellationReason: statuses[i] === 'CANCELLED' ? 'Schedule conflict' : null,
        reminder10MinSent: statuses[i] === 'COMPLETED',
        reminder24HrSent: statuses[i] === 'COMPLETED',
      },
    });

    createdBookings.push(booking);

    // BookingHistory
    await prisma.bookingHistory.create({
      data: {
        bookingId: booking.id,
        fromStatus: null,
        toStatus: 'PENDING',
        changedBy: 'system',
        reason: 'Booking created',
      },
    });

    if (statuses[i] !== 'PENDING') {
      await prisma.bookingHistory.create({
        data: {
          bookingId: booking.id,
          fromStatus: 'PENDING',
          toStatus: statuses[i],
          changedBy: 'admin',
          changedById: admin.id,
          reason: statuses[i] === 'CANCELLED' ? 'Client requested cancellation' : 'Status updated',
        },
      });
    }
  }

  console.log('✅ Bookings created:', createdBookings.length);

  // ─── Notifications ─────────────────────────────────────────
  for (const booking of createdBookings.slice(0, 3)) {
    await prisma.notification.create({
      data: {
        adminId: admin.id,
        clientEmail: booking.clientEmail,
        clientName: booking.clientName,
        bookingId: booking.id,
        type: 'NEW_BOOKING',
        channel: 'EMAIL',
        status: 'SENT',
        subject: `New Booking Confirmed – ${booking.bookingRef}`,
        body: `Hi ${booking.clientName}, your booking ${booking.bookingRef} has been received.`,
        sentAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        adminId: admin.id,
        bookingId: booking.id,
        type: 'NEW_BOOKING',
        channel: 'PUSH',
        status: 'SENT',
        body: `New booking from ${booking.clientName}`,
        sentAt: new Date(),
      },
    });
  }

  console.log('✅ Notifications created');

  // ─── Audit Logs ────────────────────────────────────────────
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: admin.id,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
      endpoint: '/api/auth/login',
    },
  });

  for (const booking of createdBookings.slice(0, 2)) {
    await prisma.auditLog.create({
      data: {
        userId: admin.id,
        action: 'CREATE',
        entity: 'Booking',
        entityId: booking.id,
        newValues: { bookingRef: booking.bookingRef, status: booking.status },
        endpoint: '/api/bookings',
      },
    });
  }

  console.log('✅ Audit logs created');

  // ─── Analytics ─────────────────────────────────────────────
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d;
  });

  for (const date of last7Days) {
    await prisma.analyticsDailySnapshot.create({
      data: {
        adminId: admin.id,
        date,
        totalBookings: Math.floor(Math.random() * 8) + 2,
        confirmed: Math.floor(Math.random() * 5) + 1,
        cancelled: Math.floor(Math.random() * 2),
        completed: Math.floor(Math.random() * 3),
        noShows: Math.floor(Math.random() * 1),
        pending: Math.floor(Math.random() * 3),
        totalRevenue: parseFloat((Math.random() * 600 + 200).toFixed(2)),
        currency: 'USD',
        totalSlots: 7,
        bookedSlots: Math.floor(Math.random() * 5) + 1,
        utilizationRate: parseFloat((Math.random() * 60 + 20).toFixed(2)),
        emailsSent: Math.floor(Math.random() * 10) + 2,
        pushSent: Math.floor(Math.random() * 8) + 1,
      },
    });
  }

  console.log('✅ Analytics snapshots created');
  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────────────');
  console.log('Admin Login:');
  console.log('  Email:    admin@bookingsystem.com');
  console.log('  Password: Admin@123456');
  console.log('─────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });