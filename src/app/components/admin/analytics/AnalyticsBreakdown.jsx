// src/components/admin/analytics/AnalyticsBreakdown.jsx
'use client';

const STATUS_CONFIG = {
  confirmed:   { label:'Confirmed',   color:'#0040A8', bg:'#EEF4FF' },
  completed:   { label:'Completed',   color:'#059669', bg:'#ECFDF5' },
  cancelled:   { label:'Cancelled',   color:'#ef4444', bg:'#FEF2F2' },
  pending:     { label:'Pending',     color:'#d97706', bg:'#FFFBEB' },
  noShow:      { label:'No Show',     color:'#6b7280', bg:'#F9FAFB' },
  rescheduled: { label:'Rescheduled', color:'#8b5cf6', bg:'#F5F3FF' },
};

export function StatusBreakdown({ statusBreakdown, loading }) {
  const total = statusBreakdown
    ? Object.values(statusBreakdown).reduce((s, v) => s + v, 0)
    : 0;

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Status Breakdown</h3>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {Array.from({length:5}).map((_,i) => (
            <div key={i} style={{ height:36, borderRadius:10, background:'#F0F5FF', animation:'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = statusBreakdown?.[key] ?? 0;
            const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:8, height:8, borderRadius:'50%', background:cfg.color, flexShrink:0 }} />
                    <span style={{ fontSize:12, fontWeight:600, color:'#5D7A96' }}>{cfg.label}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#0B1E3D' }}>{count}</span>
                    <span style={{ fontSize:11, color:'#A0BBCF', minWidth:32, textAlign:'right' }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height:6, background:'#F0F5FF', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:cfg.color, borderRadius:4, transition:'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ServicesBreakdown({ services, loading }) {
  const maxBookings = Math.max(...(services ?? []).map(s => s.rangeBookings), 1);

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'20px 22px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Services Performance</h3>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {Array.from({length:4}).map((_,i) => <div key={i} style={{ height:52, borderRadius:12, background:'#F0F5FF', animation:'pulse 1.5s infinite' }} />)}
        </div>
      ) : !services?.length ? (
        <p style={{ fontSize:12, color:'#A0BBCF', textAlign:'center', padding:'20px 0' }}>No services yet</p>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {services.map(s => {
            const pct = Math.round((s.rangeBookings / maxBookings) * 100);
            return (
              <div key={s.id}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                    <span style={{ width:10, height:10, borderRadius:'50%', background:s.color ?? '#0040A8', flexShrink:0 }} />
                    <span style={{ fontSize:12, fontWeight:700, color:'#0B1E3D', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:'#0B1E3D' }}>{s.rangeBookings} bookings</span>
                    {s.rangeRevenue > 0 && (
                      <span style={{ fontSize:11, fontWeight:700, color:'#059669' }}>${s.rangeRevenue.toFixed(0)}</span>
                    )}
                  </div>
                </div>
                <div style={{ height:6, background:'#F0F5FF', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:s.color ?? '#0040A8', borderRadius:4, transition:'width .5s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}