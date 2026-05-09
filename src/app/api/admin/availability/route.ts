import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSettingsRow, upsertSettingsRow } from '@/lib/dashboard-security'

export async function GET() {
  const [availabilityRows, blockedDates, settings] = await Promise.all([
    prisma.availability.findMany({ include: { slots: true }, orderBy: { dayOfWeek: 'asc' } }),
    prisma.blockedDate.findMany({ orderBy: { date: 'asc' } }),
    getSettingsRow(),
  ])

  const availability = availabilityRows.map(a => ({
    dayOfWeek: a.dayOfWeek,
    isOpen: a.isOpen,
    slots: a.slots.map(s => ({ id: s.id, startTime: s.startTime, endTime: s.endTime })),
  }))

  return NextResponse.json({
    availability,
    blockedDates,
    settings: settings ? { bufferTime: settings.bufferTime, slotDuration: settings.slotDuration } : null,
  })
}

export async function POST(req: NextRequest) {
  const { availability, bufferTime, slotDuration } = await req.json()

  // Upsert each day
  await Promise.all(
    availability.map(async (day: { dayOfWeek: number; isOpen: boolean; slots: { startTime: string; endTime: string }[] }) => {
      const existing = await prisma.availability.findUnique({ where: { dayOfWeek: day.dayOfWeek } })

      if (existing) {
        // Delete old slots then recreate
        await prisma.timeSlot.deleteMany({ where: { availabilityId: existing.id } })
        await prisma.availability.update({
          where: { dayOfWeek: day.dayOfWeek },
          data: {
            isOpen: day.isOpen,
            slots: { create: day.slots.map(s => ({ startTime: s.startTime, endTime: s.endTime })) },
          },
        })
      } else {
        await prisma.availability.create({
          data: {
            dayOfWeek: day.dayOfWeek,
            isOpen: day.isOpen,
            slots: { create: day.slots.map(s => ({ startTime: s.startTime, endTime: s.endTime })) },
          },
        })
      }
    })
  )

  await upsertSettingsRow({
    update: { bufferTime, slotDuration },
    create: { bufferTime, slotDuration },
  })

  return NextResponse.json({ ok: true })
}
