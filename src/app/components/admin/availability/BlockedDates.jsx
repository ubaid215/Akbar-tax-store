// src/components/admin/availability/BlockedDates.jsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarX, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// ── Helper: format a Date to "YYYY-MM-DD" in LOCAL timezone ──
// Critical: using toISOString() would give UTC date which is wrong in UTC+5
function toLocalYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function BlockedDates({ overrides = [], onRefresh }) {
  const [date,     setDate]     = useState('');
  const [reason,   setReason]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [deleting, setDeleting] = useState(null);

  const handleBlock = async () => {
    if (!date) { toast.error('Please select a date'); return; }

    setLoading(true);
    try {
      // Send the date string exactly as typed from the <input type="date">
      // The API will parse it with parseLocalDate() → correct local calendar day
      const res  = await fetch('/api/availability/overrides', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ date, reason }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Date blocked successfully');
      setDate('');
      setReason('');
      onRefresh?.();
    } catch (err) {
      toast.error(err.message ?? 'Failed to block date');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (override) => {
    // ✅ Use local YMD from the stored date, not toISOString()
    // override.date comes back from Prisma as a Date object (UTC midnight in DB)
    // We need to send the correct LOCAL calendar date string
    const stored = new Date(override.date);

    // Prisma @db.Date stores as UTC midnight. To get the right calendar day:
    // Add the timezone offset so we recover the local date that was originally saved
    // e.g. stored = 2026-03-23T19:00:00Z (UTC) which is 2026-03-24 00:00:00 PKT
    // getUTCFullYear/Month/Date gives us the correct calendar date as stored
    const dateStr = [
      stored.getUTCFullYear(),
      String(stored.getUTCMonth() + 1).padStart(2, '0'),
      String(stored.getUTCDate()).padStart(2, '0'),
    ].join('-');

    setDeleting(override.id);
    try {
      const res  = await fetch(`/api/availability/overrides?date=${dateStr}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Date unblocked');
      onRefresh?.();
    } catch (err) {
      toast.error(err.message ?? 'Failed to unblock date');
    } finally {
      setDeleting(null);
    }
  };

  // Today's date as YYYY-MM-DD for the min attribute
  const todayStr = toLocalYMD(new Date());

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">Blocked Dates</h2>
        <p className="text-xs text-gray-400 mt-0.5">Block holidays or days off — no slots will be generated</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Add new block */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            min={todayStr}
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          <input
            type="text"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
          <button
            onClick={handleBlock}
            disabled={loading || !date}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Plus    className="w-3.5 h-3.5" />}
            Block Date
          </button>
        </div>

        {/* Existing blocked dates */}
        {overrides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <CalendarX className="w-7 h-7 mb-2 opacity-40" />
            <p className="text-sm font-medium">No blocked dates</p>
            <p className="text-xs mt-0.5">All scheduled days are open for booking</p>
          </div>
        ) : (
          <div className="space-y-2">
            {overrides.map(override => (
              <div
                key={override.id}
                className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <CalendarX className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {/* Display using UTC date parts to match what was stored */}
                      {(() => {
                        const d = new Date(override.date);
                        // Use UTC parts — this is the calendar date that was blocked
                        return new Date(
                          d.getUTCFullYear(),
                          d.getUTCMonth(),
                          d.getUTCDate()
                        ).toLocaleDateString('en-US', {
                          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                        });
                      })()}
                    </p>
                    {override.reason && (
                      <p className="text-xs text-gray-400 mt-0.5">{override.reason}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleUnblock(override)}
                  disabled={deleting === override.id}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  {deleting === override.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2  className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}