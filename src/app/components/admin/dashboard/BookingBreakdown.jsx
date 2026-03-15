// src/components/admin/dashboard/BookingBreakdown.jsx
'use client';

const T = { navy: '#0B1E3D', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

const STATUS_ITEMS = [
  { key: 'confirmedBookings', label: 'Confirmed', color: '#0040A8', track: 'rgba(0,64,168,0.08)'   },
  { key: 'completedBookings', label: 'Completed', color: '#10B981', track: 'rgba(16,185,129,0.10)'  },
  { key: 'pendingBookings',   label: 'Pending',   color: '#F59E0B', track: 'rgba(245,158,11,0.10)'  },
  { key: 'cancelledBookings', label: 'Cancelled', color: '#EF4444', track: 'rgba(239,68,68,0.10)'   },
  { key: 'noShowBookings',    label: 'No Show',   color: '#9CA3AF', track: 'rgba(107,114,128,0.10)' },
];

function Skeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
      <div style={{ width: 80, height: 12, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ flex: 1, height: 8, borderRadius: 99, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ width: 32, height: 12, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

export default function BookingBreakdown({ stats = {}, loading = false }) {
  const total = STATUS_ITEMS.reduce((sum, s) => sum + (stats[s.key] ?? 0), 0);

  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 20,
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Status Breakdown</h2>
        <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>All time booking statuses</p>
      </div>

      {/* Stacked bar */}
      {loading ? (
        <div style={{ height: 10, borderRadius: 99, background: '#EEF4FF', marginBottom: 20, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ) : total > 0 ? (
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden', gap: 2, marginBottom: 20 }}>
          {STATUS_ITEMS.map((item) => {
            const count = stats[item.key] ?? 0;
            const pct   = total > 0 ? (count / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div key={item.key} title={`${item.label}: ${count}`}
                style={{ width: `${pct}%`, background: item.color, borderRadius: 99, transition: 'width .5s ease' }}
              />
            );
          })}
        </div>
      ) : (
        <div style={{ height: 10, borderRadius: 99, background: '#EEF4FF', marginBottom: 20 }} />
      )}

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
          : STATUS_ITEMS.map((item) => {
              const count = stats[item.key] ?? 0;
              const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(0,64,168,0.04)' }}>
                  {/* Label */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, width: 90, flexShrink: 0 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: T.text2 }}>{item.label}</span>
                  </div>
                  {/* Track */}
                  <div style={{ flex: 1, height: 6, borderRadius: 99, background: item.track, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 99, background: item.color, width: `${pct}%`, transition: 'width .5s ease' }} />
                  </div>
                  {/* Count */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, width: 64, justifyContent: 'flex-end', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{count}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>({pct}%)</span>
                  </div>
                </div>
              );
            })}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}