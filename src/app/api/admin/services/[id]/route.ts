import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, description, duration, price, color, isActive, order } = await req.json()
  const service = await prisma.service.update({
    where: { id },
    data: { name, description, duration, price: price || null, color, isActive, order },
  })
  return NextResponse.json(service)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.service.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
