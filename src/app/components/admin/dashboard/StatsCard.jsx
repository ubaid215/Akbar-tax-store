// src/components/admin/dashboard/StatsCard.jsx
'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const T = {
  navy: '#0B1E3D', brand: '#0040A8',
  text2: '#5D7A96', muted: '#A0BBCF',
  border: 'rgba(0,64,168,0.08)',
};

export default function StatsCard({
  title, value, subtitle,
  icon: Icon,
  iconBg    = '#EEF4FF',
  iconColor = '#0040A8',
  trend, trendLabel,
  prefix = '', suffix = '',
  loading = false,
}) {
  const trendUp      = trend > 0;
  const trendNeutral = trend === 0 || trend === undefined || trend === null;

  // Accept both Tailwind strings (legacy) and hex values
  const resolveIconBg    = iconBg?.startsWith('bg-')    ? undefined : iconBg;
  const resolveIconColor = iconColor?.startsWith('text-') ? undefined : iconColor;

  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
        transition: 'box-shadow .2s ease',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,64,168,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,64,168,0.05)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Icon */}
        <div
          className={resolveIconBg ? undefined : iconBg}
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            ...(resolveIconBg ? { background: resolveIconBg } : {}),
          }}
        >
          <Icon
            className={resolveIconColor ? undefined : iconColor}
            style={{
              width: 20, height: 20,
              ...(resolveIconColor ? { color: resolveIconColor } : {}),
            }}
          />
        </div>

        {/* Trend badge */}
        {trend !== undefined && trend !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
            background: trendNeutral ? '#F3F4F6'
              : trendUp ? 'rgba(16,185,129,0.08)'
              : 'rgba(239,68,68,0.08)',
            color: trendNeutral ? '#6B7280'
              : trendUp ? '#059669'
              : '#DC2626',
          }}>
            {trendNeutral
              ? <Minus style={{ width: 11, height: 11 }} />
              : trendUp
              ? <TrendingUp style={{ width: 11, height: 11 }} />
              : <TrendingDown style={{ width: 11, height: 11 }} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        {loading ? (
          <>
            <div style={{ height: 32, width: 96, borderRadius: 8, background: '#EEF4FF', marginBottom: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <div style={{ height: 14, width: 128, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </>
        ) : (
          <>
            <p style={{ fontSize: 26, fontWeight: 700, color: T.navy, letterSpacing: '-0.03em', margin: 0 }}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <p style={{ fontSize: 12, fontWeight: 600, color: T.text2, marginTop: 3 }}>{title}</p>
            {(subtitle || trendLabel) && (
              <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{subtitle ?? trendLabel}</p>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}