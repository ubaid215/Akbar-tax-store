'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, CalendarDays, Users, Briefcase,
  Settings, BarChart3, ChevronLeft, ChevronRight,
  ShieldCheck, X,
  CalendarHeartIcon,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Bookings',  href: '/bookings',  icon: CalendarDays    },
  { label: 'Availability',  href: '/availability',  icon: CalendarHeartIcon    },
  { label: 'Services',  href: '/services',  icon: Briefcase       },
  { label: 'Clients',   href: '/clients',   icon: Users           },
  { label: 'Analytics', href: '/analytics', icon: BarChart3       },
  { label: 'Settings',  href: '/settings',  icon: Settings        },
];

const SIDEBAR_BG    = '#F8FBFF';
const SIDEBAR_BORDER = '1px solid rgba(0,64,168,0.08)';

export default function AdminSidebar({ user }) {
  const pathname = usePathname();

  const [collapsed,  setCollapsed]  = useState(false);
  // Start as null — means "not yet mounted", prevents SSR/hydration mismatch
  const [mobileOpen, setMobileOpen] = useState(null);

  // Only set mobileOpen after mount — avoids SSR transform flash
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    if (mobileOpen === null) return;
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = () => setMobileOpen((p) => !p);
    window.addEventListener('toggle-mobile-sidebar', handler);
    return () => window.removeEventListener('toggle-mobile-sidebar', handler);
  }, []);

  useEffect(() => {
    if (mobileOpen === null) return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  /* ── Shared inner content ─────────────────────────── */
  const NavContent = ({ slim = false }) => (
    <div className="flex flex-col h-full select-none">

      {/* Brand header */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: 64,
          padding: slim ? '0 12px' : '0 16px',
          justifyContent: slim ? 'center' : 'space-between',
          borderBottom: SIDEBAR_BORDER,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#0040A8,#0059F5)',
            boxShadow: '0 4px 12px rgba(0,64,168,.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck style={{ width: 16, height: 16, color: '#fff' }} />
          </div>
          {!slim && (
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0B1E3D', letterSpacing: '-0.01em' }}>
                BookingAdmin
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(0,64,168,.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Management
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle — desktop only */}
        {!slim && (
          <button
            onClick={() => setCollapsed(true)}
            className="desktop-only-flex"
            style={{
              width: 24, height: 24, borderRadius: 8, border: 'none', background: 'transparent',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#6B8CAE', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,64,168,.08)'; e.currentTarget.style.color = '#0040A8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B8CAE'; }}
          >
            <ChevronLeft style={{ width: 14, height: 14 }} />
          </button>
        )}
        {slim && (
          <button
            onClick={() => setCollapsed(false)}
            className="desktop-only-flex"
            style={{
              width: 24, height: 24, borderRadius: 8, border: 'none', background: 'transparent',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#6B8CAE', transition: 'all .15s', marginTop: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,64,168,.08)'; e.currentTarget.style.color = '#0040A8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B8CAE'; }}
          >
            <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '20px 12px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {!slim && (
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8FAAC4', padding: '0 12px', marginBottom: 8 }}>
            Navigation
          </div>
        )}
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={slim ? label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: slim ? 0 : 10,
                justifyContent: slim ? 'center' : 'flex-start',
                padding: slim ? '10px' : '9px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all .15s',
                position: 'relative',
                color: active ? '#fff' : '#5D7A96',
                background: active
                  ? 'linear-gradient(135deg,#0040A8,#0059F5)'
                  : 'transparent',
                boxShadow: active ? '0 4px 14px rgba(0,64,168,.28)' : 'none',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(0,64,168,.06)';
                  e.currentTarget.style.color = '#0B1E3D';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#5D7A96';
                }
              }}
            >
              <Icon style={{
                width: slim ? 20 : 16, height: slim ? 20 : 16,
                flexShrink: 0,
                color: active ? '#fff' : '#7A9AB8',
              }} />
              {!slim && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
              {active && !slim && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.6)', flexShrink: 0 }} />
              )}

              {/* Collapsed tooltip */}
              {slim && (
                <span style={{
                  position: 'absolute', left: '100%', marginLeft: 10,
                  padding: '5px 10px', background: '#0B1E3D', color: '#fff',
                  fontSize: 11, fontWeight: 600, borderRadius: 8,
                  whiteSpace: 'nowrap', pointerEvents: 'none',
                  opacity: 0, transition: 'opacity .15s',
                  boxShadow: '0 4px 12px rgba(0,0,0,.2)',
                  zIndex: 100,
                }}
                  className="sidebar-tooltip"
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ padding: '0 12px 12px', flexShrink: 0 }}>
        {!slim ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12,
            background: 'linear-gradient(135deg,#F0F5FF,#E8F0FF)',
            border: '1px solid rgba(0,64,168,.10)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#0040A8,#0059F5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0B1E3D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name ?? 'Admin'}
              </div>
              <div style={{ fontSize: 10, color: '#6B8CAE', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email ?? ''}
              </div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, position: 'relative',
              background: 'linear-gradient(135deg,#0040A8,#0059F5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, fontWeight: 700,
            }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 10, height: 10, borderRadius: '50%',
                background: '#34d399', border: '2px solid #F8FBFF',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // While not yet mounted, render nothing for mobile drawer
  // to prevent SSR/hydration flash
  const drawerMounted = mobileOpen !== null;

  return (
    <>
      {/* ── Desktop sidebar (in flex flow) ──────────── */}
      <aside
        className="desktop-sidebar"
        style={{
          display: 'none',
          flexShrink: 0,
          width: collapsed ? 68 : 220,
          minWidth: collapsed ? 68 : 220,
          transition: 'width .28s cubic-bezier(.4,0,.2,1)',
          background: SIDEBAR_BG,
          borderRight: SIDEBAR_BORDER,
          overflow: 'hidden',
        }}
      >
        <NavContent slim={collapsed} />
      </aside>

      {/* ── Mobile (outside flex flow, portal-like) ─── */}

      {/* Backdrop */}
      {drawerMounted && (
        <div
          onClick={() => setMobileOpen(false)}
          className="mobile-only"
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(11,30,61,.5)',
            backdropFilter: 'blur(3px)',
            opacity: mobileOpen ? 1 : 0,
            pointerEvents: mobileOpen ? 'auto' : 'none',
            transition: 'opacity .25s ease',
          }}
        />
      )}

      {/* Drawer */}
      {drawerMounted && (
        <aside
          className="mobile-only"
          style={{
            position: 'fixed', top: 0, left: 0,
            height: '100%', width: 240, zIndex: 50,
            background: SIDEBAR_BG,
            borderRight: SIDEBAR_BORDER,
            boxShadow: mobileOpen ? '4px 0 32px rgba(0,64,168,.14)' : 'none',
            // Only translate after mount — prevents SSR flash
            transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
            willChange: 'transform',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            style={{
              position: 'absolute', top: 14, right: 12,
              width: 28, height: 28, borderRadius: 8,
              border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#6B8CAE',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,64,168,.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
          <NavContent slim={false} />
        </aside>
      )}

      {/* Tooltip + responsive visibility — no Tailwind needed */}
      <style>{`
        a:hover .sidebar-tooltip { opacity: 1 !important; }

        /* Show desktop sidebar on lg+ (1024px), hide mobile elements */
        @media (min-width: 1024px) {
          .desktop-sidebar    { display: flex !important; flex-direction: column; }
          .desktop-only-flex  { display: flex !important; }
          .mobile-only        { display: none !important; }
        }
        /* Below lg: hide desktop sidebar, show mobile elements normally */
        @media (max-width: 1023px) {
          .desktop-sidebar    { display: none !important; }
          .desktop-only-flex  { display: none !important; }
          .mobile-only        { display: block; }
        }
      `}</style>
    </>
  );
}