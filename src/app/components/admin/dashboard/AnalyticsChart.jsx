// src/components/admin/dashboard/AnalyticsChart.jsx
'use client';

import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const T = { navy: '#0B1E3D', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };
const TABS = [{ key: 'both', label: 'Both' }, { key: 'bookings', label: 'Bookings' }, { key: 'revenue', label: 'Revenue' }];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '10px 14px',
      border: `1px solid ${T.border}`,
      boxShadow: '0 8px 24px rgba(0,64,168,0.12)',
      fontSize: 12,
    }}>
      <p style={{ fontWeight: 700, color: T.navy, marginBottom: 6 }}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ color: T.text2, textTransform: 'capitalize' }}>{entry.dataKey}:</span>
          <span style={{ fontWeight: 700, color: T.navy }}>
            {entry.dataKey === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SkeletonChart() {
  return (
    <div style={{ height: 224, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '0 16px 16px' }}>
      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: '6px 6px 0 0',
          background: 'linear-gradient(180deg,#E8F0FF,#F0F5FF)',
          height: `${h}%`,
          animation: 'pulse 1.5s ease-in-out infinite',
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </div>
  );
}

export default function AnalyticsChart({ chartData = [], loading = false }) {
  const [activeTab, setActiveTab] = useState('both');

  const formattedData = chartData.map((d) => ({ ...d, label: d.label ?? d.date }));

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', gap: 12,
        padding: '14px 20px',
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Booking Analytics</h2>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Last 7 days overview</p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: 'rgba(0,64,168,0.06)', borderRadius: 10, padding: 4,
        }}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '5px 12px', borderRadius: 7, border: 'none',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  transition: 'all .15s ease',
                  background: active ? '#fff' : 'transparent',
                  color: active ? T.navy : T.muted,
                  boxShadow: active ? '0 1px 4px rgba(0,64,168,0.10)' : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '16px 20px 20px' }}>
        {loading ? (
          <SkeletonChart />
        ) : formattedData.length === 0 ? (
          <div style={{ height: 224, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.muted, fontSize: 13 }}>
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={224}>
            <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0040A8" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0040A8" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}    />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,64,168,0.06)" vertical={false} />

              <XAxis dataKey="label"
                tick={{ fontSize: 11, fill: T.muted, fontWeight: 500 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => v.split(',')[0]}
              />
              <YAxis
                tick={{ fontSize: 11, fill: T.muted }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => activeTab === 'revenue' ? `$${v}` : v}
              />

              <Tooltip content={<CustomTooltip />} />

              {(activeTab === 'both' || activeTab === 'bookings') && (
                <Area type="monotone" dataKey="bookings"
                  stroke="#0040A8" strokeWidth={2.5}
                  fill="url(#gBookings)"
                  dot={{ r: 3, fill: '#0040A8', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#0040A8', strokeWidth: 2, stroke: '#fff' }}
                />
              )}
              {(activeTab === 'both' || activeTab === 'revenue') && (
                <Area type="monotone" dataKey="revenue"
                  stroke="#10B981" strokeWidth={2.5}
                  fill="url(#gRevenue)"
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                />
              )}

              {activeTab === 'both' && (
                <Legend iconType="circle" iconSize={8}
                  wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                  formatter={(value) => (
                    <span style={{ color: T.text2, fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
                  )}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}