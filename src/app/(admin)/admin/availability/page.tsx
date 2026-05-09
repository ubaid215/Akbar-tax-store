'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, X, CalendarOff, Clock, Calendar, Lock } from 'lucide-react'
import { toast } from 'sonner'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface TimeSlot { id?: string; startTime: string; endTime: string }
interface DayAvailability { dayOfWeek: number; isOpen: boolean; slots: TimeSlot[] }
interface AdminBlock {
  id: string; date: string; startTime: string; endTime: string
  label?: string; addToCalendar: boolean; calendarEventId?: string
}

const BLOCK_LABELS = ['Personal Meeting', 'Lunch Break', 'Holiday', 'Training', 'Family Time', 'Out of Office', 'Other']

/** Reusable toggle switch rendered entirely with Tailwind */
function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 flex-shrink-0 ${
        on ? 'bg-[#0040A8]' : 'bg-gray-200'
      }`}
    >
      <div
        className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-200 ${
          on ? 'left-[23px]' : 'left-[3px]'
        }`}
      />
    </div>
  )
}

export default function AvailabilityPage() {
  const [tab, setTab] = useState<'weekly' | 'blocks' | 'blocked'>('weekly')
  const [availability, setAvailability] = useState<DayAvailability[]>(
    DAYS.map((_, i) => ({ dayOfWeek: i, isOpen: i >= 1 && i <= 5, slots: [{ startTime: '09:00', endTime: '17:00' }] }))
  )
  const [blockedDates, setBlockedDates] = useState<{ id: string; date: string; reason?: string }[]>([])
  const [adminBlocks, setAdminBlocks] = useState<AdminBlock[]>([])
  const [saving, setSaving] = useState(false)
  const [bufferTime, setBufferTime] = useState(0)
  const [slotDuration, setSlotDuration] = useState(60)

  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '12:00',
    label: 'Personal Meeting',
    customLabel: '',
    addToCalendar: true,
  })
  const [blockSaving, setBlockSaving] = useState(false)
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')

  useEffect(() => {
    fetch('/api/admin/availability').then(r => r.json()).then(data => {
      if (data.availability?.length) setAvailability(data.availability)
      if (data.blockedDates) setBlockedDates(data.blockedDates)
      if (data.settings) { setBufferTime(data.settings.bufferTime || 0); setSlotDuration(data.settings.slotDuration || 60) }
    })
    fetch('/api/admin/blocks').then(r => r.json()).then(setAdminBlocks)
  }, [])

  const toggleDay = (i: number) => setAvailability(p => p.map((d, j) => j === i ? { ...d, isOpen: !d.isOpen } : d))
  const addSlot = (i: number) => setAvailability(p => p.map((d, j) => j === i ? { ...d, slots: [...d.slots, { startTime: '09:00', endTime: '17:00' }] } : d))
  const removeSlot = (i: number, si: number) => setAvailability(p => p.map((d, j) => j === i ? { ...d, slots: d.slots.filter((_, k) => k !== si) } : d))
  const updateSlot = (i: number, si: number, field: string, value: string) =>
    setAvailability(p => p.map((d, j) => j === i ? { ...d, slots: d.slots.map((s, k) => k === si ? { ...s, [field]: value } : s) } : d))

  const saveAvailability = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/availability', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ availability, bufferTime, slotDuration }) })
      toast.success('Availability saved!')
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const addAdminBlock = async () => {
    if (!blockForm.date || !blockForm.startTime || !blockForm.endTime) { toast.error('Fill in all fields'); return }
    if (blockForm.startTime >= blockForm.endTime) { toast.error('End time must be after start time'); return }
    setBlockSaving(true)
    try {
      const label = blockForm.label === 'Other' ? blockForm.customLabel : blockForm.label
      const res = await fetch('/api/admin/blocks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: blockForm.date, startTime: blockForm.startTime, endTime: blockForm.endTime, label, addToCalendar: blockForm.addToCalendar }),
      })
      const data = await res.json()
      setAdminBlocks(p => [...p, data])
      toast.success(blockForm.addToCalendar ? 'Block added & synced to Google Calendar!' : 'Block added!')
    } catch { toast.error('Failed to add block') } finally { setBlockSaving(false) }
  }

  const removeAdminBlock = async (id: string) => {
    await fetch(`/api/admin/blocks/${id}`, { method: 'DELETE' })
    setAdminBlocks(p => p.filter(b => b.id !== id))
    toast.success('Block removed')
  }

  const addBlockedDate = async () => {
    if (!newBlockDate) return
    const res = await fetch('/api/admin/availability/blocked', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date: newBlockDate, reason: newBlockReason }) })
    const data = await res.json()
    setBlockedDates(p => [...p, data])
    setNewBlockDate(''); setNewBlockReason('')
    toast.success('Date blocked')
  }

  const removeBlockedDate = async (id: string) => {
    await fetch(`/api/admin/availability/blocked/${id}`, { method: 'DELETE' })
    setBlockedDates(p => p.filter(d => d.id !== id))
    toast.success('Date unblocked')
  }

  const groupedBlocks = adminBlocks.reduce((acc, b) => {
    if (!acc[b.date]) acc[b.date] = []
    acc[b.date].push(b)
    return acc
  }, {} as Record<string, AdminBlock[]>)

  const inputCls = 'px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none bg-white focus:border-[#0040A8] transition-colors'

  const tabs = [
    { key: 'weekly',  label: '📅 Weekly Hours' },
    { key: 'blocks',  label: '🔒 My Blocks' },
    { key: 'blocked', label: '🚫 Block Days' },
  ]

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#e8e8e0] mb-6 w-full sm:w-fit overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-5 py-2 border-none rounded-[10px] text-[13px] font-semibold cursor-pointer font-[inherit] transition-all duration-200 ${
              tab === t.key ? 'bg-[#0040A8] text-white' : 'bg-transparent text-[#6b7280] hover:text-[#1a1a2e]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── WEEKLY HOURS ── */}
      {tab === 'weekly' && (
        <>
          <div className="bg-white rounded-2xl border border-[#e8e8e0] p-4 sm:p-6 mb-5">
            <h3 className="m-0 mb-5 text-base font-bold text-[#1a1a2e]">Slot Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">Slot Duration</label>
                <select
                  value={slotDuration}
                  onChange={e => setSlotDuration(Number(e.target.value))}
                  className={`${inputCls} w-full`}
                >
                  {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#374151] mb-[6px]">Buffer Between Bookings</label>
                <select
                  value={bufferTime}
                  onChange={e => setBufferTime(Number(e.target.value))}
                  className={`${inputCls} w-full`}
                >
                  {[0, 5, 10, 15, 30, 60].map(d => <option key={d} value={d}>{d === 0 ? 'No buffer' : `${d} min`}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e8e8e0] flex items-center justify-between">
              <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Weekly Schedule</h3>
              <button
                onClick={saveAvailability}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-[9px] bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] disabled:opacity-60 transition-colors"
              >
                <Save size={15} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>

            <div className="p-4 sm:p-6 grid gap-3">
              {availability.map((day, di) => (
                <div key={day.dayOfWeek} className="border border-[#e8e8e0] rounded-xl p-4">
                  <div className={`flex items-center gap-3 ${day.isOpen ? 'mb-[14px]' : ''}`}>
                    <Toggle on={day.isOpen} onClick={() => toggleDay(di)} />
                    <span className={`font-semibold text-[15px] flex-1 ${day.isOpen ? 'text-[#1a1a2e]' : 'text-[#9ca3af]'}`}>
                      {DAYS[day.dayOfWeek]}
                    </span>
                    {!day.isOpen && (
                      <span className="text-xs text-[#9ca3af] bg-gray-100 px-[10px] py-[3px] rounded-full">Closed</span>
                    )}
                  </div>
                  {day.isOpen && (
                    <div className="grid gap-2 pl-0 sm:pl-14">
                      {day.slots.map((slot, si) => (
                        <div key={si} className="flex flex-wrap items-center gap-[10px]">
                          <input type="time" value={slot.startTime} onChange={e => updateSlot(di, si, 'startTime', e.target.value)} className={inputCls} />
                          <span className="text-[#9ca3af] text-[13px]">to</span>
                          <input type="time" value={slot.endTime} onChange={e => updateSlot(di, si, 'endTime', e.target.value)} className={inputCls} />
                          <button onClick={() => removeSlot(di, si)} className="bg-transparent border-none cursor-pointer text-red-500 p-1 hover:bg-[#fce4ec] rounded transition-colors">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addSlot(di)}
                        className="flex items-center gap-[6px] bg-transparent border border-dashed border-[#d1d5db] rounded-lg px-3 py-[6px] text-[13px] text-[#0040A8] cursor-pointer w-fit hover:bg-[#e8f0fe] transition-colors"
                      >
                        <Plus size={14} /> Add time window
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── ADMIN BLOCKS ── */}
      {tab === 'blocks' && (
        <div className="grid gap-5">
          <div className="bg-white rounded-2xl border border-[#e8e8e0] p-4 sm:p-7">
            <h3 className="m-0 mb-[6px] text-base font-bold text-[#1a1a2e]">Block Personal Time</h3>
            <p className="m-0 mb-6 text-[13px] text-[#6b7280]">
              These slots show as <strong className="text-red-500">Booked</strong> to clients on the booking page.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px] mb-[14px]">
              {[
                { label: 'Date',  type: 'date', value: blockForm.date,      onChange: (v: string) => setBlockForm(f => ({ ...f, date: v })) },
                { label: 'From',  type: 'time', value: blockForm.startTime, onChange: (v: string) => setBlockForm(f => ({ ...f, startTime: v })) },
                { label: 'To',    type: 'time', value: blockForm.endTime,   onChange: (v: string) => setBlockForm(f => ({ ...f, endTime: v })) },
              ].map(({ label, type, value, onChange }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-[#374151] mb-[6px] uppercase tracking-[0.04em]">{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`${inputCls} w-full box-border`}
                  />
                </div>
              ))}
            </div>

            <div className="mb-[14px]">
              <label className="block text-xs font-semibold text-[#374151] mb-[6px] uppercase tracking-[0.04em]">Label</label>
              <div className="flex gap-2 flex-wrap">
                {BLOCK_LABELS.map(l => (
                  <button
                    key={l}
                    onClick={() => setBlockForm(f => ({ ...f, label: l }))}
                    className={`px-[14px] py-[6px] rounded-full border text-[13px] font-medium cursor-pointer transition-colors ${
                      blockForm.label === l
                        ? 'bg-[#0040A8] text-white border-[#0040A8]'
                        : 'bg-transparent text-[#6b7280] border-[#e8e8e0] hover:border-[#0040A8] hover:text-[#0040A8]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {blockForm.label === 'Other' && (
                <input
                  value={blockForm.customLabel}
                  onChange={e => setBlockForm(f => ({ ...f, customLabel: e.target.value }))}
                  placeholder="Enter label..."
                  className={`${inputCls} w-full mt-[10px] box-border`}
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <label className="flex items-center gap-[10px] cursor-pointer">
                <Toggle
                  on={blockForm.addToCalendar}
                  onClick={() => setBlockForm(f => ({ ...f, addToCalendar: !f.addToCalendar }))}
                />
                <div>
                  <span className="text-sm font-semibold text-[#374151]">Add to Google Calendar</span>
                  <p className="m-0 text-xs text-[#9ca3af]">Creates an event on your calendar</p>
                </div>
              </label>
              <button
                onClick={addAdminBlock}
                disabled={blockSaving}
                className="flex items-center gap-2 px-6 py-[10px] bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] disabled:opacity-60 transition-colors"
              >
                <Lock size={15} /> {blockSaving ? 'Blocking…' : 'Block This Time'}
              </button>
            </div>
          </div>

          {/* Existing blocks */}
          <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden">
            <div className="px-6 py-5 border-b border-[#e8e8e0]">
              <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Active Blocks</h3>
            </div>
            <div className="p-4 sm:p-6">
              {Object.keys(groupedBlocks).length === 0 ? (
                <div className="py-8 text-center text-[#9ca3af]">
                  <Lock size={28} className="mx-auto mb-2 block opacity-30" />
                  <p className="m-0 text-[13px]">No personal blocks added</p>
                </div>
              ) : (
                Object.entries(groupedBlocks).sort().map(([date, blocks]) => (
                  <div key={date} className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} className="text-[#0040A8]" />
                      <span className="text-[13px] font-bold text-[#1a1a2e]">
                        {new Date(date + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="grid gap-2 pl-0 sm:pl-[22px]">
                      {blocks.map(b => (
                        <div key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-[10px]">
                          <Lock size={14} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-[#1a1a2e]">{b.startTime} – {b.endTime}</span>
                          <span className="text-[13px] text-[#6b7280] flex-1">{b.label}</span>
                          {b.calendarEventId && (
                            <span className="text-[11px] bg-[#e8f0fe] text-[#0040A8] px-2 py-[2px] rounded-full font-semibold">📅 On Calendar</span>
                          )}
                          <button
                            onClick={() => removeAdminBlock(b.id)}
                            className="bg-transparent border-none cursor-pointer text-red-500 p-1 hover:bg-[#fce4ec] rounded transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BLOCK FULL DAYS ── */}
      {tab === 'blocked' && (
        <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#e8e8e0]">
            <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Block Full Days</h3>
            <p className="m-0 mt-1 text-[13px] text-[#6b7280]">Block entire days — no bookings possible</p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-[10px] mb-6">
              <input
                type="date"
                value={newBlockDate}
                onChange={e => setNewBlockDate(e.target.value)}
                className={inputCls}
              />
              <input
                value={newBlockReason}
                onChange={e => setNewBlockReason(e.target.value)}
                placeholder="Reason (optional)"
                className={`${inputCls} flex-1`}
              />
              <button
                onClick={addBlockedDate}
                className="px-5 py-[10px] bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
              >
                Block Day
              </button>
            </div>

            {blockedDates.length === 0 ? (
              <div className="py-8 text-center text-[#9ca3af]">
                <CalendarOff size={28} className="mx-auto mb-2 block opacity-30" />
                <p className="m-0 text-[13px]">No blocked dates</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {blockedDates.map(d => (
                  <div key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#fef2f2] border border-[#fecaca] rounded-[10px]">
                    <CalendarOff size={15} className="text-red-500" />
                    <span className="font-semibold text-sm text-[#1a1a2e]">{d.date}</span>
                    {d.reason && <span className="text-[13px] text-[#6b7280] flex-1">— {d.reason}</span>}
                    <button
                      onClick={() => removeBlockedDate(d.id)}
                      className="bg-transparent border-none cursor-pointer text-red-500 hover:bg-[#fce4ec] rounded p-1 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
