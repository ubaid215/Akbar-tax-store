// src/app/api/public/services/route.js
// GET /api/public/services — public, no auth
// Returns active services for the booking form service selector

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admin = await prisma.user.findFirst({
      where:   { status: 'ACTIVE', role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select:  { id: true },
      orderBy: { createdAt: 'asc' },
    });

    if (!admin) return NextResponse.json({ success: true, data: [] });

    const services = await prisma.service.findMany({
      where:   { adminId: admin.id, status: 'ACTIVE', deletedAt: null },
      orderBy: { sortOrder: 'asc' },
      select:  { id: true, name: true, description: true, price: true, duration: true, color: true },
    });

    return NextResponse.json({
      success: true,
      data: services.map(s => ({
        ...s,
        price: s.price ? Number(s.price) : null,
      })),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}