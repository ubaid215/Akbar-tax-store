// src/components/admin/clients/ClientDetailPanel.jsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, Mail, Phone, Globe, DollarSign, CalendarDays, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import BookingStatusBadge from '@/app/components/admin/dashboard/BookingStatusBadge';

const statColor = { COMPLETED:'#059669', CANCELLED:'#ef4444', PENDING:'#f59e0b', CONFIRMED:'#0040A8', NO_SHOW:'#6b7280' };

export default function ClientDetailPanel({ client, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) return;
    setLoading(true);
    fetch(`/api/clients/${encodeURIComponent(client.email)}`)
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .finally(() => setLoading(false));
  }, [client?.email]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:40, backdropFilter:'blur(2px)' }}
      />

      {/* Panel */}
      <div style={{
        position:'fixed', right:0, top:0, bottom:0,
        width:'min(480px, 100vw)',
        background:'#fff',
        boxShadow:'-8px 0 40px rgba(0,64,168,.14)',
        zIndex:50,
        display:'flex', flexDirection:'column',
        animation:'slideInRight .25s ease',
      }}>
        <style>{`@keyframes slideInRight { from { transform:translateX(100%) } to { transform:translateX(0) } }`}</style>

        {/* Header */}
        <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid rgba(0,64,168,.08)', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{
                width:44, height:44, borderRadius:14,
                background:`hsl(${((client?.name ?? 'A').charCodeAt(0) * 37) % 360},55%,55%)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontSize:18, fontWeight:700, flexShrink:0,
              }}>
                {(client?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0B1E3D' }}>{client?.name}</h2>
                <p style={{ margin:0, fontSize:12, color:'#A0BBCF' }}>{client?.email}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, border:'none', background:'#F8FBFF', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X style={{ width:15, height:15, color:'#5D7A96' }} />
            </button>
          </div>

          {/* Contact info */}
          {(client?.phone || client?.email) && (
            <div style={{ display:'flex', gap:16, marginTop:12, flexWrap:'wrap' }}>
              {client.email && (
                <a href={`mailto:${client.email}`} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#0040A8', textDecoration:'none' }}>
                  <Mail style={{ width:12, height:12 }} />{client.email}
                </a>
              )}
              {client.phone && (
                <a href={`tel:${client.phone}`} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#5D7A96', textDecoration:'none' }}>
                  <Phone style={{ width:12, height:12 }} />{client.phone}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats bar */}
        {!loading && data && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderBottom:'1px solid rgba(0,64,168,.08)', flexShrink:0 }}>
            {[
              { label:'Total', value: data.stats.total,               color:'#0B1E3D' },
              { label:'Done',  value: data.stats.completed,            color:'#059669' },
              { label:'Cancelled', value: data.stats.cancelled,       color:'#ef4444' },
              { label:'Spent', value:`$${data.stats.totalSpent.toFixed(0)}`, color:'#059669' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ padding:'12px 8px', textAlign:'center', borderRight:'1px solid rgba(0,64,168,.06)' }}>
                <div style={{ fontSize:16, fontWeight:800, color }}>{value}</div>
                <div style={{ fontSize:10, color:'#A0BBCF', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Booking history */}
        <div style={{ flex:1, overflowY:'auto', padding:'16px 24px' }}>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {Array.from({length:4}).map((_,i) => (
                <div key={i} style={{ height:72, borderRadius:14, background:'#F8FBFF', animation:'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : !data ? (
            <div style={{ textAlign:'center', padding:'40px 0', color:'#A0BBCF' }}>
              <AlertCircle style={{ width:28, height:28, margin:'0 auto 8px', opacity:0.4 }} />
              <p>No data found</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontSize:12, fontWeight:700, color:'#A0BBCF', textTransform:'uppercase', letterSpacing:'0.08em', margin:'0 0 12px' }}>
                Booking History ({data.bookings.length})
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {data.bookings.map(b => (
                  <div key={b.id} style={{
                    padding:'12px 14px', borderRadius:14,
                    border:'1px solid rgba(0,64,168,.08)',
                    background:'#fff',
                    transition:'all .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                        {b.service && (
                          <span style={{ width:8, height:8, borderRadius:'50%', background: b.service.color ?? '#0040A8', flexShrink:0 }} />
                        )}
                        <div style={{ minWidth:0 }}>
                          <p style={{ margin:0, fontSize:12, fontWeight:700, color:'#0B1E3D', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {b.service?.name ?? 'Booking'}
                          </p>
                          <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>
                            {format(new Date(b.startTime), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                        {b.pricePaid != null && (
                          <span style={{ fontSize:11, fontWeight:700, color:'#059669' }}>${Number(b.pricePaid).toFixed(2)}</span>
                        )}
                        <BookingStatusBadge status={b.status} />
                      </div>
                    </div>
                    <p style={{ margin:'4px 0 0', fontSize:11, color:'#C8D9E8', fontFamily:'monospace' }}>{b.bookingRef}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}