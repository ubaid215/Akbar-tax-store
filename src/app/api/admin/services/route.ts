import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const { name, description, duration, price, color, isActive, order } = await req.json()
  const service = await prisma.service.create({
    data: { name, description, duration, price: price || null, color: color || '#0040A8', isActive: isActive ?? true, order: order ?? 0 },
  })
  return NextResponse.json(service, { status: 201 })
}
