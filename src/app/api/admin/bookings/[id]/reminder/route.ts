import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { sendReminder, reminderMinutes } = await req.json()

  const updated = await prisma.booking.update({
    where: { id },
    data: { sendReminder, reminderTime: reminderMinutes },
  })

  return NextResponse.json(updated)
}
