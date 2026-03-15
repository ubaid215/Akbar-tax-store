// src/app/(admin)/notifications/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Trash2, CalendarCheck, CalendarX, Clock, AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const ICONS = {
  NEW_BOOKING:       { icon: CalendarCheck, color:'#0040A8', bg:'#EEF4FF' },
  BOOKING_CONFIRMED: { icon: CalendarCheck, color:'#059669', bg:'#ECFDF5' },
  BOOKING_CANCELLED: { icon: CalendarX,     color:'#ef4444', bg:'#FEF2F2' },
  REMINDER_10MIN:    { icon: Clock,         color:'#d97706', bg:'#FFFBEB' },
  REMINDER_24HR:     { icon: Clock,         color:'#0040A8', bg:'#EEF4FF' },
  BOOKING_COMPLETED: { icon: CalendarCheck, color:'#059669', bg:'#ECFDF5' },
};

const FILTERS = ['All', 'Unread', 'Read'];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState('All');

  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/notifications?limit=50');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setNotifications(json.data.notifications);
      setUnreadCount(json.data.unreadCount);
    } catch {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ markAll:true }) });
    setNotifications(p => p.map(n => ({ ...n, sentAt: n.sentAt ?? new Date().toISOString() })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const markRead = async (id) => {
    await fetch('/api/notifications', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    setNotifications(p => p.map(n => n.id === id ? { ...n, sentAt: new Date().toISOString() } : n));
    setUnreadCount(p => Math.max(0, p - 1));
  };

  const deleteOne = async (id) => {
    await fetch(`/api/notifications?id=${id}`, { method:'DELETE' });
    setNotifications(p => p.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearRead = async () => {
    await fetch('/api/notifications', { method:'DELETE' });
    await fetchNotifs();
    toast.success('Old notifications cleared');
  };

  const filtered = notifications.filter(n => {
    if (filter === 'Unread') return !n.sentAt;
    if (filter === 'Read')   return  !!n.sentAt;
    return true;
  });

  return (
    <div style={{ padding:'24px', maxWidth:760, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0040A8,#0059F5)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <Bell style={{ width:16, height:16, color:'#fff' }} />
              {unreadCount > 0 && (
                <span style={{ position:'absolute', top:-4, right:-4, width:16, height:16, borderRadius:8, background:'#ef4444', color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#0B1E3D' }}>Notifications</h1>
          </div>
          <p style={{ margin:'4px 0 0 42px', fontSize:13, color:'#A0BBCF' }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={fetchNotifs} style={{ width:36, height:36, borderRadius:10, border:'1px solid rgba(0,64,168,.12)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0040A8' }}>
            <RefreshCw style={{ width:15, height:15 }} />
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', background:'#EEF4FF', color:'#0040A8', fontSize:12, fontWeight:700, cursor:'pointer' }}>
              <CheckCheck style={{ width:14, height:14 }} /> Mark all read
            </button>
          )}
          <button onClick={clearRead} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:10, border:'none', background:'#FEF2F2', color:'#ef4444', fontSize:12, fontWeight:700, cursor:'pointer' }}>
            <Trash2 style={{ width:14, height:14 }} /> Clear old
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:16 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding:'7px 16px', borderRadius:10, border:'none', cursor:'pointer', fontSize:12, fontWeight:700,
              background: filter === f ? 'linear-gradient(135deg,#0040A8,#0059F5)' : '#F8FBFF',
              color:      filter === f ? '#fff' : '#5D7A96',
              border:     filter === f ? 'none' : '1px solid rgba(0,64,168,.08)',
              transition:'all .15s',
            }}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span style={{ marginLeft:6, background:'rgba(255,255,255,.25)', padding:'1px 6px', borderRadius:8, fontSize:10 }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:24, display:'flex', flexDirection:'column', gap:12 }}>
            {Array.from({length:5}).map((_,i) => (
              <div key={i} style={{ height:64, borderRadius:14, background:'#F8FBFF', animation:'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding:'64px 24px', textAlign:'center', color:'#A0BBCF' }}>
            <Inbox style={{ width:32, height:32, margin:'0 auto 10px', opacity:0.4 }} />
            <p style={{ margin:0, fontSize:13, fontWeight:600 }}>No notifications</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const cfg  = ICONS[n.type] ?? ICONS.NEW_BOOKING;
            const Icon = cfg.icon;
            const read = !!n.sentAt;
            return (
              <div
                key={n.id}
                style={{
                  display:'flex', alignItems:'flex-start', gap:14,
                  padding:'14px 18px',
                  background: read ? '#fff' : 'rgba(0,64,168,.025)',
                  borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,64,168,.05)' : 'none',
                  transition:'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                onMouseLeave={e => e.currentTarget.style.background = read ? '#fff' : 'rgba(0,64,168,.025)'}
              >
                {/* Icon */}
                <div style={{ width:38, height:38, borderRadius:12, background:cfg.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  <Icon style={{ width:16, height:16, color:cfg.color }} />
                </div>

                {/* Content */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                    <div style={{ minWidth:0 }}>
                      <p style={{ margin:0, fontSize:13, fontWeight: read ? 500 : 700, color: read ? '#5D7A96' : '#0B1E3D' }}>
                        {n.type?.replace(/_/g,' ')}
                      </p>
                      {n.booking && (
                        <p style={{ margin:'2px 0 0', fontSize:12, color:'#5D7A96' }}>
                          {n.booking.clientName} — <span style={{ fontFamily:'monospace', color:'#0040A8' }}>{n.booking.bookingRef}</span>
                        </p>
                      )}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                      {!read && (
                        <button
                          onClick={() => markRead(n.id)}
                          title="Mark as read"
                          style={{ width:28, height:28, borderRadius:8, border:'none', background:'#EEF4FF', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#0040A8' }}
                        >
                          <CheckCheck style={{ width:13, height:13 }} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteOne(n.id)}
                        title="Delete"
                        style={{ width:28, height:28, borderRadius:8, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#C8D9E8' }}
                        onMouseEnter={e => { e.currentTarget.style.background='#FEF2F2'; e.currentTarget.style.color='#ef4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#C8D9E8'; }}
                      >
                        <Trash2 style={{ width:13, height:13 }} />
                      </button>
                    </div>
                  </div>
                  <p style={{ margin:'5px 0 0', fontSize:11, color:'#A0BBCF' }}>
                    {format(new Date(n.createdAt), 'MMM d, yyyy · h:mm a')}
                    {!read && <span style={{ marginLeft:8, color:'#0040A8', fontWeight:700 }}>● Unread</span>}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}