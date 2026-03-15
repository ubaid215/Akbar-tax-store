// src/components/admin/bookings/BookingsTable.jsx
'use client';

import { format } from 'date-fns';
import { MoreVertical, Eye, CheckCircle, XCircle, UserX, Inbox } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import BookingStatusBadge from '@/app/components/admin/dashboard/BookingStatusBadge';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

/* ── Action dropdown ───────────────────────────────────── */
function ActionMenu({ booking, onAction }) {
  const [open, setOpen] = useState(false);
  const [hov,  setHov]  = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const actions = [
    { label: 'View Detail', icon: Eye,         action: 'view',      always: true  },
    { label: 'Confirm',     icon: CheckCircle, action: 'CONFIRMED', show: ['PENDING']             },
    { label: 'Complete',    icon: CheckCircle, action: 'COMPLETED', show: ['CONFIRMED']            },
    { label: 'No Show',     icon: UserX,       action: 'NO_SHOW',   show: ['CONFIRMED','PENDING']  },
    { label: 'Cancel',      icon: XCircle,     action: 'CANCELLED', show: ['PENDING','CONFIRMED'], danger: true },
  ].filter(a => a.always || a.show?.includes(booking.status));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <TriggerBtn open={open} onClick={() => setOpen(p => !p)} />

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4,
          width: 168, background: '#fff',
          border: `1px solid ${T.border}`,
          borderRadius: 12, boxShadow: '0 8px 24px rgba(0,64,168,0.12)',
          overflow: 'hidden', zIndex: 20,
          animation: 'fadeIn .12s ease',
        }}>
          {actions.map(({ label, icon: Icon, action, danger }) => (
            <button
              key={action}
              onClick={() => { onAction(booking, action); setOpen(false); }}
              onMouseEnter={() => setHov(action)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 14px',
                background: hov === action
                  ? danger ? 'rgba(220,38,38,0.06)' : 'rgba(0,64,168,0.04)'
                  : 'transparent',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                fontSize: 12, fontWeight: 500,
                color: danger ? '#DC2626' : T.navy,
                transition: 'background .12s',
              }}
            >
              <Icon style={{ width: 13, height: 13, color: danger ? '#DC2626' : T.muted, flexShrink: 0 }} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TriggerBtn({ open, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        background: open || hov ? 'rgba(0,64,168,0.06)' : 'transparent',
        color: open || hov ? T.brand : T.muted,
        transition: 'all .15s ease',
      }}
    >
      <MoreVertical style={{ width: 15, height: 15 }} />
    </button>
  );
}

/* ── Skeleton row ──────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[60, 140, 100, 120, 80, 60, 30].map((w, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <div className="anim-pulse" style={{ height: 13, width: w, borderRadius: 6, background: '#EEF4FF' }} />
        </td>
      ))}
    </tr>
  );
}

/* ── Avatar ────────────────────────────────────────────── */
function Avatar({ name }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#0040A8,#0059F5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '-0.01em',
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ── Main table ────────────────────────────────────────── */
const TH_STYLE = {
  padding: '11px 16px', textAlign: 'left',
  fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
  textTransform: 'uppercase', color: T.muted, whiteSpace: 'nowrap',
};

export default function BookingsTable({ bookings = [], loading = false, onAction }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      boxShadow: '0 2px 12px rgba(0,64,168,0.05)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}`, background: '#F8FBFF' }}>
              {['Ref', 'Client', 'Service', 'Date & Time', 'Status', 'Amount', ''].map(h => (
                <th key={h} style={TH_STYLE}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 0 }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '56px 16px', color: T.muted,
                  }}>
                    <Inbox style={{ width: 32, height: 32, marginBottom: 10, opacity: 0.35 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>No bookings found</p>
                    <p style={{ fontSize: 12, marginTop: 4, marginBottom: 0 }}>Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              bookings.map((booking, idx) => (
                <BookingRow key={booking.id} booking={booking} onAction={onAction} isLast={idx === bookings.length - 1} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookingRow({ booking, onAction, isLast }) {
  const [hov, setHov] = useState(false);
  const TD = {
    padding: '12px 16px', whiteSpace: 'nowrap',
    borderBottom: isLast ? 'none' : `1px solid ${T.border}`,
    background: hov ? 'rgba(0,64,168,0.025)' : 'transparent',
    transition: 'background .12s',
  };

  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Ref */}
      <td style={TD}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: T.brand }}>
          {booking.bookingRef}
        </span>
      </td>

      {/* Client */}
      <td style={TD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={booking.clientName} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.navy, margin: 0 }}>{booking.clientName}</p>
            <p style={{ fontSize: 11, color: T.muted, margin: '1px 0 0' }}>{booking.clientEmail}</p>
          </div>
        </div>
      </td>

      {/* Service */}
      <td style={TD}>
        {booking.service ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: T.text2 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: booking.service.color ?? T.brand, flexShrink: 0 }} />
            {booking.service.name}
          </span>
        ) : <span style={{ fontSize: 12, color: T.muted }}>—</span>}
      </td>

      {/* Date & Time */}
      <td style={TD}>
        <p style={{ fontSize: 12, fontWeight: 600, color: T.navy, margin: 0 }}>
          {format(new Date(booking.startTime), 'MMM d, yyyy')}
        </p>
        <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>
          {format(new Date(booking.startTime), 'h:mm a')} – {format(new Date(booking.endTime), 'h:mm a')}
        </p>
      </td>

      {/* Status */}
      <td style={TD}>
        <BookingStatusBadge status={booking.status} />
      </td>

      {/* Amount */}
      <td style={TD}>
        {booking.pricePaid != null ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#059669' }}>
            ${Number(booking.pricePaid).toFixed(2)}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: T.muted }}>Free</span>
        )}
      </td>

      {/* Actions */}
      <td style={{ ...TD, padding: '8px 12px' }}>
        <ActionMenu booking={booking} onAction={onAction} />
      </td>
    </tr>
  );
}