// src/components/admin/dashboard/BookingStatusBadge.jsx

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     bg: 'rgba(245,158,11,0.10)',  color: '#D97706', dot: '#F59E0B'  },
  CONFIRMED:   { label: 'Confirmed',   bg: 'rgba(0,64,168,0.08)',    color: '#0040A8', dot: '#0059F5'  },
  COMPLETED:   { label: 'Completed',   bg: 'rgba(16,185,129,0.10)',  color: '#059669', dot: '#10B981'  },
  CANCELLED:   { label: 'Cancelled',   bg: 'rgba(239,68,68,0.10)',   color: '#DC2626', dot: '#EF4444'  },
  NO_SHOW:     { label: 'No Show',     bg: 'rgba(107,114,128,0.10)', color: '#6B7280', dot: '#9CA3AF'  },
  RESCHEDULED: { label: 'Rescheduled', bg: 'rgba(139,92,246,0.10)',  color: '#7C3AED', dot: '#A78BFA'  },
};

export default function BookingStatusBadge({ status }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 99,
      fontSize: 11, fontWeight: 600,
      background: c.bg, color: c.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
      {c.label}
    </span>
  );
}