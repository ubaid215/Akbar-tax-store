"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar, Clock, User, Mail, Phone, MessageSquare,
  CheckCircle, Star, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Briefcase, Shield, Zap, Globe,
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
const PKT = 'Asia/Karachi';

const fmt = (isoStr, opts = {}) =>
  new Date(isoStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: PKT, ...opts });

const fmtDate = (isoStr, opts) =>
  new Date(isoStr).toLocaleDateString('en-US', { timeZone: PKT, ...opts });

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

// Format price in Rs
const fmtPrice = (price) => {
  if (price == null || price === 0) return 'Free';
  return `Rs ${Number(price).toLocaleString('en-PK')}`;
};

// Get visitor's IANA timezone name
const getVisitorTZ = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// Get short timezone abbreviation for display
const getTZLabel = (tz) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short', timeZone: tz })
      .formatToParts(new Date());
    return parts.find(p => p.type === 'timeZoneName')?.value ?? tz;
  } catch { return tz; }
};

// Format time in visitor's local timezone
const fmtLocal = (isoStr) => {
  return new Date(isoStr).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
    // No timeZone = browser's local timezone
  });
};

/* ═══════════════════════════════════════════════════════════
   SKELETON COMPONENTS — for loading states
═══════════════════════════════════════════════════════════ */
function SkeletonService() {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 14, border: `1px solid ${T.border}`, background: '#F8FBFF' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
        <div className="anim-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#D1E0FF', flexShrink: 0 }} />
        <div className="anim-pulse" style={{ height: 13, width: '60%', borderRadius: 6, background: '#D1E0FF' }} />
      </div>
      <div className="anim-pulse" style={{ height: 11, width: '35%', borderRadius: 6, background: '#E8EFFF', marginLeft: 16 }} />
    </div>
  );
}

function SkeletonSlot() {
  return (
    <div className="anim-pulse" style={{ height: 44, borderRadius: 11, background: '#E8EFFF' }} />
  );
}

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
   CALENDAR
═══════════════════════════════════════════════════════════ */
function BookingCalendar({
  currentMonth, setCurrentMonth,
  selectedDate, setSelectedDate, setSelectedSlot,
  availableDates, blockedDates, loadingDates,
}) {
  const calendarDays = useMemo(() => {
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
  }, [currentMonth]);

  const availSet  = useMemo(() => new Set(availableDates.map(d => d.date)), [availableDates]);
  const blockedSet = useMemo(() => new Set(blockedDates), [blockedDates]);

  const isDateSelectable = (date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    const ymd = toYMD(date);
    if (blockedSet.has(ymd)) return false;
    return availSet.has(ymd);
  };

  const prevMonth = () => setCurrentMonth(m => { const n = new Date(m); n.setMonth(m.getMonth() - 1); return n; });
  const nextMonth = () => setCurrentMonth(m => { const n = new Date(m); n.setMonth(m.getMonth() + 1); return n; });

  return (
    <div>
      <SectionTitle icon={Calendar} badge={loadingDates ? 'Loading…' : ''}>
        Select a Date
      </SectionTitle>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: '0 2px 16px rgba(0,64,168,0.06)' }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'linear-gradient(135deg,#0040A8,#0059F5)' }}>
          <NavArrow onClick={prevMonth} direction="left" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            {loadingDates && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Checking availability…</div>}
          </div>
          <NavArrow onClick={nextMonth} direction="right" />
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: 'rgba(0,64,168,0.04)', borderBottom: `1px solid ${T.border}` }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ padding: '8px 0', textAlign: 'center', fontSize: 10, fontWeight: 700, color: T.muted, letterSpacing: '0.06em' }}>{d}</div>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px 8px 10px', gap: 2, background: '#fff' }}>
          {calendarDays.map((date, i) => {
            const ymd        = toYMD(date);
            const inMonth    = date.getMonth() === currentMonth.getMonth();
            const selectable = isDateSelectable(date);
            const isSelected = selectedDate === ymd;
            const isToday    = ymd === toYMD(new Date());
            const isBlocked  = blockedSet.has(ymd);
            return (
              <CalendarDay
                key={i} day={date.getDate()} inMonth={inMonth}
                selectable={selectable} isSelected={isSelected}
                isToday={isToday} isBlocked={isBlocked && inMonth}
                hasSlots={availSet.has(ymd) && selectable}
                onClick={() => { if (selectable) { setSelectedDate(ymd); setSelectedSlot(null); } }}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: '10px 18px', borderTop: `1px solid ${T.border}`, background: '#FAFCFF' }}>
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
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 32, height: 32, borderRadius: 9, border: 'none', cursor: 'pointer', background: hov ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.10)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s ease' }}>
      {direction === 'left' ? <ChevronLeft style={{ width: 16, height: 16 }} /> : <ChevronRight style={{ width: 16, height: 16 }} />}
    </button>
  );
}

function CalendarDay({ day, inMonth, selectable, isSelected, isToday, isBlocked, hasSlots, onClick }) {
  const [hov, setHov] = useState(false);
  let bg = 'transparent', color = inMonth ? T.navy : '#D1D5DB', border = 'transparent', shadow = 'none';
  if (isSelected) { bg = 'linear-gradient(135deg,#0040A8,#0059F5)'; color = '#fff'; shadow = '0 4px 12px rgba(0,64,168,0.35)'; }
  else if (isToday) { bg = 'rgba(0,64,168,0.08)'; color = T.brand; border = '1.5px solid rgba(0,64,168,0.20)'; }
  else if (selectable && hov) { bg = 'rgba(0,64,168,0.06)'; color = T.brand; border = '1.5px solid rgba(0,64,168,0.18)'; }
  return (
    <button onClick={onClick} disabled={!selectable} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 9, border: border === 'transparent' ? '1.5px solid transparent' : border, cursor: selectable ? 'pointer' : 'default', background: bg, color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: isSelected || isToday ? 800 : inMonth ? 500 : 400, boxShadow: shadow, transition: 'all .15s ease', opacity: !inMonth ? 0.4 : !selectable && !isBlocked ? 0.35 : 1 }}>
      {day}
      {hasSlots && !isSelected && <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#22c55e' }} />}
      {isBlocked && !isSelected && <span style={{ position: 'absolute', top: 3, right: 3, width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIME SLOTS — with dual timezone display
═══════════════════════════════════════════════════════════ */
function TimeSlots({ selectedDate, slots, loadingSlots, selectedSlot, setSelectedSlot, allPassedToday, visitorTZ, visitorTZLabel }) {
  const slotCount = slots.length;
  const isInPKT   = visitorTZ === PKT || visitorTZ === 'Asia/Karachi';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <SectionTitle icon={Clock} badge={selectedDate && !loadingSlots ? `${slotCount} slot${slotCount !== 1 ? 's' : ''} available` : ''}>
          Select a Time
          {loadingSlots && <Loader2 className="anim-spin" style={{ width: 14, height: 14, marginLeft: 6, color: T.muted }} />}
        </SectionTitle>

        {/* Timezone badge */}
        {selectedDate && !loadingSlots && slots.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#EEF4FF', border: '1px solid rgba(0,64,168,0.12)', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
            <Globe style={{ width: 11, height: 11, color: T.brand }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: T.brand }}>PKT</span>
            {!isInPKT && (
              <>
                <span style={{ fontSize: 10, color: T.muted }}>·</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: T.text2 }}>{visitorTZLabel}</span>
              </>
            )}
          </div>
        )}
      </div>

      {!selectedDate && (
        <div style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 14, background: 'linear-gradient(135deg,#F4F7FF,#EEF4FF)', border: `1px dashed ${T.border}` }}>
          <Calendar style={{ width: 28, height: 28, color: T.muted, margin: '0 auto 8px', display: 'block' }} />
          <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Select a date first to see available times</p>
        </div>
      )}

      {selectedDate && loadingSlots && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonSlot key={i} />)}
        </div>
      )}

      {selectedDate && !loadingSlots && allPassedToday && (
        <div style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 14, background: '#FFFBEB', border: '1px dashed rgba(245,158,11,0.30)' }}>
          <Clock style={{ width: 24, height: 24, color: '#f59e0b', margin: '0 auto 8px', display: 'block', opacity: 0.7 }} />
          <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 600 }}>No more slots today</p>
          <p style={{ fontSize: 11, color: '#b45309', margin: '4px 0 0' }}>All of today's slots have passed. Please select a future date.</p>
        </div>
      )}

      {selectedDate && !loadingSlots && !allPassedToday && slots.length === 0 && (
        <div style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 14, background: '#FFF7F7', border: '1px dashed rgba(239,68,68,0.20)' }}>
          <AlertCircle style={{ width: 24, height: 24, color: '#ef4444', margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
          <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontWeight: 500 }}>No slots available for this date</p>
          <p style={{ fontSize: 11, color: T.muted, margin: '4px 0 0' }}>Please try a different day</p>
        </div>
      )}

      {selectedDate && !loadingSlots && slots.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8 }} className="slots-grid">
          {slots.map(slot => (
            <SlotBtn
              key={slot.id} slot={slot}
              active={selectedSlot?.id === slot.id}
              onClick={() => setSelectedSlot(slot)}
              isInPKT={isInPKT}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SlotBtn({ slot, active, onClick, isInPKT }) {
  const [hov, setHov] = useState(false);
  const pktLabel   = slot.labelPKT ?? slot.label;
  const localLabel = fmtLocal(slot.startTime);
  const showBoth   = !isInPKT && localLabel !== pktLabel;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: showBoth ? '8px 6px' : '10px 6px',
        borderRadius: 11, cursor: 'pointer', textAlign: 'center',
        border: `1.5px solid ${active ? T.brand : hov ? 'rgba(0,64,168,0.25)' : T.border}`,
        background: active ? 'linear-gradient(135deg,#0040A8,#0059F5)' : hov ? 'rgba(0,64,168,0.04)' : '#FAFCFF',
        boxShadow: active ? '0 4px 12px rgba(0,64,168,0.28)' : 'none',
        transition: 'all .15s ease',
        transform: active ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* PKT time — business time, always shown */}
      <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2, color: active ? '#fff' : hov ? T.brand : T.text2 }}>
        {pktLabel}
      </div>

      {/* Visitor's local time — only when different */}
      {showBoth && (
        <>
          <div style={{ fontSize: 10, fontWeight: 500, marginTop: 2, lineHeight: 1.2, color: active ? 'rgba(255,255,255,0.72)' : T.muted }}>
            {localLabel} local
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, marginTop: 1, letterSpacing: '0.06em', color: active ? 'rgba(255,255,255,0.45)' : '#C8D9E8' }}>
            PKT
          </div>
        </>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD — with no-services disabled state
═══════════════════════════════════════════════════════════ */
function ServiceItem({ service, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '12px 14px', borderRadius: 14, cursor: 'pointer', flexShrink: 0,
        border: `1.5px solid ${active ? T.brand : hov ? 'rgba(0,64,168,0.18)' : T.border}`,
        background: active ? 'linear-gradient(135deg,rgba(0,64,168,0.06),rgba(0,89,245,0.04))' : hov ? 'rgba(0,64,168,0.025)' : '#fff',
        boxShadow: active ? '0 4px 14px rgba(0,64,168,0.12)' : 'none',
        transition: 'all .18s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: service.color ?? T.brand, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {service.name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: T.brand }}>
              {fmtPrice(service.price)}
            </span>
            {service.duration && (
              <span style={{ fontSize: 10, color: T.muted, fontWeight: 500 }}>· {service.duration} min</span>
            )}
          </div>
          {service.description && (
            <p style={{ fontSize: 10, color: T.muted, margin: '4px 0 0', paddingLeft: 14, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {service.description}
            </p>
          )}
        </div>
        <div style={{ width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 2, border: `2px solid ${active ? T.brand : T.border}`, background: active ? T.brand : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s ease' }}>
          {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff' }} />}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKING SUMMARY
═══════════════════════════════════════════════════════════ */
function BookingSummary({ selectedService, selectedDate, selectedSlot, visitorTZLabel, isInPKT }) {
  if (!selectedService && !selectedDate && !selectedSlot) return null;
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg,#0040A8,#0059F5)', boxShadow: '0 8px 24px rgba(0,64,168,0.25)', marginTop: 16 }}>
      <div style={{ position: 'relative', padding: '16px 18px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 12px', position: 'relative' }}>
          Appointment Summary
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
          {selectedService && <SummaryRow label="Service" value={selectedService.name} />}
          {selectedDate && (
            <SummaryRow label="Date" value={
              new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
            } />
          )}
          {selectedSlot && (
            <SummaryRow
              label="Time"
              value={`${selectedSlot.labelPKT ?? selectedSlot.label} PKT${!isInPKT ? ` · ${fmtLocal(selectedSlot.startTime)} ${visitorTZLabel}` : ''}`}
            />
          )}
          {selectedService?.price != null && (
            <div style={{ marginTop: 4, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.14)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.70)' }}>Total</span>
              <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                {fmtPrice(selectedService.price)}
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
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONFIRMATION SCREEN
═══════════════════════════════════════════════════════════ */
function ConfirmationScreen({ confirmation, email, selectedService, onRebook, currentMonth, fetchMonthAvailability }) {
  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', background: 'linear-gradient(135deg,#059669,#10B981)', boxShadow: '0 8px 28px rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle style={{ width: 42, height: 42, color: '#fff' }} />
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: T.navy, margin: '0 0 8px', letterSpacing: '-0.03em' }}>Booking Confirmed!</h2>
        <p style={{ fontSize: 14, color: T.muted, margin: '0 0 28px', lineHeight: 1.6 }}>
          Appointment received. Confirmation going to <strong style={{ color: T.text2 }}>{email}</strong>.
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
              { label: 'Time (PKT)', value: `${fmt(confirmation.startTime)} – ${fmt(confirmation.endTime)}` },
              { label: 'Client',  value: confirmation.clientName },
              ...(confirmation.service?.price != null ? [{ label: 'Price', value: fmtPrice(confirmation.service.price), highlight: true }] : []),
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
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800, color: '#fff', background: hov ? 'linear-gradient(135deg,#072971,#0040A8)' : 'linear-gradient(135deg,#0040A8,#0059F5)', boxShadow: '0 6px 20px rgba(0,64,168,0.30)', transition: 'all .2s ease' }}>
      Book Another Appointment
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUBMIT BUTTON
═══════════════════════════════════════════════════════════ */
function SubmitBtn({ submitting, disabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={submitting || disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none',
        cursor: submitting || disabled ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 800,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        background: disabled ? '#A0BBCF' : hov && !submitting ? 'linear-gradient(135deg,#072971,#0040A8)' : 'linear-gradient(135deg,#0040A8,#0059F5)',
        boxShadow: submitting || disabled ? 'none' : '0 6px 22px rgba(0,64,168,0.32)',
        opacity: submitting ? 0.65 : 1,
        transition: 'all .2s ease',
      }}>
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
  const [servicesLoading, setServicesLoading] = useState(true);
  const [slots,           setSlots]           = useState([]);
  const [availableDates,  setAvailableDates]  = useState([]);
  const [blockedDates,    setBlockedDates]    = useState([]);
  const [loadingDates,    setLoadingDates]    = useState(false);
  const [loadingSlots,    setLoadingSlots]    = useState(false);
  const [allPassedToday,  setAllPassedToday]  = useState(false);
  const [submitting,      setSubmitting]      = useState(false);
  const [submitted,       setSubmitted]       = useState(false);
  const [confirmation,    setConfirmation]    = useState(null);
  const [error,           setError]           = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', notes: '' });

  // Visitor timezone — computed once on mount
  const visitorTZ    = useMemo(() => getVisitorTZ(), []);
  const visitorTZLabel = useMemo(() => getTZLabel(visitorTZ), [visitorTZ]);
  const isInPKT      = visitorTZ === PKT || visitorTZ === 'Asia/Karachi';

  const noServices = !servicesLoading && services.length === 0;

  // ── Load services ────────────────────────────────────────
  useEffect(() => {
    setServicesLoading(true);
    fetch('/api/public/services')
      .then(r => r.json())
      .then(j => { if (j.success) setServices(j.data); })
      .catch(() => {})
      .finally(() => setServicesLoading(false));
  }, []);

  // ── Load month availability ───────────────────────────────
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

  // ── Load slots ────────────────────────────────────────────
  useEffect(() => {
    if (!selectedDate) { setSlots([]); setAllPassedToday(false); return; }
    setLoadingSlots(true);
    setSelectedSlot(null);
    setAllPassedToday(false);
    fetch(`/api/public/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          setSlots(j.data.slots ?? []);
          setAllPassedToday(j.data.allPassedToday ?? false);
        }
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError('');
    if (!selectedSlot)                                   return setError('Please select a time slot.');
    if (!selectedService)                                return setError('Please select a service.');
    if (!form.firstName.trim() || !form.lastName.trim()) return setError('Please enter your full name.');
    if (!form.email.trim())                              return setError('Please enter your email address.');
    if (!form.phone.trim())                              return setError('Please enter your phone number.');

    setSubmitting(true);
    try {
      const res  = await fetch('/api/public/book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotId: selectedSlot.id, serviceId: selectedService.id,
          firstName: form.firstName.trim(), lastName: form.lastName.trim(),
          email: form.email.trim(), phone: form.phone.trim(),
          notes: form.notes.trim() || undefined,
          timezone: visitorTZ,
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.message ?? 'Booking failed. Please try again.');
        if (res.status === 409) {
          const r2 = await fetch(`/api/public/slots?date=${selectedDate}`);
          const j2 = await r2.json();
          if (j2.success) { setSlots(j2.data.slots ?? []); setAllPassedToday(j2.data.allPassedToday ?? false); }
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

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#070D1F 0%,#0040A8 60%,#0059F5 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(0,89,245,0.18)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: 1080, margin: '0 auto', padding: '48px 24px 52px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 99, padding: '6px 16px', marginBottom: 20 }}>
            <span className="anim-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.80)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>Accepting Appointments</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Akbar Tax Store</h1>
          <p style={{ fontSize: 'clamp(14px,2vw,18px)', color: 'rgba(255,255,255,0.65)', margin: '0 0 28px' }}>Schedule Your Professional Tax Consultation</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            {[
              { icon: Star,   text: '4.9 / 5 Rating'           },
              { icon: Shield, text: 'Licensed Professionals'   },
              { icon: Zap,    text: 'Flexible Session Lengths' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>
                <Icon style={{ width: 15, height: 15 }} />{text}
              </div>
            ))}
          </div>

          {/* Visitor timezone banner */}
          {!isInPKT && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, padding: '6px 14px', marginTop: 16 }}>
              <Globe style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                Times shown in <strong style={{ color: '#fff' }}>PKT</strong>
                {' '}with your local time <strong style={{ color: '#fff' }}>({visitorTZLabel})</strong> shown below each slot
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px 20px 60px' }}>
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '300px 1fr' }} className="booking-layout">

          {/* ── LEFT: Services ──────────────────────────────── */}
          <div>
            <Card style={{ padding: '22px 20px', position: 'sticky', top: 104 }}>
              <SectionTitle icon={Briefcase}>Choose a Service</SectionTitle>

              {/* No services — disabled state */}
              {noServices && (
                <div style={{ textAlign: 'center', padding: '28px 12px', borderRadius: 14, background: '#F8FBFF', border: `1px dashed ${T.border}` }}>
                  <Briefcase style={{ width: 28, height: 28, color: T.muted, margin: '0 auto 10px', display: 'block', opacity: 0.4 }} />
                  <p style={{ fontSize: 13, color: T.muted, margin: 0, fontWeight: 600 }}>No services available</p>
                  <p style={{ fontSize: 11, color: T.muted, margin: '4px 0 0', opacity: 0.7 }}>Please check back soon</p>
                </div>
              )}

              {/* Loading skeletons */}
              {servicesLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Array.from({ length: 4 }).map((_, i) => <SkeletonService key={i} />)}
                </div>
              )}

              {/* ── Scrollable service list ───────────────────
                  Max 4 visible (~280px), scrolls cleanly after that
                  Fade gradient at bottom hints there's more to scroll
              ── */}
              {!servicesLoading && services.length > 0 && (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 8,
                    maxHeight: services.length > 4 ? 284 : 'none',
                    overflowY: services.length > 4 ? 'auto' : 'visible',
                    paddingRight: services.length > 4 ? 4 : 0,
                    // Custom scrollbar styling
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${T.border} transparent`,
                  }}>
                    {services.map(service => (
                      <ServiceItem
                        key={service.id} service={service}
                        active={selectedService?.id === service.id}
                        onClick={() => setSelectedService(service)}
                      />
                    ))}
                  </div>

                  {/* Fade hint when scrollable */}
                  {services.length > 4 && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 4,
                      height: 40, pointerEvents: 'none',
                      background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))',
                      borderRadius: '0 0 10px 10px',
                    }} />
                  )}

                  {services.length > 4 && (
                    <p style={{ fontSize: 10, color: T.muted, textAlign: 'center', marginTop: 6, fontWeight: 500 }}>
                      Scroll to see all {services.length} services
                    </p>
                  )}
                </div>
              )}

              {/* Summary */}
              <BookingSummary
                selectedService={selectedService}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                visitorTZLabel={visitorTZLabel}
                isInPKT={isInPKT}
              />
            </Card>
          </div>

          {/* ── RIGHT: Calendar + Slots + Form ──────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <Card style={{ padding: '24px', opacity: noServices ? 0.5 : 1, pointerEvents: noServices ? 'none' : 'auto' }}>
              <BookingCalendar
                currentMonth={currentMonth} setCurrentMonth={setCurrentMonth}
                selectedDate={selectedDate} setSelectedDate={setSelectedDate}
                setSelectedSlot={setSelectedSlot}
                availableDates={availableDates} blockedDates={blockedDates}
                loadingDates={loadingDates}
              />
            </Card>

            <Card style={{ padding: '24px', opacity: noServices ? 0.5 : 1, pointerEvents: noServices ? 'none' : 'auto' }}>
              <TimeSlots
                selectedDate={selectedDate} slots={slots}
                loadingSlots={loadingSlots} selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot} allPassedToday={allPassedToday}
                visitorTZ={visitorTZ} visitorTZLabel={visitorTZLabel}
              />
            </Card>

            <Card style={{ padding: '24px', opacity: noServices ? 0.5 : 1, pointerEvents: noServices ? 'none' : 'auto' }}>
              <SectionTitle icon={User}>Your Information</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="form-grid">
                <FormInput label="First Name" required type="text" placeholder="Ahmad" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                <FormInput label="Last Name"  required type="text" placeholder="Khan"  value={form.lastName}  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                <FormInput label="Email Address" required icon={Mail}  type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                <FormInput label="Phone Number"  required icon={Phone} type="tel"   placeholder="03001234567"    value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div style={{ marginTop: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: T.text2, letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  <MessageSquare style={{ width: 11, height: 11, display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                  Additional Notes <span style={{ fontWeight: 400, color: T.muted }}>(optional)</span>
                </label>
                <NotesArea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
            </Card>

            {error && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 14, padding: '12px 16px' }}>
                <AlertCircle style={{ width: 16, height: 16, color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, color: '#ef4444', margin: 0, fontWeight: 500 }}>{error}</p>
              </div>
            )}

            <SubmitBtn submitting={submitting} disabled={noServices} onClick={handleSubmit} />

            {noServices && (
              <p style={{ textAlign: 'center', fontSize: 12, color: T.muted, margin: '-12px 0 0' }}>
                Bookings are currently unavailable. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesArea({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea rows={3} value={value} onChange={onChange}
      placeholder="Tell us about your specific needs or questions…"
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: '100%', boxSizing: 'border-box', padding: '11px 14px', fontSize: 13, borderRadius: 12, resize: 'none', fontFamily: 'inherit', border: `1.5px solid ${focused ? T.brand : T.border}`, background: focused ? '#fff' : '#F8FBFF', color: T.navy, outline: 'none', boxShadow: focused ? '0 0 0 3px rgba(0,64,168,0.09)' : 'none', transition: 'all .18s ease' }}
    />
  );
}