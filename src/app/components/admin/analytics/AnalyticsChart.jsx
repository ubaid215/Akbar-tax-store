// src/components/admin/analytics/AnalyticsChart.jsx
'use client';

import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0B1E3D', borderRadius:12, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,.25)' }}>
      <p style={{ margin:'0 0 6px', fontSize:11, fontWeight:700, color:'#A0BBCF' }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ margin:'2px 0', fontSize:13, fontWeight:700, color: p.dataKey === 'revenue' ? '#34d399' : '#60a5fa' }}>
          {p.dataKey === 'revenue' ? `$${Number(p.value).toFixed(2)}` : `${p.value} bookings`}
        </p>
      ))}
    </div>
  );
};

const TABS = [
  { key:'both',     label:'Both'     },
  { key:'bookings', label:'Bookings' },
  { key:'revenue',  label:'Revenue'  },
];

const CHART_TYPES = [
  { key:'area', label:'Area' },
  { key:'bar',  label:'Bar'  },
];

export default function AnalyticsChart({ chartData = [], loading = false }) {
  const [tab,       setTab]       = useState('both');
  const [chartType, setChartType] = useState('area');

  const showBookings = tab === 'both' || tab === 'bookings';
  const showRevenue  = tab === 'both' || tab === 'revenue';

  const ChartWrapper = chartType === 'area' ? AreaChart : BarChart;
  const DataElement  = chartType === 'area' ? Area      : Bar;

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'20px 24px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Booking Analytics</h2>
          <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>Daily overview</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {/* Chart type */}
          <div style={{ display:'flex', background:'#F8FBFF', borderRadius:10, padding:3, border:'1px solid rgba(0,64,168,.08)' }}>
            {CHART_TYPES.map(t => (
              <button key={t.key} onClick={() => setChartType(t.key)} style={{
                padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:600,
                background: chartType === t.key ? '#0040A8' : 'transparent',
                color:      chartType === t.key ? '#fff'     : '#5D7A96',
                transition:'all .15s',
              }}>{t.label}</button>
            ))}
          </div>
          {/* Data tab */}
          <div style={{ display:'flex', background:'#F8FBFF', borderRadius:10, padding:3, border:'1px solid rgba(0,64,168,.08)' }}>
            {TABS.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                padding:'5px 12px', borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:600,
                background: tab === t.key ? '#0040A8' : 'transparent',
                color:      tab === t.key ? '#fff'     : '#5D7A96',
                transition:'all .15s',
              }}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ height:260, background:'#F8FBFF', borderRadius:14, animation:'pulse 1.5s infinite' }} />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <ChartWrapper data={chartData} margin={{ top:5, right:10, bottom:0, left:-10 }}>
            <defs>
              <linearGradient id="gBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#0040A8" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#0040A8" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#059669" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,64,168,.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize:10, fill:'#A0BBCF', fontWeight:600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:'#A0BBCF' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {(showBookings && showRevenue) && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, paddingTop:8 }} />}

            {showBookings && (
              <DataElement
                type="monotone" dataKey="bookings" name="Bookings"
                stroke="#0040A8" strokeWidth={2}
                fill={chartType === 'area' ? 'url(#gBookings)' : '#0040A8'}
                fillOpacity={chartType === 'bar' ? 0.85 : 1}
                dot={false} activeDot={{ r:5, strokeWidth:2 }}
                radius={chartType === 'bar' ? [6,6,0,0] : undefined}
              />
            )}
            {showRevenue && (
              <DataElement
                type="monotone" dataKey="revenue" name="Revenue ($)"
                stroke="#059669" strokeWidth={2}
                fill={chartType === 'area' ? 'url(#gRevenue)' : '#059669'}
                fillOpacity={chartType === 'bar' ? 0.85 : 1}
                dot={false} activeDot={{ r:5, strokeWidth:2 }}
                radius={chartType === 'bar' ? [6,6,0,0] : undefined}
              />
            )}
          </ChartWrapper>
        </ResponsiveContainer>
      )}
    </div>
  );
}