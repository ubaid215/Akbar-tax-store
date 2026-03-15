// src/components/admin/availability/SlotPreview.jsx
'use client';

import { Clock } from 'lucide-react';

const T = { navy: '#0B1E3D', brand: '#0040A8', brandLt: '#0059F5', text2: '#5D7A96', muted: '#A0BBCF' };

function calcSlots(startTime, endTime, slotDuration, bufferTime) {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const totalMins = (eh * 60 + em) - (sh * 60 + sm);
  if (totalMins <= 0) return 0;
  return Math.floor(totalMins / (slotDuration + bufferTime));
}

export default function SlotPreview({ days }) {
  const activeDays = Object.entries(days).filter(([, c]) => c.isActive);
  if (activeDays.length === 0) return null;

  const totalPerWeek = activeDays.reduce(
    (sum, [, c]) => sum + calcSlots(c.startTime, c.endTime, c.slotDuration, c.bufferTime), 0
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, #EEF4FF 0%, #E5EDFF 100%)',
      border: '1px solid rgba(0,64,168,0.14)',
      borderRadius: 16, padding: 20,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg,#0040A8,#0059F5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Clock style={{ width: 13, height: 13, color: '#fff' }} />
        </div>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Slot Preview</h3>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: T.brand,
            background: 'rgba(0,64,168,0.10)', padding: '4px 10px', borderRadius: 99,
          }}>
            {totalPerWeek} slots/week
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid', gap: 8,
        gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      }} className="slot-preview-grid">
        {activeDays.map(([day, config]) => {
          const count = calcSlots(config.startTime, config.endTime, config.slotDuration, config.bufferTime);
          return (
            <div key={day} style={{
              background: '#fff', borderRadius: 12, padding: '10px 14px',
              border: '1px solid rgba(0,64,168,0.10)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.navy, margin: 0 }}>
                {day.slice(0, 3)}
              </p>
              <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>
                {config.startTime} – {config.endTime}
              </p>
              <p style={{ fontSize: 18, fontWeight: 800, color: T.brand, margin: '4px 0 0', lineHeight: 1 }}>
                {count}
                <span style={{ fontSize: 11, fontWeight: 400, color: T.muted, marginLeft: 4 }}>slots</span>
              </p>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11, color: T.text2, marginTop: 14, marginBottom: 0 }}>
        ≈ <strong style={{ color: T.brand }}>{totalPerWeek * 8}</strong> slots generated for the next 60 days
      </p>
    </div>
  );
}