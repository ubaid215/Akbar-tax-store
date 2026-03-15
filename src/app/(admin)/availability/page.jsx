// src/app/(admin)/availability/page.jsx
// Fixed: fetchAvailability wrapped in useCallback with empty deps []
// so BlockedDates onRefresh prop is stable and doesn't trigger re-renders

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Save, Loader2, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';
import DayAvailabilityRow from '@/app/components/admin/availability/DayAvailabilityRow';
import BlockedDates       from '@/app/components/admin/availability/BlockedDates';
import SlotPreview        from '@/app/components/admin/availability/SlotPreview';
// ✅ Correct paths — @/ maps to src/ via jsconfig.json

const DAYS_ORDER = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];

const DEFAULT_CONFIG = {
  isActive:     false,
  startTime:    '09:00',
  endTime:      '17:00',
  slotDuration: 60,
  bufferTime:   10,
  maxBookings:  1,
};

const WEEKDAY_DEFAULT = { ...DEFAULT_CONFIG, isActive: true  };
const WEEKEND_DEFAULT = { ...DEFAULT_CONFIG, isActive: false };

function buildDefaultDays() {
  return Object.fromEntries(
    DAYS_ORDER.map(day => [
      day,
      ['SATURDAY','SUNDAY'].includes(day) ? { ...WEEKEND_DEFAULT } : { ...WEEKDAY_DEFAULT },
    ])
  );
}

function mapAvailabilityToState(availabilities) {
  const base = buildDefaultDays();
  for (const a of availabilities) {
    base[a.dayOfWeek] = {
      isActive:     a.isActive,
      startTime:    a.startTime,
      endTime:      a.endTime,
      slotDuration: a.slotDuration,
      bufferTime:   a.bufferTime,
      maxBookings:  a.maxBookings,
    };
  }
  return base;
}

export default function AvailabilityPage() {
  const [days,      setDays]      = useState(buildDefaultDays);
  const [overrides, setOverrides] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [slotsInfo, setSlotsInfo] = useState(null);

  // ── CRITICAL: empty deps [] so this function reference is stable forever ──
  // Without this, passing fetchAvailability as onRefresh to BlockedDates
  // creates a new function ref on every render → triggers BlockedDates useEffect
  // → calls fetchAvailability → sets state → re-render → infinite loop
  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/availability');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      if (json.data.availabilities.length > 0) {
        setDays(mapAvailabilityToState(json.data.availabilities));
      }
      setOverrides(json.data.overrides ?? []);
    } catch {
      toast.error('Failed to load availability settings');
    } finally {
      setLoading(false);
    }
  }, []); // ← empty deps: function never recreated

  // Runs only once on mount
  useEffect(() => { fetchAvailability(); }, [fetchAvailability]);

  const handleDayChange = useCallback((dayName, config) => {
    setDays(prev => ({ ...prev, [dayName]: config }));
    setSaved(false);
  }, []);

  const applyMondayToWeekdays = useCallback(() => {
    setDays(prev => {
      const mon  = prev['MONDAY'];
      const next = { ...prev };
      ['TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'].forEach(d => { next[d] = { ...mon }; });
      return next;
    });
    toast.success('Monday settings applied to all weekdays');
  }, []);

  const handleSave = async () => {
    const activeDays = DAYS_ORDER.filter(d => days[d].isActive);
    if (activeDays.length === 0) { toast.error('Please enable at least one day'); return; }

    for (const dayName of activeDays) {
      const c = days[dayName];
      if (c.startTime >= c.endTime) {
        toast.error(`${dayName}: start time must be before end time`);
        return;
      }
    }

    setSaving(true);
    setSaved(false);
    try {
      const payload = DAYS_ORDER.map(dayOfWeek => ({ dayOfWeek, ...days[dayOfWeek] }));
      const res  = await fetch('/api/availability', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ days: payload }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setSaved(true);
      setLastSaved(new Date());
      setSlotsInfo(json.data.slotsGenerated);
      toast.success(json.message);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      toast.error(err.message ?? 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 max-w-3xl mx-auto">
        <div className="h-10 w-48 bg-gray-100 rounded-xl animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  const SaveBtn = ({ extraClass = '' }) => (
    <button
      onClick={handleSave}
      disabled={saving}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 ${extraClass} ${
        saved ? 'bg-emerald-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
      }`}
    >
      {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
              : saved  ? <><CheckCircle className="w-4 h-4" />Saved!</>
                       : <><Save className="w-4 h-4" />Save & Generate Slots</>}
    </button>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Availability</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1 ml-0.5">
            Set your weekly schedule — slots auto-generate for the next 60 days
          </p>
          {lastSaved && (
            <p className="text-xs text-gray-300 mt-1 ml-0.5">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={applyMondayToWeekdays}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Mon → Weekdays
          </button>
          <SaveBtn />
        </div>
      </div>

      {saved && slotsInfo !== null && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5">
          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">{slotsInfo} slots generated for the next 60 days</p>
            <p className="text-xs text-emerald-600 mt-0.5">This schedule is now permanent until you change it</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5">
        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="font-bold">This is your permanent schedule.</span> Slots are auto-generated
          for the next 60 days. Changing the schedule deletes all future unbooked slots and regenerates immediately.
        </p>
      </div>

      <SlotPreview days={days} />

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Weekly Schedule</h2>
        {DAYS_ORDER.map(day => (
          <DayAvailabilityRow
            key={day}
            day={day}
            config={days[day]}
            onChange={handleDayChange}
          />
        ))}
      </div>

      {/* BlockedDates receives stable fetchAvailability reference — no loop */}
      <BlockedDates overrides={overrides} onRefresh={fetchAvailability} />

      <div className="flex justify-end pt-2 pb-6">
        <SaveBtn extraClass="px-6 py-3" />
      </div>
    </div>
  );
}