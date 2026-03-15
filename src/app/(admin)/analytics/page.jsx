// src/app/(admin)/analytics/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import AnalyticsOverviewCards           from '@/app/components/admin/analytics/AnalyticsOverviewCard';
import AnalyticsChart                   from '@/app/components/admin/analytics/AnalyticsChart';
import { StatusBreakdown, ServicesBreakdown } from '@/app/components/admin/analytics/AnalyticsBreakdown';

const RANGE_OPTIONS = [
  { label:'7 days',  value: 7  },
  { label:'30 days', value: 30 },
  { label:'90 days', value: 90 },
];

export default function AnalyticsPage() {
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [range,    setRange]    = useState(30);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/analytics?range=${range}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setData(json.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div style={{ padding:'24px', maxWidth:1200, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0040A8,#0059F5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <BarChart3 style={{ width:16, height:16, color:'#fff' }} />
            </div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#0B1E3D' }}>Analytics</h1>
          </div>
          <p style={{ margin:'4px 0 0 42px', fontSize:13, color:'#A0BBCF' }}>Booking performance and revenue insights</p>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {/* Range selector */}
          <div style={{ display:'flex', background:'#F8FBFF', borderRadius:12, padding:3, border:'1px solid rgba(0,64,168,.08)' }}>
            {RANGE_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setRange(o.value)}
                style={{
                  padding:'7px 14px', borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
                  background: range === o.value ? 'linear-gradient(135deg,#0040A8,#0059F5)' : 'transparent',
                  color:      range === o.value ? '#fff' : '#5D7A96',
                  transition:'all .15s',
                }}
              >
                {o.label}
              </button>
            ))}
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            style={{ width:36, height:36, borderRadius:10, border:'1px solid rgba(0,64,168,.12)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0040A8' }}
          >
            <RefreshCw style={{ width:15, height:15, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ marginBottom:20 }}>
        <AnalyticsOverviewCards overview={data?.overview} loading={loading} />
      </div>

      {/* Chart */}
      <div style={{ marginBottom:20 }}>
        <AnalyticsChart chartData={data?.chartData ?? []} loading={loading} />
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:16 }}>
        <StatusBreakdown   statusBreakdown={data?.statusBreakdown} loading={loading} />
        <ServicesBreakdown services={data?.services}               loading={loading} />
      </div>
    </div>
  );
}