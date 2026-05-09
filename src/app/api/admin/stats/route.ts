import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const [totalBookings, pendingBookings, confirmedToday, totalClients, recentBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED', date: today } }),
    prisma.booking.groupBy({ by: ['clientEmail'] }).then(r => r.length),
    prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    }),
  ])

  return NextResponse.json({ totalBookings, pendingBookings, confirmedToday, totalClients, recentBookings })
}
