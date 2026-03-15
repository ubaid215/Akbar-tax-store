// src/app/api/notifications/stream/route.js

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const adminId  = session.user.id;
  const signal   = request.signal; // AbortSignal — fires when client disconnects

  let intervalId  = null;
  let heartbeatId = null;
  let closed      = false;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const enqueue = (text) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          close();
        }
      };

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(intervalId);
        clearInterval(heartbeatId);
        try { controller.close(); } catch { /* already closed */ }
      };

      // ── Single DB query returning both count + latest ──────────
      const sendState = async () => {
        if (closed) return;
        try {
          const notifications = await prisma.notification.findMany({
            where:   { adminId, channel: 'PUSH' },
            orderBy: { createdAt: 'desc' },
            take:    8,
            include: { booking: { select: { bookingRef: true, clientName: true } } },
          });

          const unreadCount = notifications.filter(n => !n.sentAt).length;

          enqueue(`data: ${JSON.stringify({ type: 'state', unreadCount, notifications })}\n\n`);
        } catch {
          // DB error — skip this tick, don't crash the stream
        }
      };

      // Send initial state immediately
      sendState();

      // Poll every 30 seconds (was 8s — reduced to cut DB costs by ~75%)
      intervalId = setInterval(sendState, 30_000);

      // Heartbeat every 45s to keep connection alive through proxies
      heartbeatId = setInterval(() => {
        enqueue(': heartbeat\n\n');
      }, 45_000);

      // ── Clean up when client disconnects ──────────────────────
      // This is the correct way — listen to the request's AbortSignal
      signal.addEventListener('abort', () => {
        close();
      }, { once: true });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache, no-transform',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}