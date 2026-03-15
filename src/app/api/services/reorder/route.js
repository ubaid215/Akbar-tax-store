// src/app/api/services/reorder/route.js
// PATCH /api/services/reorder — update sortOrder for multiple services at once
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const { order } = await request.json();
    // order = [{ id: 'uuid', sortOrder: 1 }, ...]

    if (!Array.isArray(order) || order.length === 0) {
      return NextResponse.json({ success: false, message: 'order array required' }, { status: 400 });
    }

    const updates = order.map(({ id, sortOrder }) =>
      prisma.service.updateMany({
        where: { id, adminId: session.user.id },
        data:  { sortOrder },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: 'Order updated' });
  } catch (error) {
    console.error('[PATCH /api/services/reorder]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}