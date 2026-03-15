// src/components/admin/dashboard/UpcomingToday.jsx
'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Clock, CalendarCheck, ArrowUpRight } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const T = { navy: '#0B1E3D', brand: '#0040A8', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

function SkeletonItem() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid rgba(0,64,168,0.04)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF4FF', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 13, width: 110, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 11, width: 80,  borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ width: 60, height: 24, borderRadius: 99, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

function BookingItem({ booking, onClick }) {
  const [hovered, setHovered] = useState(false);
  const startTime = new Date(booking.startTime);
  const endTime   = new Date(booking.endTime);
  const isNow     = startTime <= new Date() && endTime >= new Date();

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
        background: hovered ? '#F8FBFF' : 'transparent',
        borderBottom: '1px solid rgba(0,64,168,0.04)',
        transition: 'background .15s',
      }}
    >
      {/* Time block */}
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: isNow ? 'linear-gradient(135deg,#0040A8,#0059F5)' : 'rgba(0,64,168,0.06)',
        boxShadow: isNow ? '0 4px 12px rgba(0,64,168,0.28)' : 'none',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: isNow ? '#fff' : T.navy }}>
          {format(startTime, 'h:mm')}
        </span>
        <span style={{ fontSize: 9, lineHeight: 1, marginTop: 2, color: isNow ? 'rgba(255,255,255,0.75)' : T.muted }}>
          {format(startTime, 'a')}
        </span>
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: T.navy, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {booking.clientName}
          </p>
          {isNow && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, color: T.brand,
              background: 'rgba(0,64,168,0.08)', padding: '2px 7px', borderRadius: 99,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: T.brand, animation: 'pulse 1.5s ease-in-out infinite' }} />
              Now
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
          <Clock style={{ width: 11, height: 11, color: T.muted, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: T.muted }}>
            {format(startTime, 'h:mm a')} – {format(endTime, 'h:mm a')}
          </span>
        </div>
        {booking.service && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: booking.service.color ?? T.brand, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: T.muted }}>{booking.service.name}</span>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0 }}>
        <BookingStatusBadge status={booking.status} />
      </div>
    </div>
  );
}

export default function UpcomingToday({ bookings = [], loading = false }) {
  const router = useRouter();

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Today's Schedule</h2>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
            {loading ? '—' : `${bookings.length} upcoming appointment${bookings.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button onClick={() => router.push('/bookings')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#072971'}
          onMouseLeave={e => e.currentTarget.style.color = T.brand}
        >
          View all <ArrowUpRight style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonItem key={i} />)
        ) : bookings.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: T.muted }}>
            <CalendarCheck style={{ width: 28, height: 28, marginBottom: 10, opacity: 0.4 }} />
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>All clear for today</p>
            <p style={{ fontSize: 11, marginTop: 4 }}>No upcoming appointments</p>
          </div>
        ) : bookings.map((booking) => (
          <BookingItem
            key={booking.id}
            booking={booking}
            onClick={() => router.push(`/bookings/${booking.id}`)}
          />
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

import { useState } from 'react';