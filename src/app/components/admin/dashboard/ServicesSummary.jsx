// src/components/admin/dashboard/ServicesSummary.jsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpRight, Briefcase } from 'lucide-react';

const T = { navy: '#0B1E3D', brand: '#0040A8', muted: '#A0BBCF', border: 'rgba(0,64,168,0.08)' };

function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(0,64,168,0.04)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 10, background: '#EEF4FF', flexShrink: 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ height: 13, width: 110, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 6, borderRadius: 99, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ width: 36, height: 13, borderRadius: 6, background: '#EEF4FF', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

export default function ServicesSummary({ services = [], loading = false }) {
  const router = useRouter();
  const maxBookings = Math.max(...services.map((s) => s.totalBookings), 1);

  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${T.border}`,
      boxShadow: '0 1px 8px rgba(0,64,168,0.05)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: `1px solid ${T.border}`,
      }}>
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: T.navy, margin: 0 }}>Top Services</h2>
          <p style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Active services by bookings</p>
        </div>
        <button onClick={() => router.push('/services')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: T.brand, background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#072971'}
          onMouseLeave={e => e.currentTarget.style.color = T.brand}
        >
          Manage <ArrowUpRight style={{ width: 13, height: 13 }} />
        </button>
      </div>

      {/* List */}
      <div style={{ padding: '4px 20px 8px' }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : services.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: T.muted }}>
            <Briefcase style={{ width: 28, height: 28, marginBottom: 10, opacity: 0.4 }} />
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>No services yet</p>
            <button onClick={() => router.push('/services/new')}
              style={{ fontSize: 11, color: T.brand, marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Add your first service
            </button>
          </div>
        ) : services.map((service) => {
          const pct = Math.round((service.totalBookings / maxBookings) * 100);
          const color = service.color ?? '#0040A8';
          return (
            <div key={service.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(0,64,168,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Icon */}
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: `${color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                </div>

                {/* Name + bar */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: T.navy, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {service.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.navy }}>{service.totalBookings}</span>
                      <span style={{ fontSize: 11, color: T.muted }}>bookings</span>
                      {service.price !== null && (
                        <span style={{
                          fontSize: 11, fontWeight: 600, color: '#059669',
                          background: 'rgba(16,185,129,0.08)',
                          padding: '2px 7px', borderRadius: 99,
                        }}>
                          Rs {service.price}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, borderRadius: 99, background: `${color}15`, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      background: color, width: `${pct}%`,
                      transition: 'width .5s ease',
                    }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  );
}