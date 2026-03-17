// src/app/api/push/subscribe/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return NextResponse.json({ success: false, message: 'Push notifications not configured' }, { status: 503 });
  }
  return NextResponse.json({ success: true, publicKey });
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const subscription = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ success: false, message: 'Invalid subscription object' }, { status: 400 });
    }

    // ✅ Verify the user exists before updating
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      console.error('[POST /api/push/subscribe] User not found. Session ID:', session.user.id, '| Type:', typeof session.user.id);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pushToken:   JSON.stringify(subscription),
        pushEnabled: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Push subscription saved' });
  } catch (error) {
    console.error('[POST /api/push/subscribe]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Same guard for DELETE
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true },
    });

    if (!user) {
      console.error('[DELETE /api/push/subscribe] User not found. Session ID:', session.user.id, '| Type:', typeof session.user.id);
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { pushToken: null, pushEnabled: false },
    });

    return NextResponse.json({ success: true, message: 'Push subscription removed' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}