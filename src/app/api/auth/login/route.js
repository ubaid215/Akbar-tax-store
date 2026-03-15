// src/app/api/auth/login/route.js
// POST /api/auth/login
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ── Validation ──────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // ── Find user ───────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id:          true,
        email:       true,
        name:        true,
        password:    true,
        role:        true,
        status:      true,
        avatar:      true,
        deletedAt:   true,
        lastLoginAt: true,
      },
    });

    // Use same error message for not-found and wrong password
    // to prevent email enumeration attacks
    if (!user || user.deletedAt) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended. Contact support.' },
        { status: 403 }
      );
    }

    if (user.status === 'INACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Your account is inactive. Contact support.' },
        { status: 403 }
      );
    }

    // ── Verify password ─────────────────────────────────────
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // ── Update last login ───────────────────────────────────
    await prisma.user.update({
      where: { id: user.id },
      data:  { lastLoginAt: new Date() },
    });

    // ── Audit log ───────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        userId:    user.id,
        action:    'LOGIN',
        entity:    'User',
        entityId:  user.id,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        endpoint:  '/api/auth/login',
      },
    }).catch(() => {}); // non-blocking — don't fail login if audit fails

    // ── Return user (no password) ───────────────────────────
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id:     user.id,
        email:  user.email,
        name:   user.name,
        role:   user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('[LOGIN API]', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Block non-POST methods
export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}