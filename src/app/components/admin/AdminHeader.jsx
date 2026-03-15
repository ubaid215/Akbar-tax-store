'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Bell, Menu, ChevronDown, LogOut,
  User, Settings, CheckCheck,
  CalendarCheck, CalendarX, Clock,
} from 'lucide-react';
import { toast } from 'sonner';

const NOTIF_ICONS = {
  NEW_BOOKING:          { icon: CalendarCheck, color: '#0040A8', bg: '#EEF4FF' },
  BOOKING_CONFIRMED:    { icon: CalendarCheck, color: '#059669', bg: '#ECFDF5' },
  BOOKING_CANCELLED:    { icon: CalendarX,     color: '#ef4444', bg: '#FEF2F2' },
  BOOKING_RESCHEDULED:  { icon: CalendarCheck, color: '#8b5cf6', bg: '#F5F3FF' },
  REMINDER_10MIN:       { icon: Clock,         color: '#d97706', bg: '#FFFBEB' },
  REMINDER_24HR:        { icon: Clock,         color: '#0040A8', bg: '#EEF4FF' },
  BOOKING_COMPLETED:    { icon: CalendarCheck, color: '#059669', bg: '#ECFDF5' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (!ref.current?.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);
    return () => {
      document.removeEventListener('mousedown', fn);
      document.removeEventListener('touchstart', fn);
    };
  }, [ref, handler]);
}

function showBrowserPush(title, body) {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: '/web-app-manifest-192x192.png' }); } catch { /* blocked */ }
}

// Convert base64url VAPID key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function registerWebPush() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    // 1. Request browser notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    // 2. Get VAPID public key from server
    const keyRes = await fetch('/api/push/subscribe');
    if (!keyRes.ok) return; // push not configured — skip silently
    const { publicKey } = await keyRes.json();
    if (!publicKey) return;

    // 3. Get/wait for the service worker
    const reg = await navigator.serviceWorker.ready;

    // 4. Check if already subscribed with same key
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      // Already subscribed — ensure server has this subscription
      await fetch('/api/push/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(existing),
      });
      return;
    }

    // 5. Subscribe
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // 6. Save to server
    await fetch('/api/push/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(subscription),
    });
  } catch (err) {
    // Non-critical — don't crash
    console.warn('[WebPush]', err.message);
  }
}

export default function AdminHeader({ user }) {
  const router = useRouter();
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [userOpen,      setUserOpen]      = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [signingOut,    setSigningOut]    = useState(false);
  const [connected,     setConnected]     = useState(false);

  const notifRef      = useRef(null);
  const userRef       = useRef(null);
  const prevCountRef  = useRef(0);
  const esRef         = useRef(null);
  const reconnectRef  = useRef(null);

  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(userRef,  () => setUserOpen(false));

  // ── SSE connection ─────────────────────────────────────────
  const connectSSE = useCallback(() => {
    // Don't open duplicate connections
    if (esRef.current?.readyState === EventSource.OPEN) return;
    if (esRef.current) { esRef.current.close(); esRef.current = null; }

    const es = new EventSource('/api/notifications/stream');
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type !== 'state') return;

        const newCount = data.unreadCount ?? 0;

        // Only show push if count genuinely increased (not just a poll refresh)
        if (newCount > prevCountRef.current && prevCountRef.current >= 0) {
          const newest = (data.notifications ?? []).find(n => !n.sentAt);
          if (newest) {
            showBrowserPush(
              newest.type?.replace(/_/g, ' ') ?? 'New Notification',
              newest.booking
                ? `${newest.booking.clientName} — ${newest.booking.bookingRef}`
                : newest.body ?? '',
            );
            toast.info(newest.type?.replace(/_/g, ' ') ?? 'Notification', {
              description: newest.booking?.clientName,
            });
          }
        }

        prevCountRef.current = newCount;
        setUnreadCount(newCount);
        setNotifications(data.notifications ?? []);
      } catch { /* parse error */ }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      // Reconnect after 60 seconds (was 10s — much less aggressive)
      reconnectRef.current = setTimeout(connectSSE, 60_000);
    };
  }, []);

  useEffect(() => {
    // Register for web push (VAPID) — runs once after SW is ready
    registerWebPush();
    connectSSE();
    return () => {
      esRef.current?.close();
      esRef.current = null;
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
    };
  }, [connectSSE]);

  // ── Mark as read ──────────────────────────────────────────
  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setNotifications(p => p.map(n => ({ ...n, sentAt: n.sentAt ?? new Date().toISOString() })));
      setUnreadCount(0);
      prevCountRef.current = 0;
      toast.success('All marked as read');
    } catch { toast.error('Failed'); }
  };

  const markOneRead = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setNotifications(p => p.map(n => n.id === id ? { ...n, sentAt: new Date().toISOString() } : n));
      setUnreadCount(p => Math.max(0, p - 1));
    } catch { /* silent */ }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setUserOpen(false);
    try { await signOut({ callbackUrl: '/login' }); }
    catch { toast.error('Failed to sign out'); setSigningOut(false); }
  };

  const dropdownStyle = (open) => ({
    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
    background: '#fff',
    border: '1px solid rgba(0,64,168,.10)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,64,168,.14), 0 1px 4px rgba(0,0,0,.06)',
    overflow: 'hidden',
    transformOrigin: 'top right',
    transition: 'opacity .18s ease, transform .18s ease',
    opacity: open ? 1 : 0,
    transform: open ? 'scale(1) translateY(0)' : 'scale(.95) translateY(-6px)',
    pointerEvents: open ? 'auto' : 'none',
    zIndex: 60,
  });

  return (
    <header style={{
      height: 64, flexShrink: 0,
      background: '#fff',
      borderBottom: '1px solid rgba(0,64,168,.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      position: 'relative', zIndex: 30,
    }}>

      {/* ── Left ──────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="lg:hidden"
          onClick={() => window.dispatchEvent(new Event('toggle-mobile-sidebar'))}
          aria-label="Toggle sidebar"
          style={{ width:36, height:36, borderRadius:10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#5D7A96' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,64,168,.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu style={{ width:20, height:20 }} />
        </button>

        <div className="hidden sm:block" style={{ lineHeight:1.2 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#A0BBCF' }}>Admin</div>
          <div style={{ fontSize:13, fontWeight:700, color:'#0B1E3D' }}>Dashboard</div>
        </div>
      </div>

      {/* ── Right ─────────────────────────── */}
      <div style={{ display:'flex', alignItems:'center', gap:4 }}>

        {/* Bell */}
        <div ref={notifRef} style={{ position:'relative' }}>
          <button
            onClick={() => { setNotifOpen(p => !p); setUserOpen(false); }}
            aria-label="Notifications"
            style={{ width:36, height:36, borderRadius:10, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#5D7A96', position:'relative' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,64,168,.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Bell style={{ width:18, height:18 }} />
            {/* Connection status dot */}
            <span style={{
              position:'absolute', bottom:6, right:6,
              width:5, height:5, borderRadius:'50%',
              background: connected ? '#059669' : '#f59e0b',
              border:'1.5px solid #fff',
            }} />
            {unreadCount > 0 && (
              <span style={{
                position:'absolute', top:5, right:5,
                minWidth:16, height:16, borderRadius:8,
                background:'linear-gradient(135deg,#0040A8,#0059F5)',
                color:'#fff', fontSize:9, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
                padding:'0 3px', border:'2px solid #fff',
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          <div style={{ ...dropdownStyle(notifOpen), width:'min(340px, calc(100vw - 24px))' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(0,64,168,.07)' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:'#0B1E3D' }}>Notifications</div>
                <div style={{ fontSize:11, fontWeight:600, marginTop:1, color: connected ? '#059669' : '#f59e0b' }}>
                  {connected ? '● Live' : '● Reconnecting…'}
                </div>
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:'#0040A8', background:'none', border:'none', cursor:'pointer' }}>
                  <CheckCheck style={{ width:13, height:13 }} /> Mark all read
                </button>
              )}
            </div>

            <div style={{ maxHeight:300, overflowY:'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding:'32px 16px', textAlign:'center', color:'#A0BBCF' }}>
                  <Bell style={{ width:24, height:24, margin:'0 auto 8px', opacity:0.4 }} />
                  <p style={{ margin:0, fontSize:12 }}>No notifications yet</p>
                </div>
              ) : notifications.map(n => {
                const cfg  = NOTIF_ICONS[n.type] ?? NOTIF_ICONS.NEW_BOOKING;
                const Icon = cfg.icon;
                const read = !!n.sentAt;
                return (
                  <button
                    key={n.id}
                    onClick={() => { markOneRead(n.id); setNotifOpen(false); router.push('/notifications'); }}
                    style={{
                      width:'100%', display:'flex', alignItems:'flex-start', gap:12,
                      padding:'10px 16px', border:'none', cursor:'pointer', textAlign:'left',
                      background: read ? 'transparent' : 'rgba(0,64,168,.03)',
                      borderBottom:'1px solid rgba(0,64,168,.04)',
                      transition:'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                    onMouseLeave={e => e.currentTarget.style.background = read ? 'transparent' : 'rgba(0,64,168,.03)'}
                  >
                    <div style={{ width:32, height:32, borderRadius:10, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <Icon style={{ width:15, height:15, color:cfg.color }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:600, color: read ? '#5D7A96' : '#0B1E3D' }}>
                        {n.type?.replace(/_/g,' ')}
                      </div>
                      <div style={{ fontSize:11, color:'#7A9AB8', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {n.booking ? `${n.booking.clientName} — ${n.booking.bookingRef}` : (n.body ?? '')}
                      </div>
                      <div style={{ fontSize:10, color:'#A0BBCF', marginTop:3 }}>{timeAgo(n.createdAt)}</div>
                    </div>
                    {!read && <span style={{ width:7, height:7, borderRadius:'50%', background:'#0040A8', flexShrink:0, marginTop:6 }} />}
                  </button>
                );
              })}
            </div>

            <div style={{ padding:'8px 16px', borderTop:'1px solid rgba(0,64,168,.07)', background:'#F8FBFF' }}>
              <button
                onClick={() => { router.push('/notifications'); setNotifOpen(false); }}
                style={{ width:'100%', fontSize:11, fontWeight:600, color:'#0040A8', background:'none', border:'none', cursor:'pointer', textAlign:'center' }}
              >
                View all notifications →
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width:1, height:20, background:'rgba(0,64,168,.10)', margin:'0 4px' }} />

        {/* User menu */}
        <div ref={userRef} style={{ position:'relative' }}>
          <button
            onClick={() => { setUserOpen(p => !p); setNotifOpen(false); }}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px 6px 8px', borderRadius:10, border:'none', background:'transparent', cursor:'pointer', transition:'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,64,168,.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:'linear-gradient(135deg,#0040A8,#0059F5)', boxShadow:'0 2px 8px rgba(0,64,168,.28)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <div className="hidden md:block" style={{ lineHeight:1.2, textAlign:'left' }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#0B1E3D', maxWidth:100, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.name ?? 'Admin'}
              </div>
              <div style={{ fontSize:10, color:'#A0BBCF', textTransform:'capitalize' }}>
                {user?.role?.toLowerCase().replace('_',' ') ?? 'admin'}
              </div>
            </div>
            <ChevronDown style={{ width:14, height:14, color:'#A0BBCF', flexShrink:0, transform: userOpen ? 'rotate(180deg)' : 'rotate(0)', transition:'transform .2s' }} />
          </button>

          <div style={{ ...dropdownStyle(userOpen), width:208 }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid rgba(0,64,168,.07)', background:'#F8FBFF', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:10, flexShrink:0, background:'linear-gradient(135deg,#0040A8,#0059F5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12, fontWeight:700 }}>
                {user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#0B1E3D', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div>
                <div style={{ fontSize:10, color:'#A0BBCF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ padding:'6px 0' }}>
              {[
                { label:'My Profile', icon: User,    href:'/settings/profile' },
                { label:'Settings',   icon: Settings, href:'/settings'         },
              ].map(({ label, icon: Icon, href }) => (
                <button
                  key={href}
                  onClick={() => { router.push(href); setUserOpen(false); }}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 16px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:500, color:'#5D7A96', transition:'all .15s', textAlign:'left' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#F8FBFF'; e.currentTarget.style.color='#0B1E3D'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#5D7A96'; }}
                >
                  <Icon style={{ width:15, height:15, color:'#A0BBCF', flexShrink:0 }} />
                  {label}
                </button>
              ))}
            </div>

            <div style={{ borderTop:'1px solid rgba(0,64,168,.07)', padding:'6px 0' }}>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'9px 16px', border:'none', background:'transparent', cursor:'pointer', fontSize:13, fontWeight:600, color:'#ef4444', transition:'background .15s', textAlign:'left', opacity: signingOut ? 0.5 : 1 }}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut style={{ width:15, height:15, flexShrink:0 }} />
                {signingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}