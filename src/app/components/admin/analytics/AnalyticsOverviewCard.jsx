// src/components/admin/analytics/AnalyticsOverviewCards.jsx
'use client';

import { TrendingUp, TrendingDown, Minus, CalendarDays, DollarSign, CheckCircle, XCircle } from 'lucide-react';

function Trend({ pct }) {
  if (pct === 0) return <span style={{ fontSize:11, color:'#A0BBCF', fontWeight:600 }}>No change</span>;
  const up = pct > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:11, fontWeight:700, color: up ? '#059669' : '#ef4444' }}>
      <Icon style={{ width:12, height:12 }} />
      {up ? '+' : ''}{pct}% vs last period
    </span>
  );
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub, trend, loading }) {
  return (
    <div style={{
      background:'#fff', borderRadius:20, padding:'20px 22px',
      border:'1px solid rgba(0,64,168,.08)',
      boxShadow:'0 2px 12px rgba(0,64,168,.06)',
      flex:'1 1 180px', minWidth:0,
    }}>
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'#F0F5FF', animation:'pulse 1.5s infinite' }} />
          <div style={{ height:28, width:'60%', borderRadius:8, background:'#F0F5FF', animation:'pulse 1.5s infinite' }} />
          <div style={{ height:14, width:'80%', borderRadius:6, background:'#F0F5FF', animation:'pulse 1.5s infinite' }} />
        </div>
      ) : (
        <>
          <div style={{ width:36, height:36, borderRadius:10, background:iconBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
            <Icon style={{ width:17, height:17, color:iconColor }} />
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:'#0B1E3D', lineHeight:1 }}>{value}</div>
          <div style={{ fontSize:12, fontWeight:600, color:'#5D7A96', marginTop:4 }}>{label}</div>
          <div style={{ marginTop:8 }}><Trend pct={trend} /></div>
          {sub && <div style={{ fontSize:11, color:'#A0BBCF', marginTop:4 }}>{sub}</div>}
        </>
      )}
    </div>
  );
}

export default function AnalyticsOverviewCards({ overview, loading }) {
  if (!overview && !loading) return null;

  const cards = [
    {
      icon: CalendarDays, iconBg:'#EEF4FF', iconColor:'#0040A8',
      label: 'Total Bookings', value: overview?.totalBookings ?? 0,
      trend: overview?.bookingsTrend ?? 0,
      sub:   `${overview?.allTimeTotal ?? 0} all time`,
    },
    {
      icon: DollarSign, iconBg:'#ECFDF5', iconColor:'#059669',
      label: 'Revenue', value: `$${(overview?.totalRevenue ?? 0).toFixed(2)}`,
      trend: overview?.revenueTrend ?? 0,
    },
    {
      icon: CheckCircle, iconBg:'#F0FDF4', iconColor:'#16a34a',
      label: 'Completion Rate', value: `${overview?.completionRate ?? 0}%`,
      trend: 0,
      sub:   'Of all bookings',
    },
    {
      icon: XCircle, iconBg:'#FFF1F2', iconColor:'#ef4444',
      label: 'Cancellation Rate', value: `${overview?.cancellationRate ?? 0}%`,
      trend: 0,
      sub:   'Of all bookings',
    },
  ];

  return (
    <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
      {cards.map(c => <StatCard key={c.label} {...c} loading={loading} />)}
    </div>
  );
}