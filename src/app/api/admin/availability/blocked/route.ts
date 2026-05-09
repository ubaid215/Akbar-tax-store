import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { date, reason } = await req.json()

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 })
  }

  const blocked = await prisma.blockedDate.create({ data: { date, reason } })
  return NextResponse.json(blocked, { status: 201 })
}
