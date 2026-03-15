// src/proxy.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Block non-admin roles from /admin routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'STAFF'];
      if (!allowedRoles.includes(token.role)) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes — always allow
        const publicPaths = ['/login', '/register', '/', '/about', '/api/auth'];
        if (publicPaths.some((p) => pathname.startsWith(p))) return true;
        // Admin routes — require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/settings/:path*',
    '/bookings/:path*',
    '/services/:path*',
    '/analytics/:path*',
  ],
};