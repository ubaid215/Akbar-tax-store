// src/components/admin/availability/DayAvailabilityRow.jsx
'use client';

import { useState } from 'react';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

const SLOT_DURATIONS = [
  { value: 15,  label: '15 min'  },
  { value: 30,  label: '30 min'  },
  { value: 45,  label: '45 min'  },
  { value: 60,  label: '1 hour'  },
  { value: 90,  label: '1.5 hrs' },
  { value: 120, label: '2 hours' },
];

const BUFFER_TIMES = [
  { value: 0,  label: 'No buffer' },
  { value: 5,  label: '5 min'     },
  { value: 10, label: '10 min'    },
  { value: 15, label: '15 min'    },
  { value: 20, label: '20 min'    },
  { value: 30, label: '30 min'    },
];

function FieldInput({ label, value, onChange, type = 'time', children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: T.muted,
      }}>
        {label}
      </label>
      {children ?? (
        <input
          type={type} value={value} onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          style={{
            width: '100%', padding: '9px 12px', fontSize: 12, borderRadius: 10,
            border: `1.5px solid ${focused ? T.brand : T.border}`,
            background: focused ? '#fff' : '#F8FBFF', color: T.navy,
            outline: 'none', boxSizing: 'border-box',
            boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.08)' : 'none',
            transition: 'all .15s ease',
          }}
        />
      )}
    </div>
  );
}

function FieldSelect({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: T.muted,
      }}>
        {label}
      </label>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={()  => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', fontSize: 12, borderRadius: 10,
          border: `1.5px solid ${focused ? T.brand : T.border}`,
          background: focused ? '#fff' : '#F8FBFF', color: T.navy,
          outline: 'none', boxSizing: 'border-box', cursor: 'pointer',
          boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.08)' : 'none',
          transition: 'all .15s ease', appearance: 'none',
        }}
      >
        {options.map(({ value: v, label: l }) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </div>
  );
}

export default function DayAvailabilityRow({ day, config, onChange }) {
  const update = (key, val) => onChange(day, { ...config, [key]: val });

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: config.isActive
        ? '1px solid rgba(0,64,168,0.18)'
        : `1px solid ${T.border}`,
      background: config.isActive ? 'rgba(0,64,168,0.025)' : '#FAFBFF',
      opacity: config.isActive ? 1 : 0.65,
      transition: 'all .2s ease',
    }}>
      {/* Day header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Toggle */}
          <button
            type="button"
            onClick={() => update('isActive', !config.isActive)}
            style={{
              width: 40, height: 22, borderRadius: 11, border: 'none',
              cursor: 'pointer', padding: 2, flexShrink: 0,
              background: config.isActive
                ? 'linear-gradient(135deg,#0040A8,#0059F5)'
                : '#D1D5DB',
              boxShadow: config.isActive ? '0 2px 8px rgba(0,64,168,0.30)' : 'none',
              display: 'flex', alignItems: 'center',
              justifyContent: config.isActive ? 'flex-end' : 'flex-start',
              transition: 'all .2s ease',
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
            }} />
          </button>

          <span style={{
            fontSize: 13, fontWeight: 700,
            color: config.isActive ? T.navy : T.muted,
            transition: 'color .2s',
          }}>
            {day}
          </span>
        </div>

        {config.isActive && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: T.brand,
            background: 'rgba(0,64,168,0.08)',
            padding: '3px 10px', borderRadius: 99,
            letterSpacing: '0.04em',
          }}>
            Active
          </span>
        )}
      </div>

      {/* Config fields — shown when active */}
      {config.isActive && (
        <div style={{
          padding: '0 18px 16px',
          display: 'grid', gap: 12,
          gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
        }} className="day-row-grid">
          <FieldInput
            label="Start"
            value={config.startTime}
            onChange={e => update('startTime', e.target.value)}
          />
          <FieldInput
            label="End"
            value={config.endTime}
            onChange={e => update('endTime', e.target.value)}
          />
          <FieldSelect
            label="Slot Duration"
            value={config.slotDuration}
            onChange={e => update('slotDuration', parseInt(e.target.value))}
            options={SLOT_DURATIONS}
          />
          <FieldSelect
            label="Buffer"
            value={config.bufferTime}
            onChange={e => update('bufferTime', parseInt(e.target.value))}
            options={BUFFER_TIMES}
          />
        </div>
      )}
    </div>
  );
}