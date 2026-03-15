// src/components/admin/bookings/BookingDetailModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  X, Calendar, Clock, Mail, Phone, Briefcase,
  DollarSign, FileText, CheckCircle, XCircle, UserX, AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import BookingStatusBadge from '@/app/components/admin/dashboard/BookingStatusBadge';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.10)' };

const STATUS_ACTIONS = [
  { status: 'CONFIRMED', label: 'Confirm',  icon: CheckCircle, textColor: T.brand,   bg: 'rgba(0,64,168,0.07)',   border: 'rgba(0,64,168,0.18)',   from: ['PENDING']             },
  { status: 'COMPLETED', label: 'Complete', icon: CheckCircle, textColor: '#059669', bg: 'rgba(5,150,105,0.07)', border: 'rgba(5,150,105,0.20)',  from: ['CONFIRMED']           },
  { status: 'NO_SHOW',   label: 'No Show',  icon: UserX,       textColor: T.text2,   bg: 'rgba(93,122,150,0.07)',border: 'rgba(93,122,150,0.18)', from: ['CONFIRMED','PENDING'] },
  { status: 'CANCELLED', label: 'Cancel',   icon: XCircle,     textColor: '#DC2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.18)',  from: ['PENDING','CONFIRMED'] },
];

/* ── Info row ──────────────────────────────────────────── */
function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginTop: 2,
        background: 'rgba(0,64,168,0.05)', border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ width: 13, height: 13, color: T.text2 }} />
      </div>
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: T.muted, margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.navy, margin: '3px 0 0' }}>{value}</p>
      </div>
    </div>
  );
}

/* ── Section heading ───────────────────────────────────── */
function SectionHead({ children }) {
  return (
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: T.muted, margin: '0 0 12px' }}>
      {children}
    </p>
  );
}

/* ── Action button ─────────────────────────────────────── */
function ActionBtn({ label, icon: Icon, textColor, bg, border: brd, onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '8px 14px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 12, fontWeight: 600, border: `1px solid ${brd}`,
        background: hov ? bg.replace('0.07','0.12').replace('0.06','0.10') : bg,
        color: textColor, opacity: disabled ? 0.5 : 1,
        transition: 'all .15s ease',
      }}
    >
      <Icon style={{ width: 13, height: 13 }} />
      {label}
    </button>
  );
}

/* ── Textarea with focus state ─────────────────────────── */
function FocusTextarea({ value, onChange, placeholder, rows = 3 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={()  => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box',
        padding: '10px 14px', fontSize: 13, borderRadius: 12,
        border: `1.5px solid ${focused ? T.brand : T.border}`,
        background: focused ? '#fff' : '#F8FBFF', color: T.navy,
        outline: 'none', resize: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.08)' : 'none',
        transition: 'all .15s ease',
        fontFamily: 'inherit',
      }}
    />
  );
}

/* ── Save notes button ─────────────────────────────────── */
function SaveNotesBtn({ onClick, disabled }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        marginTop: 8, padding: '8px 16px', borderRadius: 10, border: 'none',
        fontSize: 12, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
        background: hov && !disabled ? 'linear-gradient(135deg,#072971,#0040A8)' : 'linear-gradient(135deg,#0040A8,#0059F5)',
        color: '#fff', opacity: disabled ? 0.45 : 1,
        transition: 'all .15s ease',
      }}
    >
      Save Notes
    </button>
  );
}

/* ── Modal ─────────────────────────────────────────────── */
export default function BookingDetailModal({ bookingId, onClose, onUpdate }) {
  const [booking,    setBooking]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [cancelNote, setCancelNote] = useState('');
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    fetch(`/api/bookings/${bookingId}`)
      .then(r => r.json())
      .then(json => {
        if (json.success) { setBooking(json.data); setAdminNotes(json.data.adminNotes ?? ''); }
      })
      .catch(() => toast.error('Failed to load booking'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'CANCELLED' && !showCancel) { setShowCancel(true); return; }
    setSaving(true);
    try {
      const res  = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes, cancellationReason: cancelNote || undefined }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setBooking(prev => ({ ...prev, ...json.data }));
      toast.success(`Booking ${newStatus.toLowerCase()}`);
      setShowCancel(false);
      onUpdate?.();
    } catch (err) {
      toast.error(err.message ?? 'Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Notes saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const availableActions = STATUS_ACTIONS.filter(a => a.from.includes(booking?.status));

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'rgba(7,41,113,0.45)', backdropFilter: 'blur(4px)',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,64,168,0.20)',
        width: '100%', maxWidth: 520,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        animation: 'fadeIn .18s ease',
      }}>
        {/* ── Header ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 22px', borderBottom: `1px solid ${T.border}`, flexShrink: 0,
        }}>
          <div>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: '-0.01em' }}>
              Booking Detail
            </h2>
            {booking && (
              <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0', fontFamily: 'monospace' }}>
                {booking.bookingRef}
              </p>
            )}
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {/* ── Scrollable body ─────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="anim-pulse" style={{ height: 48, borderRadius: 12, background: '#EEF4FF' }} />
              ))}
            </div>
          ) : !booking ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', color: T.muted, gap: 8 }}>
              <AlertCircle style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13 }}>Booking not found</span>
            </div>
          ) : (
            <>
              {/* Status row */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: '#F8FBFF', border: `1px solid ${T.border}`,
                borderRadius: 12, padding: '10px 14px',
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.muted }}>Status</span>
                <BookingStatusBadge status={booking.status} />
              </div>

              {/* Client */}
              <div>
                <SectionHead>Client</SectionHead>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg,#0040A8,#0059F5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 15, fontWeight: 700,
                    }}>
                      {booking.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: T.navy, margin: 0 }}>{booking.clientName}</p>
                      {booking.clientPhone && <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>{booking.clientPhone}</p>}
                    </div>
                  </div>
                  <InfoRow icon={Mail}  label="Email" value={booking.clientEmail} />
                  <InfoRow icon={Phone} label="Phone" value={booking.clientPhone} />
                  {booking.clientNotes && (
                    <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 12, padding: '10px 14px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: '#B45309', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Client Notes</p>
                      <p style={{ fontSize: 12, color: '#92400E', margin: 0, lineHeight: 1.6 }}>{booking.clientNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment */}
              <div>
                <SectionHead>Appointment</SectionHead>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <InfoRow icon={Calendar}   label="Date"    value={format(new Date(booking.startTime), 'EEEE, MMMM d, yyyy')} />
                  <InfoRow icon={Clock}      label="Time"    value={`${format(new Date(booking.startTime), 'h:mm a')} – ${format(new Date(booking.endTime), 'h:mm a')}`} />
                  <InfoRow icon={Briefcase}  label="Service" value={booking.service?.name} />
                  <InfoRow icon={DollarSign} label="Amount"  value={booking.pricePaid ? `$${Number(booking.pricePaid).toFixed(2)}` : 'Free'} />
                </div>
              </div>

              {/* Cancellation reason */}
              {booking.status === 'CANCELLED' && booking.cancellationReason && (
                <div style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.16)', borderRadius: 12, padding: '10px 14px' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', margin: '0 0 4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cancellation Reason</p>
                  <p style={{ fontSize: 12, color: '#991B1B', margin: 0, lineHeight: 1.6 }}>{booking.cancellationReason}</p>
                </div>
              )}

              {/* Cancel confirm panel */}
              {showCancel && (
                <div style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', margin: 0 }}>Cancel this booking?</p>
                  <FocusTextarea
                    value={cancelNote}
                    onChange={e => setCancelNote(e.target.value)}
                    placeholder="Reason for cancellation (optional)…"
                    rows={2}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ConfirmCancelBtn onClick={() => handleStatusChange('CANCELLED')} disabled={saving} label={saving ? 'Cancelling…' : 'Yes, Cancel'} />
                    <KeepBtn onClick={() => setShowCancel(false)} />
                  </div>
                </div>
              )}

              {/* Status actions */}
              {availableActions.length > 0 && !showCancel && (
                <div>
                  <SectionHead>Actions</SectionHead>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {availableActions.map(a => (
                      <ActionBtn key={a.status} {...a} onClick={() => handleStatusChange(a.status)} disabled={saving} />
                    ))}
                  </div>
                </div>
              )}

              {/* Admin notes */}
              <div>
                <SectionHead>
                  <FileText style={{ display: 'inline', width: 11, height: 11, marginRight: 5, verticalAlign: 'middle' }} />
                  Admin Notes
                </SectionHead>
                <FocusTextarea
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this booking…"
                  rows={3}
                />
                <SaveNotesBtn onClick={handleSaveNotes} disabled={saving || adminNotes === (booking.adminNotes ?? '')} />
              </div>

              {/* History */}
              {booking.history?.length > 0 && (
                <div>
                  <SectionHead>History</SectionHead>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {booking.history.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.brand, marginTop: 5, flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 500, color: T.navy, margin: 0 }}>
                            {h.fromStatus ? `${h.fromStatus} → ${h.toStatus}` : `Created as ${h.toStatus}`}
                            <span style={{ color: T.muted, fontWeight: 400, marginLeft: 6 }}>by {h.changedBy}</span>
                          </p>
                          {h.reason && <p style={{ fontSize: 11, color: T.muted, margin: '2px 0 0' }}>{h.reason}</p>}
                          <p style={{ fontSize: 10, color: T.muted, margin: '2px 0 0', opacity: 0.65 }}>
                            {format(new Date(h.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CloseBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
        background: hov ? 'rgba(0,64,168,0.06)' : 'transparent',
        color: hov ? T.navy : T.muted, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s ease',
      }}>
      <X style={{ width: 15, height: 15 }} />
    </button>
  );
}

function ConfirmCancelBtn({ onClick, disabled, label }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '9px 12px', borderRadius: 10, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 12, fontWeight: 700, color: '#fff',
        background: hov ? '#B91C1C' : '#DC2626', opacity: disabled ? 0.55 : 1,
        transition: 'all .15s ease',
      }}>
      {label}
    </button>
  );
}

function KeepBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '9px 12px', borderRadius: 10, border: `1px solid ${T.border}`, cursor: 'pointer',
        fontSize: 12, fontWeight: 700, color: T.text2,
        background: hov ? '#F8FBFF' : '#fff',
        transition: 'all .15s ease',
      }}>
      Keep Booking
    </button>
  );
}