// src/components/admin/clients/ClientsTable.jsx
'use client';

import { format } from 'date-fns';
import { Users, DollarSign, CalendarDays, Eye, Inbox } from 'lucide-react';

function SkeletonRow() {
  return (
    <tr>{[1,2,3,4,5,6].map(i => (
      <td key={i} className="px-4 py-3.5">
        <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${45 + i * 9}%` }} />
      </td>
    ))}</tr>
  );
}

export default function ClientsTable({ clients = [], loading = false, onSelect }) {
  return (
    <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)', overflow:'hidden' }}>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
          <thead>
            <tr style={{ background:'#F8FBFF', borderBottom:'1px solid rgba(0,64,168,.07)' }}>
              {['Client','Contact','Total Bookings','Total Spent','Last Booking',''].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, color:'#A0BBCF', textTransform:'uppercase', letterSpacing:'0.07em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'64px 24px', color:'#A0BBCF' }}>
                    <Users style={{ width:32, height:32, marginBottom:8, opacity:0.4 }} />
                    <p style={{ fontSize:13, fontWeight:600, margin:0 }}>No clients yet</p>
                    <p style={{ fontSize:12, margin:'4px 0 0', opacity:0.7 }}>Clients appear after their first booking</p>
                  </div>
                </td>
              </tr>
            ) : (
              clients.map((client, i) => (
                <tr
                  key={client.email}
                  onClick={() => onSelect(client)}
                  style={{ borderBottom:'1px solid rgba(0,64,168,.04)', cursor:'pointer', transition:'background .15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar + name */}
                  <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:32, height:32, borderRadius:10, flexShrink:0,
                        background:`hsl(${(client.name.charCodeAt(0) * 37) % 360},55%,55%)`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'#fff', fontSize:12, fontWeight:700,
                      }}>
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin:0, fontWeight:700, fontSize:13, color:'#0B1E3D' }}>{client.name}</p>
                        <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>{client.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td style={{ padding:'12px 16px', fontSize:12, color:'#5D7A96' }}>
                    {client.phone ?? <span style={{ color:'#C8D9E8' }}>—</span>}
                  </td>

                  {/* Total bookings */}
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <CalendarDays style={{ width:13, height:13, color:'#A0BBCF' }} />
                      <span style={{ fontWeight:700, color:'#0B1E3D' }}>{client.totalBookings}</span>
                      {client.cancelled > 0 && (
                        <span style={{ fontSize:10, color:'#ef4444', background:'#fef2f2', padding:'1px 6px', borderRadius:10, fontWeight:600 }}>
                          {client.cancelled} cancelled
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Spent */}
                  <td style={{ padding:'12px 16px', fontWeight:700, color:'#059669', whiteSpace:'nowrap' }}>
                    {client.totalSpent > 0 ? `$${client.totalSpent.toFixed(2)}` : <span style={{ color:'#C8D9E8', fontWeight:400 }}>—</span>}
                  </td>

                  {/* Last booking */}
                  <td style={{ padding:'12px 16px', fontSize:12, color:'#5D7A96', whiteSpace:'nowrap' }}>
                    {client.lastBooking ? format(new Date(client.lastBooking), 'MMM d, yyyy') : '—'}
                  </td>

                  {/* View */}
                  <td style={{ padding:'12px 16px' }}>
                    <button style={{
                      display:'flex', alignItems:'center', gap:4, padding:'6px 12px',
                      borderRadius:8, border:'1px solid rgba(0,64,168,.12)',
                      background:'transparent', cursor:'pointer', fontSize:11,
                      fontWeight:600, color:'#0040A8', transition:'all .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#EEF4FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
                    >
                      <Eye style={{ width:12, height:12 }} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}