// src/app/(admin)/dashboard/page.jsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CalendarDays, DollarSign, Clock,
  CheckCircle2, RefreshCw, TrendingUp, Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import StatsCard from '@/app/components/admin/dashboard/StatsCard';
import RecentBookings from '@/app/components/admin/dashboard/RecentBookings';
import UpcomingToday from '@/app/components/admin/dashboard/UpcomingToday';
import AnalyticsChart from '@/app/components/admin/dashboard/AnalyticsChart';
import ServicesSummary from '@/app/components/admin/dashboard/ServicesSummary';
import BookingBreakdown from '@/app/components/admin/dashboard/BookingBreakdown';

/* ── Design tokens ──────────────────────────────────────── */
const T = {
  navy: '#0B1E3D',
  brand: '#0040A8',
  brandLight: '#0059F5',
  text2: '#5D7A96',
  text3: '#7A9AB8',
  muted: '#A0BBCF',
  border: 'rgba(0,64,168,0.08)',
  borderSoft: 'rgba(0,64,168,0.12)',
  cardBg: '#fff',
  pageBg: 'linear-gradient(160deg,#F0F5FF 0%,#F8FBFF 60%,#EEF4FF 100%)',
};

const card = {
  background: T.cardBg,
  border: `1px solid ${T.border}`,
  borderRadius: 16,
  boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
};

const QUICK_ACTIONS = [
  { label: 'New Booking', href: '/bookings/new', emoji: '📅', hoverBg: 'rgba(0,64,168,0.04)', hoverBorder: 'rgba(0,64,168,0.25)' },
  { label: 'Add Service', href: '/services/new', emoji: '➕', hoverBg: 'rgba(16,185,129,0.06)', hoverBorder: '#6ee7b7' },
  { label: 'Set Availability', href: '/settings/availability', emoji: '🕐', hoverBg: 'rgba(245,158,11,0.06)', hoverBorder: '#fcd34d' },
  { label: 'View Analytics', href: '/analytics', emoji: '📊', hoverBg: 'rgba(139,92,246,0.06)', hoverBorder: '#c4b5fd' },
];

/* ── Responsive grid helper ─────────────────────────────── */
function Grid({ cols = 1, mdCols, lgCols, xlCols, gap = 16, children, style }) {
  // Uses CSS custom properties + inline grid — no Tailwind needed
  return (
    <div style={{
      display: 'grid',
      gap,
      gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
      ...style,
    }}
      className={[
        mdCols && `md-grid-${mdCols}`,
        lgCols && `lg-grid-${lgCols}`,
        xlCols && `xl-grid-${xlCols}`,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}

/* ── QuickAction card ───────────────────────────────────── */
function QuickActionCard({ label, href, emoji, hoverBg, hoverBorder }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderRadius: 12,
        border: `1px solid ${hovered ? hoverBorder : 'rgba(0,64,168,0.10)'}`,
        background: hovered ? hoverBg : 'transparent',
        textDecoration: 'none',
        transition: 'all .18s ease',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
      <span style={{
        fontSize: 12, fontWeight: 600,
        color: hovered ? T.navy : T.text2,
        lineHeight: 1.3, transition: 'color .18s',
      }}>
        {label}
      </span>
    </a>
  );
}

/* ── Main page ──────────────────────────────────────────── */
export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshHovered, setRefreshHovered] = useState(false);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data);
      if (isRefresh) toast.success('Dashboard refreshed');
    } catch (err) {
      toast.error(err.message ?? 'Could not load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const stats = data?.stats ?? {};

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1280, margin: '0 auto', width: '100%' }}>

      {/* ── Page header ────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 99, marginBottom: 10,
            background: 'linear-gradient(135deg,#EEF4FF,#E5EDFF)',
            border: `1px solid ${T.borderSoft}`,
          }}>
            <Sparkles style={{ width: 12, height: 12, color: T.brand }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: T.brand, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Admin Panel
            </span>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.navy, letterSpacing: '-0.02em', margin: 0 }}>
            {greeting} 👋
          </h1>
          <p style={{ fontSize: 13, color: T.text3, marginTop: 4, fontWeight: 500 }}>{today}</p>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing || loading}
          onMouseEnter={() => setRefreshHovered(true)}
          onMouseLeave={() => setRefreshHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 12,
            border: `1px solid ${T.borderSoft}`,
            background: refreshHovered
              ? 'linear-gradient(135deg,#F0F5FF,#E8F0FF)'
              : T.cardBg,
            color: T.brand, fontSize: 13, fontWeight: 600,
            boxShadow: '0 1px 4px rgba(0,64,168,0.08)',
            cursor: refreshing || loading ? 'not-allowed' : 'pointer',
            opacity: refreshing || loading ? 0.6 : 1,
            transition: 'all .18s ease',
          }}
        >
          <RefreshCw style={{
            width: 14, height: 14,
            animation: refreshing ? 'spin .8s linear infinite' : 'none',
          }} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
      }}
        className="stats-grid"
      >
        <StatsCard
          title="Total Bookings"
          value={loading ? '—' : stats.totalBookings}
          subtitle={`${stats.todayBookings ?? 0} today`}
          icon={CalendarDays}
          iconBg="bg-[#EEF4FF]"
          iconColor="text-[#0040A8]"
          trend={loading ? undefined : stats.bookingsTrend}
          trendLabel="vs last 30 days"
          loading={loading}
        />
        <StatsCard
          title="Total Revenue"
          value={loading ? '—' : stats.totalRevenue?.toFixed(2)}
          subtitle="Last 30 days"
          icon={DollarSign}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          prefix="Rs."
          trend={loading ? undefined : stats.revenueTrend}
          trendLabel="vs prev 30 days"
          loading={loading}
        />
        <StatsCard
          title="Pending"
          value={loading ? '—' : stats.pendingBookings}
          subtitle="Awaiting confirmation"
          icon={Clock}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          loading={loading}
        />
        <StatsCard
          title="Completed"
          value={loading ? '—' : stats.completedBookings}
          subtitle={`${stats.noShowBookings ?? 0} no-shows`}
          icon={CheckCircle2}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          loading={loading}
        />
      </div>

      {/* ── Chart + Breakdown ──────────────────────────── */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1fr)' }}
        className="chart-grid"
      >
        <AnalyticsChart chartData={data?.chartData ?? []} loading={loading} />
        <BookingBreakdown stats={stats} loading={loading} />
      </div>

      {/* ── Recent Bookings + Today ─────────────────────── */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1fr)' }}
        className="bookings-grid"
      >
        <RecentBookings bookings={data?.recentBookings ?? []} loading={loading} />
        <UpcomingToday bookings={data?.upcomingToday ?? []} loading={loading} />
      </div>

      {/* ── Services + Quick Actions ───────────────────── */}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0,1fr)' }}
        className="services-grid"
      >
        <ServicesSummary services={data?.services ?? []} loading={loading} />

        {/* Quick actions card */}
        <div style={{ ...card, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Quick Actions</h2>
            <TrendingUp style={{ width: 15, height: 15, color: 'rgba(0,64,168,0.35)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.href} {...action} />
            ))}
          </div>

          <p style={{
            fontSize: 10, color: T.muted, marginTop: 16,
            fontWeight: 500, letterSpacing: '0.04em', textAlign: 'center',
          }}>
            Shortcuts to frequently used actions
          </p>
        </div>
      </div>

      {/* ── Responsive grid breakpoints (inline <style>) ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (min-width: 1024px) {
          .stats-grid    { grid-template-columns: repeat(4, minmax(0,1fr)) !important; }
          .services-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
        @media (min-width: 1280px) {
          .chart-grid    { grid-template-columns: 2fr 1fr !important; }
          .bookings-grid { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}