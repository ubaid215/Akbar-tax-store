// src/app/api/auth/me/route.js
// GET /api/auth/me
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id:                     true,
        email:                  true,
        name:                   true,
        role:                   true,
        status:                 true,
        avatar:                 true,
        phone:                  true,
        pushEnabled:            true,
        emailEnabled:           true,
        googleCalendarConnected: true,
        lastLoginAt:            true,
        createdAt:              true,
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        { success: false, message: 'User not found or inactive' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('[ME API]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/auth/me — Update own profile
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Only allow safe fields to be updated via this route
    const allowedFields = ['name', 'phone', 'avatar', 'pushEnabled', 'emailEnabled'];
    const updateData = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data:  updateData,
      select: {
        id:           true,
        email:        true,
        name:         true,
        role:         true,
        avatar:       true,
        phone:        true,
        pushEnabled:  true,
        emailEnabled: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId:    session.user.id,
        action:    'UPDATE',
        entity:    'User',
        entityId:  session.user.id,
        newValues: updateData,
        endpoint:  '/api/auth/me',
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error('[ME PATCH API]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}