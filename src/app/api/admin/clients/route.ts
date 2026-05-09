import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Group bookings by email to build client list
  const grouped = await prisma.booking.groupBy({
    by: ['clientEmail', 'clientName', 'clientPhone'],
    _count: { id: true },
    _max: { date: true },
    orderBy: { _max: { date: 'desc' } },
  })

  const clients = grouped.map(g => ({
    clientName: g.clientName,
    clientEmail: g.clientEmail,
    clientPhone: g.clientPhone,
    _count: g._count.id,
    lastBooking: g._max.date,
  }))

  return NextResponse.json(clients)
}
