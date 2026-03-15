// src/components/admin/bookings/BookingsFilter.jsx
'use client';

import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

const T = { navy: '#0B1E3D', brand: '#0040A8', brandLt: '#0059F5', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.10)' };

const STATUSES = [
  { value: 'ALL',       label: 'All'       },
  { value: 'PENDING',   label: 'Pending'   },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW',   label: 'No Show'   },
];

const STATUS_PILL_COLORS = {
  ALL:       { active: { bg: T.brand,           color: '#fff' },    idle: { bg: 'rgba(0,64,168,0.07)',   color: T.text2  } },
  PENDING:   { active: { bg: '#D97706',          color: '#fff' },    idle: { bg: 'rgba(217,119,6,0.08)',  color: '#D97706'} },
  CONFIRMED: { active: { bg: T.brand,            color: '#fff' },    idle: { bg: 'rgba(0,64,168,0.07)',   color: T.brand  } },
  COMPLETED: { active: { bg: '#059669',          color: '#fff' },    idle: { bg: 'rgba(5,150,105,0.08)', color: '#059669'} },
  CANCELLED: { active: { bg: '#DC2626',          color: '#fff' },    idle: { bg: 'rgba(220,38,38,0.08)', color: '#DC2626'} },
  NO_SHOW:   { active: { bg: T.text2,            color: '#fff' },    idle: { bg: 'rgba(93,122,150,0.08)',color: T.text2  } },
};

function SearchInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <Search style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        width: 14, height: 14, color: focused ? T.brand : T.muted, pointerEvents: 'none',
        transition: 'color .15s',
      }} />
      <input
        type="text"
        placeholder="Search by name, email or ref…"
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          paddingLeft: 36, paddingRight: value ? 36 : 14,
          paddingTop: 10, paddingBottom: 10,
          fontSize: 13, borderRadius: 12,
          border: `1.5px solid ${focused ? T.brand : T.border}`,
          background: focused ? '#fff' : '#F8FBFF', color: T.navy,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.08)' : 'none',
          transition: 'all .18s ease',
        }}
      />
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: T.muted, display: 'flex', alignItems: 'center', padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.text2}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
        >
          <X style={{ width: 13, height: 13 }} />
        </button>
      )}
    </div>
  );
}

function DateField({ label, value, onChange, min }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.muted }}>
        {label}
      </label>
      <input
        type="date" value={value} min={min}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '9px 12px',
          fontSize: 12, borderRadius: 10,
          border: `1.5px solid ${focused ? T.brand : T.border}`,
          background: focused ? '#fff' : '#F8FBFF', color: T.navy,
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.08)' : 'none',
          transition: 'all .15s ease',
        }}
      />
    </div>
  );
}

export default function BookingsFilter({ filters, onChange }) {
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateHov,       setDateHov]       = useState(false);
  const [clearHov,      setClearHov]      = useState(false);

  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });
  const hasActiveFilters = filters.status !== 'ALL' || filters.search || filters.dateFrom || filters.dateTo;
  const clearAll = () => onChange({ status: 'ALL', search: '', dateFrom: '', dateTo: '', page: 1 });
  const hasDateFilter = filters.dateFrom || filters.dateTo;

  return (
    <div style={{
      background: '#fff', borderRadius: 16,
      border: `1px solid ${T.border}`,
      boxShadow: '0 2px 12px rgba(0,64,168,0.05)',
      padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* Row 1: search + date toggle + clear */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <SearchInput
          value={filters.search}
          onChange={e => update('search', e.target.value)}
        />

        <button
          onClick={() => setShowDateRange(p => !p)}
          onMouseEnter={() => setDateHov(true)}
          onMouseLeave={() => setDateHov(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
            border: `1.5px solid ${hasDateFilter || showDateRange ? T.brand : T.border}`,
            background: hasDateFilter ? 'rgba(0,64,168,0.06)' : dateHov ? 'rgba(0,64,168,0.03)' : '#F8FBFF',
            color: hasDateFilter || showDateRange ? T.brand : T.text2,
            transition: 'all .15s ease',
          }}
        >
          <Filter style={{ width: 13, height: 13 }} />
          Date Range
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            onMouseEnter={() => setClearHov(true)}
            onMouseLeave={() => setClearHov(false)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              border: '1.5px solid rgba(220,38,38,0.18)',
              background: clearHov ? 'rgba(220,38,38,0.06)' : 'rgba(220,38,38,0.04)',
              color: '#DC2626', transition: 'all .15s ease',
            }}
          >
            <X style={{ width: 13, height: 13 }} />
            Clear
          </button>
        )}
      </div>

      {/* Row 2: Status pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {STATUSES.map(({ value, label }) => {
          const isActive = filters.status === value;
          const col = STATUS_PILL_COLORS[value];
          return (
            <StatusPill
              key={value}
              label={label}
              active={isActive}
              colors={col}
              onClick={() => update('status', value)}
            />
          );
        })}
      </div>

      {/* Row 3: Date range (conditional) */}
      {showDateRange && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <DateField
            label="From"
            value={filters.dateFrom}
            onChange={e => update('dateFrom', e.target.value)}
          />
          <DateField
            label="To"
            value={filters.dateTo}
            min={filters.dateFrom}
            onChange={e => update('dateTo', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

function StatusPill({ label, active, colors, onClick }) {
  const [hov, setHov] = useState(false);
  const col = active ? colors.active : colors.idle;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '5px 12px', borderRadius: 99, border: 'none', cursor: 'pointer',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.02em',
        background: col.bg, color: col.color,
        boxShadow: active ? '0 2px 8px rgba(0,64,168,0.18)' : 'none',
        opacity: !active && hov ? 0.8 : 1,
        transform: active ? 'scale(1.03)' : 'scale(1)',
        transition: 'all .15s ease',
      }}
    >
      {label}
    </button>
  );
}