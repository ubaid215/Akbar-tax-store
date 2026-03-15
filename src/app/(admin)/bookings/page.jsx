// src/app/(admin)/bookings/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import BookingsFilter     from '@/app/components/admin/bookings/BookingsFilter';
import BookingsTable      from '@/app/components/admin/bookings/BookingsTable';
import BookingDetailModal from '@/app/components/admin/bookings/BookingDetailModal';
import Pagination         from '@/app/components/admin/bookings/Pagination';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.10)' };

const STATUS_PILLS = {
  ALL:       { idle: { bg: 'rgba(0,64,168,0.07)',   color: T.text2  }, active: { bg: T.brand,   color: '#fff' } },
  PENDING:   { idle: { bg: 'rgba(217,119,6,0.08)',  color: '#D97706'}, active: { bg: '#D97706', color: '#fff' } },
  CONFIRMED: { idle: { bg: 'rgba(0,64,168,0.07)',   color: T.brand  }, active: { bg: T.brand,   color: '#fff' } },
  COMPLETED: { idle: { bg: 'rgba(5,150,105,0.08)',  color: '#059669'}, active: { bg: '#059669', color: '#fff' } },
  CANCELLED: { idle: { bg: 'rgba(220,38,38,0.08)',  color: '#DC2626'}, active: { bg: '#DC2626', color: '#fff' } },
};

function StatPill({ status, count, label, active, onClick }) {
  const [hov, setHov] = useState(false);
  const col = STATUS_PILLS[status];
  const cur = active ? col.active : col.idle;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
        fontSize: 11, fontWeight: 700, background: cur.bg, color: cur.color,
        boxShadow: active ? '0 2px 10px rgba(0,64,168,0.20)' : 'none',
        opacity: !active && hov ? 0.75 : 1,
        transform: active ? 'scale(1.03)' : 'scale(1)',
        transition: 'all .15s ease',
      }}
    >
      {label}
      <span style={{
        background: 'rgba(255,255,255,0.25)', padding: '1px 7px', borderRadius: 99,
        fontSize: 10, fontWeight: 800,
      }}>
        {count}
      </span>
    </button>
  );
}

export default function BookingsPage() {
  const [bookings,   setBookings]   = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState({ status: 'ALL', search: '', dateFrom: '', dateTo: '', page: 1, limit: 20 });
  const [selectedId, setSelectedId] = useState(null);
  const [counts,     setCounts]     = useState({});

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'ALL') params.set('status', filters.status);
      if (filters.search)   params.set('search',   filters.search);
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo)   params.set('dateTo',   filters.dateTo);
      params.set('page', filters.page);
      params.set('limit', filters.limit);
      const res  = await fetch(`/api/bookings?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setBookings(json.data.bookings);
      setPagination(json.data.pagination);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCounts = useCallback(async () => {
    try {
      const [all, pending, confirmed, completed, cancelled] = await Promise.all([
        fetch('/api/bookings?limit=1').then(r => r.json()),
        fetch('/api/bookings?limit=1&status=PENDING').then(r => r.json()),
        fetch('/api/bookings?limit=1&status=CONFIRMED').then(r => r.json()),
        fetch('/api/bookings?limit=1&status=COMPLETED').then(r => r.json()),
        fetch('/api/bookings?limit=1&status=CANCELLED').then(r => r.json()),
      ]);
      setCounts({
        ALL:       all.data?.pagination?.total       ?? 0,
        PENDING:   pending.data?.pagination?.total   ?? 0,
        CONFIRMED: confirmed.data?.pagination?.total ?? 0,
        COMPLETED: completed.data?.pagination?.total ?? 0,
        CANCELLED: cancelled.data?.pagination?.total ?? 0,
      });
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);
  useEffect(() => { fetchCounts();   }, [fetchCounts]);

  const handleAction = (booking, action) => {
    if (action === 'view') { setSelectedId(booking.id); return; }
    handleQuickStatus(booking.id, action);
  };

  const handleQuickStatus = async (id, status) => {
    try {
      const res  = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings(); fetchCounts();
    } catch (err) {
      toast.error(err.message ?? 'Failed to update');
    }
  };

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1280, margin: '0 auto' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#0040A8,#0059F5)',
              boxShadow: '0 4px 12px rgba(0,64,168,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarDays style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: '-0.02em' }}>
              Bookings
            </h1>
          </div>
          <p style={{ fontSize: 12, color: T.muted, margin: 0, paddingLeft: 42 }}>
            Manage and track all client appointments
          </p>
        </div>

        {/* Status count pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(counts).map(([status, count]) => (
            <StatPill
              key={status} status={status} count={count}
              label={status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
              active={filters.status === status}
              onClick={() => setFilters(f => ({ ...f, status, page: 1 }))}
            />
          ))}
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <BookingsFilter filters={filters} onChange={setFilters} />

      {/* ── Table ──────────────────────────────────────────── */}
      <BookingsTable bookings={bookings} loading={loading} onAction={handleAction} />

      {/* ── Pagination ─────────────────────────────────────── */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={page => setFilters(f => ({ ...f, page }))}
        />
      )}

      {/* ── Detail modal ───────────────────────────────────── */}
      {selectedId && (
        <BookingDetailModal
          bookingId={selectedId}
          onClose={() => setSelectedId(null)}
          onUpdate={() => { fetchBookings(); fetchCounts(); }}
        />
      )}
    </div>
  );
}