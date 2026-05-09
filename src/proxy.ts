import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isAdminRoute = createRouteMatcher(['/admin', '/admin/(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;

  // Must be signed in
  await auth.protect();

  // Must be the designated admin user
  const { userId } = await auth();
  const adminId = process.env.ADMIN_CLERK_USER_ID;

  // Avoid locking all admin routes during local/dev setup when admin ID isn't set.
  if (!adminId && process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!adminId || userId !== adminId) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
