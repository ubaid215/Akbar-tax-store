'use client'
import { useEffect, useState } from 'react'
import { Search, CheckCircle, XCircle, AlertCircle, Calendar, RefreshCw, ExternalLink } from 'lucide-react'
import { AdminBookingManageContent } from '@/app/components/admin/bookings/AdminBookingManageContent'

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED']

const statusStyles: Record<string, { bg: string; color: string; label: string; icon: any }> = {
  PENDING:   { bg: '#fff8e1', color: '#f59e0b', label: 'Pending',   icon: AlertCircle },
  CONFIRMED: { bg: '#e8f5e9', color: '#22c55e', label: 'Confirmed', icon: CheckCircle },
  REJECTED:  { bg: '#fce4ec', color: '#ef4444', label: 'Rejected',  icon: XCircle },
  CANCELLED: { bg: '#f3f4f6', color: '#9ca3af', label: 'Cancelled', icon: XCircle },
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [manageId, setManageId] = useState<string | null>(null)

  const fetchBookings = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter !== 'ALL') params.set('status', statusFilter)
    if (dateFilter) params.set('date', dateFilter)
    fetch(`/api/admin/bookings?${params}`)
      .then(r => r.json())
      .then(setBookings)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [statusFilter, dateFilter])

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 mb-5 border border-[#e8e8e0] flex gap-3 flex-wrap items-center">
        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchBookings()}
            placeholder="Search by name or email..."
            className="w-full py-[10px] pr-3 pl-9 border border-[#e8e8e0] rounded-[10px] text-sm outline-none font-[inherit] focus:border-[#0040A8] transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-[6px] w-full overflow-x-auto pb-1">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-[14px] py-2 rounded-lg border text-[13px] font-medium cursor-pointer transition-colors ${
                statusFilter === s
                  ? 'bg-[#0040A8] text-white border-[#0040A8]'
                  : 'bg-transparent text-[#6b7280] border-[#e8e8e0] hover:border-[#0040A8] hover:text-[#0040A8]'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Date filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="py-[10px] px-3 border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
        />

        <button
          onClick={fetchBookings}
          className="py-[10px] px-3 border border-[#e8e8e0] rounded-[10px] bg-transparent cursor-pointer flex items-center text-[#6b7280] hover:bg-[#f8f9ff] transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-[#9ca3af]">Loading bookings...</div>
        ) : !bookings.length ? (
          <div className="py-16 text-center text-[#9ca3af]">
            <Calendar size={40} className="mx-auto mb-3 block opacity-30" />
            <p className="m-0">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-[#f8f9ff]">
                {['Client', 'Date & Time', 'Service', 'Status', 'Reminder', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-5 py-[14px] text-left text-xs font-semibold text-[#6b7280] uppercase tracking-[0.05em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => {
                const s = statusStyles[b.status] || statusStyles.PENDING
                return (
                  <tr key={b.id} className="border-t border-[#f3f4f6] hover:bg-[#f8f9ff] transition-colors">
                    <td className="px-5 py-4">
                      <p className="m-0 font-semibold text-[#1a1a2e] text-sm">{b.clientName}</p>
                      <p className="m-0 text-xs text-[#9ca3af]">{b.clientEmail}</p>
                      {b.clientPhone && <p className="m-0 text-xs text-[#9ca3af]">{b.clientPhone}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <p className="m-0 text-sm font-semibold text-[#1a1a2e]">{b.date}</p>
                      <p className="m-0 text-[13px] text-[#6b7280]">{b.startTime} – {b.endTime}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#374151]">{b.service?.name || '—'}</td>
                    <td className="px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-xs font-semibold"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <s.icon size={12} /> {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium ${b.sendReminder ? 'text-green-500' : 'text-[#9ca3af]'}`}>
                        {b.sendReminder ? '✓ On' : '— Off'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setManageId(b.id)}
                          className="inline-flex items-center gap-1.5 px-[14px] py-[6px] bg-[#e8f0fe] text-[#0040A8] rounded-lg text-[13px] font-semibold border-none cursor-pointer hover:bg-[#0040A8] hover:text-white transition-colors"
                        >
                          Manage
                        </button>
                        <a
                          href={`/admin/bookings/${b.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#6b7280] no-underline hover:text-[#0040A8]"
                          title="Open in new tab"
                        >
                          <ExternalLink size={14} /> Tab
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {manageId && (
        <div className="fixed inset-0 z-[100] flex justify-end font-app-sans">
          <button
            type="button"
            className="absolute inset-0 bg-black/40 border-none cursor-pointer"
            aria-label="Close booking panel"
            onClick={() => setManageId(null)}
          />
          <div className="relative h-full w-full max-w-[880px] bg-[#f7f7f2] shadow-[-8px_0_40px_rgba(0,0,0,0.12)] flex flex-col">
            <AdminBookingManageContent
              bookingId={manageId}
              variant="drawer"
              onClose={() => setManageId(null)}
              onUpdated={fetchBookings}
            />
          </div>
        </div>
      )}
    </div>
  )
}
