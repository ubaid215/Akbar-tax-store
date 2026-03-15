// src/app/api/clients/[email]/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { email: rawEmail } = await params; // ← Next.js 15: params is a Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const email = decodeURIComponent(rawEmail);

    const bookings = await prisma.booking.findMany({
      where:   { adminId: session.user.id, clientEmail: email },
      orderBy: { startTime: 'desc' },
      include: { service: { select: { name: true, color: true } } },
    });

    if (bookings.length === 0) return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });

    const latest  = bookings[0];
    const revenue = bookings
      .filter(b => ['CONFIRMED', 'COMPLETED'].includes(b.status))
      .reduce((sum, b) => sum + Number(b.pricePaid ?? 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        client: {
          name:     latest.clientName,
          email:    latest.clientEmail,
          phone:    latest.clientPhone,
          timezone: latest.clientTimezone,
        },
        bookings,
        stats: {
          total:      bookings.length,
          totalSpent: revenue,
          completed:  bookings.filter(b => b.status === 'COMPLETED').length,
          cancelled:  bookings.filter(b => b.status === 'CANCELLED').length,
          pending:    bookings.filter(b => b.status === 'PENDING').length,
        },
      },
    });
  } catch (error) {
    console.error('[GET /api/clients/:email]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}