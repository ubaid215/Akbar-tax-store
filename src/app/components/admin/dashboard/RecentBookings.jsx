// src/components/admin/dashboard/RecentBookings.jsx
'use client';

import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Inbox } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

const COL_HEADERS = ['Ref', 'Client', 'Service', 'Date & Time', 'Status'];

function SkeletonRow() {
  return (
    <tr>
      {[70, 130, 100, 90, 70].map((w, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <div style={{ height: 13, width: w, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  );
}

export default function RecentBookings({ bookings = [], loading = false }) {
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
          <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Recent Bookings</h2>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Latest 8 appointments</p>
        </div>
        <button onClick={() => router.push('/bookings')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#072971'}
          onMouseLeave={e => e.currentTarget.style.color = T.brand}
        >
          View all <ArrowUpRight style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid rgba(0,64,168,0.05)` }}>
              {COL_HEADERS.map((h) => (
                <th key={h} style={{
                  padding: '10px 16px', textAlign: 'left',
                  fontSize: 10, fontWeight: 700, color: T.muted,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', color: T.muted }}>
                    <Inbox style={{ width: 32, height: 32, marginBottom: 10, opacity: 0.4 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>No bookings yet</p>
                    <p style={{ fontSize: 11, marginTop: 4 }}>Bookings will appear here once clients book</p>
                  </div>
                </td>
              </tr>
            ) : bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} onClick={() => router.push(`/bookings/${booking.id}`)} />
            ))}
          </tbody>
        </table>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}

function BookingRow({ booking, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: hovered ? '#F8FBFF' : 'transparent',
        transition: 'background .15s',
        borderBottom: '1px solid rgba(0,64,168,0.04)',
      }}
    >
      {/* Ref */}
      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#0040A8' }}>
          {booking.bookingRef}
        </span>
      </td>

      {/* Client */}
      <td style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#0040A8,#0059F5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 11, fontWeight: 700,
          }}>
            {booking.clientName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#0B1E3D', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
              {booking.clientName}
            </p>
            <p style={{ fontSize: 11, color: '#A0BBCF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
              {booking.clientEmail}
            </p>
          </div>
        </div>
      </td>

      {/* Service */}
      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
        {booking.service ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: '#5D7A96' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: booking.service.color ?? '#0040A8', flexShrink: 0 }} />
            {booking.service.name}
          </span>
        ) : <span style={{ fontSize: 12, color: '#A0BBCF' }}>—</span>}
      </td>

      {/* Date & Time */}
      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#0B1E3D', margin: 0 }}>
          {format(new Date(booking.startTime), 'MMM d, yyyy')}
        </p>
        <p style={{ fontSize: 11, color: '#A0BBCF', margin: 0 }}>
          {format(new Date(booking.startTime), 'h:mm a')}
        </p>
      </td>

      {/* Status */}
      <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
        <BookingStatusBadge status={booking.status} />
      </td>
    </tr>
  );
}

// Import useState for BookingRow
import { useState } from 'react';