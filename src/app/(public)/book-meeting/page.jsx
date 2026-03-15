"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, User, Mail, Phone, MessageSquare,
  CheckCircle, Star, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Briefcase, Shield, Zap,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  navy:    '#0B1E3D',
  brand:   '#0040A8',
  brandLt: '#0059F5',
  text2:   '#5D7A96',
  muted:   '#A0BBCF',
  border:  'rgba(0,64,168,0.10)',
  bg:      '#F4F7FF',
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const TZ = 'Asia/Karachi';

const fmt = (isoStr, opts = {}) =>
  new Date(isoStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ, ...opts });

const fmtDate = (isoStr, opts) =>
  new Date(isoStr).toLocaleDateString('en-US', { timeZone: TZ, ...opts });

const toYMD = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const toMonthKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

/* ═══════════════════════════════════════════════════════════
   SHARED SMALL COMPONENTS
═══════════════════════════════════════════════════════════ */
function SectionTitle({ icon: Icon, children, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: 'linear-gradient(135deg,#0040A8,#0059F5)',
        boxShadow: '0 3px 10px rgba(0,64,168,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ width: 15, height: 15, color: '#fff' }} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: '-0.01em' }}>
        {children}
      </h3>
      {badge && (
        <span style={{ fontSize: 11, color: T.text2, fontWeight: 500, marginLeft: 4 }}>{badge}</span>
      )}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: `1px solid ${T.border}`,
      boxShadow: '0 4px 24px rgba(0,64,168,0.07), 0 1px 4px rgba(0,64,168,0.04)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function FormInput({ label, required, icon: Icon, ...inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: T.text2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            width: 14, height: 14, color: focused ? T.brand : T.muted,
            pointerEvents: 'none', transition: 'color .15s',
          }} />
        )}
        <input
          {...inputProps}
          onFocus={e => { setFocused(true); inputProps.onFocus?.(e); }}
          onBlur={e  => { setFocused(false); inputProps.onBlur?.(e); }}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: `11px 14px 11px ${Icon ? 38 : 14}px`,
            fontSize: 13, borderRadius: 12,
            border: `1.5px solid ${focused ? T.brand : T.border}`,
            background: focused ? '#fff' : '#F8FBFF',
            color: T.navy, outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.09)' : 'none',
            transition: 'all .18s ease',
          }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CALENDAR COMPONENT
═══════════════════════════════════════════════════════════ */
function BookingCalendar({
  currentMonth, setCurrentMonth,
  selectedDate, setSelectedDate, setSelectedSlot,
  availableDates, blockedDates, loadingDates,
}) {
  const calendarDays = (() => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    const first = new Date(y, m, 1);
    const last  = new Date(y, m + 1, 0);
    const start = new Date(first);
    start.setDate(start.getDate() - first.getDay());
    const end = new Date(last);
    end.setDate(end.getDate() + (6 - last.getDay()));
    const days = [];
    const cur  = new Date(start);
    while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }
    return days;
  })();

  const availSet  = new Set(availableDates.map(d => d.date));
  const blockedSet = new Set(blockedDates);

  const isDateSelectable = (date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (date < today) return false;
    const ymd = toYMD(date);
    if (blockedSet.has(ymd)) return false;
    return availSet.has(ymd);
  };

  const prevMonth = () => setCurrentMonth(m => { const n = new Date(m); n.setMonth(m.getMonth()-1); return n; });
  const nextMonth = () => setCurrentMonth(m => { const n = new Date(m); n.setMonth(m.getMonth()+1); return n; });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle icon={Calendar} badge={loadingDates ? '…' : ''}>
          Select a Date
        </SectionTitle>
      </div>

      <div style={{
        borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${T.border}`,
        boxShadow: '0 2px 16px rgba(0,64,168,0.06)',
      }}>
        {/* Month nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(135deg,#0040A8,#0059F5)',
        }}>
          <NavArrow onClick={prevMonth} direction="left" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {loadingDates && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Loading availability…</div>
            )}
          </div>
          <NavArrow onClick={nextMonth} direction="right" />
        </div>

        {/* Day labels */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7,1fr)',
          background: 'rgba(0,64,168,0.04)',
          borderBottom: `1px solid ${T.border}`,
        }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.06em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px 8px 10px', gap: 2, background: '#fff' }}>
          {calendarDays.map((date, i) => {
            const ymd        = toYMD(date);
            const inMonth    = date.getMonth() === currentMonth.getMonth();
            const selectable = isDateSelectable(date);
            const isSelected = selectedDate === ymd;
            const isToday    = ymd === toYMD(new Date());
            const isBlocked  = blockedSet.has(ymd);
            const hasSlots   = availSet.has(ymd) && selectable;

            return (
              <CalendarDay
                key={i}
                day={date.getDate()}
                inMonth={inMonth}
                selectable={selectable}
                isSelected={isSelected}
                isToday={isToday}
                isBlocked={isBlocked && inMonth}
                hasSlots={hasSlots}
                onClick={() => { if (selectable) { setSelectedDate(ymd); setSelectedSlot(null); } }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: 16, padding: '10px 18px',
          borderTop: `1px solid ${T.border}`, background: '#FAFCFF',
        }}>
          {[
            { dot: '#22c55e', label: 'Available' },
            { dot: T.brand,   label: 'Selected'  },
            { dot: '#ef4444', label: 'Blocked'   },
            { dot: '#d1d5db', label: 'Unavailable'},
          ].map(({ dot, label }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: T.muted, fontWeight: 500 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavArrow({ onClick, direction }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: 9, border: 'none', cursor: 'pointer',
        background: hov ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)',
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s ease',
      }}
    >
      {direction === 'left'
        ? <ChevronLeft style={{ width: 16, height: 16 }} />
        : <ChevronRight style={{ width: 16, height: 16 }} />}
    </button>
  );
}

function CalendarDay({ day, inMonth, selectable, isSelected, isToday, isBlocked, hasSlots, onClick }) {
  const [hov, setHov] = useState(false);

  let bg     = 'transparent';
  let color  = inMonth ? T.navy : '#D1D5DB';
  let border = 'transparent';
  let shadow = 'none';

  if (isSelected) {
    bg     = 'linear-gradient(135deg,#0040A8,#0059F5)';
    color  = '#fff';
    shadow = '0 4px 12px rgba(0,64,168,0.35)';
    border = 'transparent';
  } else if (isToday) {
    bg     = 'rgba(0,64,168,0.08)';
    color  = T.brand;
    border = `1.5px solid rgba(0,64,168,0.20)`;
  } else if (selectable && hov) {
    bg     = 'rgba(0,64,168,0.06)';
    color  = T.brand;
    border = `1.5px solid rgba(0,64,168,0.18)`;
  }

  return (
    <button
      onClick={onClick}
      disabled={!selectable}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', width: '100%', aspectRatio: '1',
        borderRadius: 9, border: border === 'transparent' ? '1.5px solid transparent' : border,
        cursor: selectable ? 'pointer' : 'default',
        background: bg, color,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: isSelected || isToday ? 800 : inMonth ? 500 : 400,
        boxShadow: shadow, transition: 'all .15s ease',
        opacity: !inMonth ? 0.4 : !selectable && !isBlocked ? 0.35 : 1,
      }}
    >
      {day}
      {/* Slot indicator dot */}
      {hasSlots && !isSelected && (
        <span style={{
          position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)',
          width: 4, height: 4, borderRadius: '50%', background: '#22c55e',
        }} />
      )}
      {/* Blocked dot */}
      {isBlocked && !isSelected && (
        <span style={{
          position: 'absolute', top: 3, right: 3,
          width: 4, height: 4, borderRadius: '50%', background: '#ef4444',
        }} />
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIME SLOTS
═══════════════════════════════════════════════════════════ */
function TimeSlots({ selectedDate, slots, loadingSlots, selectedSlot, setSelectedSlot, allPassedToday }) {
  const slotCount = slots.length;
  return (
    <div>
      <SectionTitle
        icon={Clock}
        badge={selectedDate && !loadingSlots ? `${slotCount} slot${slotCount !== 1 ? 's' : ''} available` : ''}
      >
        Select a Time
        {loadingSlots && <Loader2 className="anim-spin" style={{ width: 14, height: 14, marginLeft: 6, color: T.muted }} />}
      </SectionTitle>
 
      {/* No date selected */}
      {!selectedDate && (
        <div style={{
          textAlign: 'center', padding: '28px 16px', borderRadius: 14,
          background: 'linear-gradient(135deg,#F4F7FF,#EEF4FF)',
          border: `1px dashed ${T.border}`,
        }}>
          <Calendar style={{ width: 28, height: 28, color: T.muted, margin: '0 auto 8px', display: 'block' }} />
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Select a date first to see available times</p>
        </div>
      )}
 
      {/* Today selected but all slots have passed */}
      {selectedDate && !loadingSlots && allPassedToday && (
        <div style={{
          textAlign: 'center', padding: '28px 16px', borderRadius: 14,
          background: '#FFFBEB', border: '1px dashed rgba(245,158,11,0.30)',
        }}>
          <Clock style={{ width: 24, height: 24, color: '#f59e0b', margin: '0 auto 8px', display: 'block', opacity: 0.7 }} />
          <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 600 }}>No more slots today</p>
          <p style={{ fontSize: 11, color: '#b45309', margin: '4px 0 0' }}>
            All of today's slots have passed. Please select a future date.
          </p>
        </div>
      )}
 
      {/* Date selected, not today's-all-passed case, no slots */}
      {selectedDate && !loadingSlots && !allPassedToday && slots.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '28px 16px', borderRadius: 14,
          background: '#FFF7F7', border: '1px dashed rgba(239,68,68,0.20)',
        }}>
          <AlertCircle style={{ width: 24, height: 24, color: '#ef4444', margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
          <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontWeight: 500 }}>No slots available for this date</p>
          <p style={{ fontSize: 11, color: T.muted, margin: '4px 0 0' }}>Please try a different day</p>
        </div>
      )}
 
      {/* Slots grid */}
      {selectedDate && slots.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }} className="slots-grid">
          {slots.map(slot => (
            <SlotBtn key={slot.id} slot={slot} active={selectedSlot?.id === slot.id} onClick={() => setSelectedSlot(slot)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotBtn({ slot, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 6px', borderRadius: 11, cursor: 'pointer',
        fontSize: 12, fontWeight: 700, textAlign: 'center',
        border: `1.5px solid ${active ? T.brand : hov ? 'rgba(0,64,168,0.25)' : T.border}`,
        background: active
          ? 'linear-gradient(135deg,#0040A8,#0059F5)'
          : hov ? 'rgba(0,64,168,0.04)' : '#FAFCFF',
        color: active ? '#fff' : hov ? T.brand : T.text2,
        boxShadow: active ? '0 4px 12px rgba(0,64,168,0.28)' : 'none',
        transition: 'all .15s ease',
        transform: active ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {slot.label}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD
═══════════════════════════════════════════════════════════ */
function ServiceItem({ service, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
        border: `1.5px solid ${active ? T.brand : hov ? 'rgba(0,64,168,0.18)' : T.border}`,
        background: active
          ? 'linear-gradient(135deg,rgba(0,64,168,0.06),rgba(0,89,245,0.04))'
          : hov ? 'rgba(0,64,168,0.025)' : '#fff',
        boxShadow: active ? '0 4px 14px rgba(0,64,168,0.12)' : 'none',
        transition: 'all .18s ease',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: service.color ?? T.brand, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {service.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 15 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: T.brand }}>
              {service.price != null ? `Rs ${service.price.toFixed(2)}` : 'Free'}
            </span>
            {service.duration && (
              <span style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>
                · {service.duration} min
              </span>
            )}
          </div>
          {service.description && (
            <p style={{ fontSize: 11, color: T.muted, margin: '5px 0 0', paddingLeft: 15, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {service.description}
            </p>
          )}
        </div>
        {/* Radio */}
        <div style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border: `2px solid ${active ? T.brand : T.border}`,
          background: active ? T.brand : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s ease',
        }}>
          {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKING SUMMARY CARD
═══════════════════════════════════════════════════════════ */
function BookingSummary({ selectedService, selectedDate, selectedSlot }) {
  if (!selectedService && !selectedDate && !selectedSlot) return null;
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      background: 'linear-gradient(135deg,#0040A8,#0059F5)',
      boxShadow: '0 8px 24px rgba(0,64,168,0.25)',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'relative', padding: '18px 20px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 14px', position: 'relative' }}>
          Appointment Summary
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative' }}>
          {selectedService && (
            <SummaryRow label="Service" value={selectedService.name} />
          )}
          {selectedDate && (
            <SummaryRow label="Date" value={
              new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
            } />
          )}
          {selectedSlot && (
            <SummaryRow label="Time" value={selectedSlot.label} />
          )}
          {(selectedService?.price != null) && (
            <div style={{ marginTop: 6, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                {selectedService.price === 0 ? 'Free' : `$${selectedService.price.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFIRMATION SCREEN
═══════════════════════════════════════════════════════════ */
function ConfirmationScreen({ confirmation, email, selectedService, onRebook, currentMonth, fetchMonthAvailability }) {
  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>

        {/* Check icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
          background: 'linear-gradient(135deg,#059669,#10B981)',
          boxShadow: '0 8px 28px rgba(16,185,129,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle style={{ width: 42, height: 42, color: '#fff' }} />
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.navy, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
          Booking Confirmed!
        </h2>
        <p style={{ fontSize: 14, color: T.muted, margin: '0 0 28px', lineHeight: 1.6 }}>
          Your appointment has been received. We'll send a confirmation to <strong style={{ color: T.text2 }}>{email}</strong>.
        </p>

        <Card style={{ padding: '20px 24px', marginBottom: 20, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: T.muted }}>Reference</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: T.brand, fontSize: 14 }}>{confirmation.bookingRef}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Service', value: confirmation.service?.name ?? selectedService?.name },
              { label: 'Date',    value: fmtDate(confirmation.startTime, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) },
              { label: 'Time',    value: `${fmt(confirmation.startTime)} – ${fmt(confirmation.endTime)}` },
              { label: 'Client',  value: confirmation.clientName },
              ...(confirmation.service?.price != null ? [{ label: 'Price', value: `$${confirmation.service.price.toFixed(2)}`, highlight: true }] : []),
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: highlight ? '#059669' : T.navy, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <RebookBtn onClick={() => { onRebook(); fetchMonthAvailability(currentMonth); }} />
      </div>
    </div>
  );
}

function RebookBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer',
        fontSize: 14, fontWeight: 800, color: '#fff',
        background: hov
          ? 'linear-gradient(135deg,#072971,#0040A8)'
          : 'linear-gradient(135deg,#0040A8,#0059F5)',
        boxShadow: '0 6px 20px rgba(0,64,168,0.30)',
        transition: 'all .2s ease',
      }}>
      Book Another Appointment
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBMIT BUTTON
═══════════════════════════════════════════════════════════ */
function SubmitBtn({ submitting, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={submitting}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none',
        cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        background: hov && !submitting
          ? 'linear-gradient(135deg,#072971,#0040A8)'
          : 'linear-gradient(135deg,#0040A8,#0059F5)',
        boxShadow: submitting ? 'none' : '0 6px 22px rgba(0,64,168,0.32)',
        opacity: submitting ? 0.65 : 1,
        transition: 'all .2s ease',
        letterSpacing: '-0.01em',
      }}
    >
      {submitting
        ? <><Loader2 className="anim-spin" style={{ width: 18, height: 18 }} /> Booking…</>
        : <>Schedule My Appointment <ChevronRight style={{ width: 17, height: 17 }} /></>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function BookMeetingPage() {
  const [currentMonth,    setCurrentMonth]    = useState(new Date());
  const [selectedDate,    setSelectedDate]    = useState('');
  const [selectedSlot,    setSelectedSlot]    = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [services,        setServices]        = useState([]);
  const [slots,           setSlots]           = useState([]);
  const [availableDates,  setAvailableDates]  = useState([]);
  const [blockedDates,    setBlockedDates]    = useState([]);
  const [loadingDates,    setLoadingDates]    = useState(false);
  const [loadingSlots,    setLoadingSlots]    = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [submitted,       setSubmitted]       = useState(false);
  const [confirmation,    setConfirmation]    = useState(null);
  const [error,           setError]           = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });

  useEffect(() => {
    fetch('/api/public/services')
      .then(r => r.json())
      .then(j => { if (j.success) setServices(j.data); })
      .catch(() => {});
  }, []);

  const fetchMonthAvailability = useCallback(async (month) => {
    setLoadingDates(true);
    try {
      const res  = await fetch(`/api/public/availability?month=${toMonthKey(month)}`);
      const json = await res.json();
      if (json.success) {
        setAvailableDates(json.data.availableDates ?? []);
        setBlockedDates(json.data.blockedDates    ?? []);
      }
    } catch { /* silent */ }
    finally { setLoadingDates(false); }
  }, []);

  useEffect(() => { fetchMonthAvailability(currentMonth); }, [currentMonth, fetchMonthAvailability]);

  useEffect(() => {
    if (!selectedDate) { setSlots([]); return; }
    setLoadingSlots(true);
    setSelectedSlot(null);
    fetch(`/api/public/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(j => { if (j.success) setSlots(j.data.slots ?? []); })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  const handleSubmit = async () => {
    setError('');
    if (!selectedSlot)                                       return setError('Please select a time slot.');
    if (!selectedService)                                    return setError('Please select a service.');
    if (!form.firstName.trim() || !form.lastName.trim())     return setError('Please enter your full name.');
    if (!form.email.trim())                                  return setError('Please enter your email address.');
    if (!form.phone.trim())                                  return setError('Please enter your phone number.');

    setSubmitting(true);
    try {
      const res  = await fetch('/api/public/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id, serviceId: selectedService.id,
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          email: form.email.trim(), phone: form.phone.trim(),
          notes: form.notes.trim() || undefined,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message ?? 'Booking failed. Please try again.');
        if (res.status === 409) {
          const r2 = await fetch(`/api/public/slots?date=${selectedDate}`);
          const j2 = await r2.json();
          if (j2.success) setSlots(j2.data.slots ?? []);
          setSelectedSlot(null);
        }
        return;
      }
      setConfirmation(json.data);
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRebook = () => {
    setSubmitted(false); setConfirmation(null); setSelectedDate('');
    setSelectedSlot(null); setSelectedService(null);
    setForm({ firstName: '', lastName: '', email: '', phone: '', notes: '' });
  };

  if (submitted && confirmation) {
    return (
      <ConfirmationScreen
        confirmation={confirmation} email={form.email}
        selectedService={selectedService} onRebook={handleRebook}
        currentMonth={currentMonth} fetchMonthAvailability={fetchMonthAvailability}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg,#070D1F 0%,#0040A8 60%,#0059F5 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,89,245,0.18)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 52px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)',
            borderRadius: 99, padding: '6px 16px', marginBottom: 20,
          }}>
            <span className="anim-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.80)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              Accepting Appointments
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Akbar Tax Store
          </h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'rgba(255,255,255,0.65)', margin: '0 0 28px' }}>
            Schedule Your Professional Tax Consultation
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            {[
              { icon: Star,    text: '4.9 / 5 Rating'             },
              { icon: Shield,  text: 'Licensed Professionals'     },
              { icon: Zap,     text: 'Flexible Session Lengths'   },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>
                <Icon style={{ width: 15, height: 15 }} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 60px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '300px 1fr' }} className="booking-layout">

          {/* ── LEFT: Service picker ──────────────────────── */}
          <div>
            <Card style={{ padding: '22px 20px', position: 'sticky', top: 104, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
              <SectionTitle icon={Briefcase}>Choose a Service</SectionTitle>

              {services.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="anim-pulse" style={{ height: 70, borderRadius: 14, background: '#EEF4FF', animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {services.map(service => (
                    <ServiceItem
                      key={service.id} service={service}
                      active={selectedService?.id === service.id}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}
                </div>
              )}

              {/* Summary */}
              <div style={{ marginTop: 20 }}>
                <BookingSummary selectedService={selectedService} selectedDate={selectedDate} selectedSlot={selectedSlot} />
              </div>
            </Card>
          </div>

          {/* ── RIGHT: Calendar + Time + Form ─────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Calendar */}
            <Card style={{ padding: '24px' }}>
              <BookingCalendar
                currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                setSelectedSlot={setSelectedSlot}
                availableDates={availableDates}
                blockedDates={blockedDates}
                loadingDates={loadingDates}
              />
            </Card>

            {/* Time slots */}
            <Card style={{ padding: '24px' }}>
              <TimeSlots
                selectedDate={selectedDate} slots={slots}
                loadingSlots={loadingSlots}
                selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot}
              />
            </Card>

            {/* Client info */}
            <Card style={{ padding: '24px' }}>
              <SectionTitle icon={User}>Your Information</SectionTitle>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-grid">
                <FormInput
                  label="First Name" required
                  type="text" placeholder="Ahmad"
                  value={form.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                />
                <FormInput
                  label="Last Name" required
                  type="text" placeholder="Khan"
                  value={form.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                />
                <FormInput
                  label="Email Address" required icon={Mail}
                  type="email" placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
                <FormInput
                  label="Phone Number" required icon={Phone}
                  type="tel" placeholder="03001234567"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                />
              </div>

              {/* Notes */}
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text2, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  <MessageSquare style={{ width: 11, height: 11, display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Additional Notes <span style={{ fontWeight: 400, color: T.muted }}>(optional)</span>
                </label>
                <NotesArea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </Card>

            {/* Error */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)',
                borderRadius: 14, padding: '12px 16px',
                animation: 'fadeIn .2s ease',
              }}>
                <AlertCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <SubmitBtn submitting={submitting} onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesArea({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={3} value={value} onChange={onChange}
      placeholder="Tell us about your specific needs or questions…"
      onFocus={() => setFocused(true)}
      onBlur={()  => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '11px 14px',
        fontSize: 13, borderRadius: 12, resize: 'none', fontFamily: 'inherit',
        border: `1.5px solid ${focused ? T.brand : T.border}`,
        background: focused ? '#fff' : '#F8FBFF', color: T.navy, outline: 'none',
        boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.09)' : 'none',
        transition: 'all .18s ease',
      }}
    />
  );
}