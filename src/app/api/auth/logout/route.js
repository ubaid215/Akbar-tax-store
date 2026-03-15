// src/app/api/auth/logout/route.js
// POST /api/auth/logout
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      // Audit log the logout
      await prisma.auditLog.create({
        data: {
          userId:    session.user.id,
          action:    'LOGOUT',
          entity:    'User',
          entityId:  session.user.id,
          ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          endpoint:  '/api/auth/logout',
        },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('[LOGOUT API]', error);
    // Still return success — client will clear session regardless
    return NextResponse.json({ success: true, message: 'Logged out' });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}