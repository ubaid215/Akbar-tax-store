'use client'

import { useEffect, useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Bell,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Loader2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'

type Variant = 'page' | 'drawer'

export function AdminBookingManageContent({
  bookingId,
  variant,
  onClose,
  onNavigateBack,
  onUpdated,
}: {
  bookingId: string
  variant: Variant
  onClose?: () => void
  onNavigateBack?: () => void
  onUpdated?: () => void
}) {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectMessage, setRejectMessage] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(false)
  const [reminderMinutes, setReminderMinutes] = useState(60)
  const [isVirtual, setIsVirtual] = useState(false)
  const [meetLinkDraft, setMeetLinkDraft] = useState('')

  const reloadBooking = async () => {
    const data = await fetch(`/api/admin/bookings/${bookingId}`).then((r) => r.json())
    setBooking(data)
    setReminderEnabled(data.sendReminder)
    setReminderMinutes(data.reminderTime || 60)
    setIsVirtual(data.isVirtual ?? false)
    setMeetLinkDraft(data.meetLink || '')
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`/api/admin/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setBooking(data)
        setReminderEnabled(data.sendReminder)
        setReminderMinutes(data.reminderTime || 60)
        setIsVirtual(data.isVirtual ?? false)
        setMeetLinkDraft(data.meetLink || '')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [bookingId])

  const handleConfirm = async () => {
    setActionLoading('confirm')
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sendReminder: reminderEnabled,
          reminderMinutes,
          isVirtual,
          meetLink: isVirtual ? meetLinkDraft.trim() : undefined,
        }),
      })
      if (res.ok) {
        toast.success('Booking confirmed! Calendar event created & email sent.')
        await reloadBooking()
        onUpdated?.()
      } else {
        toast.error('Failed to confirm booking')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    setActionLoading('reject')
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customMessage: rejectMessage }),
      })
      if (res.ok) {
        toast.success('Booking rejected. Sorry email sent to client.')
        setShowRejectModal(false)
        await reloadBooking()
        onUpdated?.()
      } else {
        toast.error('Failed to reject booking')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleReminderUpdate = async () => {
    await fetch(`/api/admin/bookings/${bookingId}/reminder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sendReminder: reminderEnabled, reminderMinutes }),
    })
    toast.success('Reminder settings updated')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-[#9ca3af]">
        <Loader2 size={24} className="animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return <div className="text-[#6b7280] p-6">Booking not found</div>
  }

  const isPending = booking.status === 'PENDING'
  const isConfirmed = booking.status === 'CONFIRMED'

  const statusBg =
    booking.status === 'CONFIRMED' ? '#e8f5e9' : booking.status === 'REJECTED' ? '#fce4ec' : '#fff8e1'
  const statusColor =
    booking.status === 'CONFIRMED' ? '#22c55e' : booking.status === 'REJECTED' ? '#ef4444' : '#f59e0b'

  const inner = (
    <>
      {variant === 'page' && onNavigateBack && (
        <button
          type="button"
          onClick={onNavigateBack}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-[#6b7280] text-sm mb-6 p-0 hover:text-[#1a1a2e] transition-colors"
        >
          <ArrowLeft size={16} /> Back to bookings
        </button>
      )}

      <div className="grid gap-5 max-lg:grid-cols-1 lg:[grid-template-columns:1fr_320px]">
        <div>
          <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden mb-5">
            <div className="px-6 py-5 border-b border-[#e8e8e0] flex items-center justify-between">
              <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Booking Details</h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: statusBg, color: statusColor }}
              >
                {booking.status}
              </span>
            </div>

            <div className="p-6 grid gap-4">
              {[
                { icon: User, label: 'Client Name', value: booking.clientName },
                { icon: Mail, label: 'Email', value: booking.clientEmail },
                { icon: Phone, label: 'Phone', value: booking.clientPhone || '—' },
                { icon: Calendar, label: 'Date', value: booking.date },
                { icon: Clock, label: 'Time', value: `${booking.startTime} – ${booking.endTime}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-[10px] bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-[#0040A8]" />
                  </div>
                  <div>
                    <p className="m-0 text-[11px] text-[#9ca3af] font-semibold uppercase tracking-[0.05em]">
                      {label}
                    </p>
                    <p className="m-0 text-sm text-[#1a1a2e] font-medium">{value}</p>
                  </div>
                </div>
              ))}

              {booking.service && (
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-[10px] bg-[#e8f0fe] flex items-center justify-center">
                    <span className="text-base">🗂</span>
                  </div>
                  <div>
                    <p className="m-0 text-[11px] text-[#9ca3af] font-semibold uppercase tracking-[0.05em]">
                      Service
                    </p>
                    <p className="m-0 text-sm text-[#1a1a2e] font-medium">{booking.service.name}</p>
                  </div>
                </div>
              )}

              {booking.notes && (
                <div className="bg-[#f8f9ff] rounded-[10px] p-4">
                  <p className="m-0 mb-1 text-[11px] text-[#9ca3af] font-semibold uppercase tracking-[0.05em]">
                    Notes
                  </p>
                  <p className="m-0 text-sm text-[#374151]">{booking.notes}</p>
                </div>
              )}

              {booking.customFields &&
                Object.entries(booking.customFields).map(([key, val]) => (
                  <div key={key} className="bg-[#f8f9ff] rounded-[10px] px-4 py-3">
                    <p className="m-0 mb-1 text-[11px] text-[#9ca3af] font-semibold uppercase">{key}</p>
                    <p className="m-0 text-sm text-[#374151]">{String(val)}</p>
                  </div>
                ))}
            </div>
          </div>

          {isConfirmed && booking.calendarEventId && (
            <div className="bg-[#e8f5e9] rounded-xl p-4 border border-[#bbf7d0] flex gap-[10px] items-center">
              <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
              <p className="m-0 text-[13px] text-[#15803d]">
                Google Calendar event created and invite sent to client.
              </p>
            </div>
          )}
          {isConfirmed && booking.meetLink && (
            <div className="bg-[#e8f0fe] rounded-xl p-4 border border-[#bfdbfe] flex gap-[10px] items-center mt-3">
              <span className="text-xl">🎥</span>
              <div>
                <p className="m-0 mb-1 text-xs font-bold text-[#1d4ed8] uppercase tracking-[0.04em]">
                  Google Meet
                </p>
                <a
                  href={booking.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#0040A8] font-semibold no-underline hover:underline"
                >
                  Join Meeting →
                </a>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-[#e8e8e0] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell size={16} className="text-[#0040A8]" />
              <h4 className="m-0 text-sm font-bold text-[#1a1a2e]">Reminder</h4>
            </div>

            <label className="flex items-center gap-[10px] cursor-pointer mb-3">
              <button
                type="button"
                onClick={() => setReminderEnabled(!reminderEnabled)}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 flex-shrink-0 border-0 p-0 ${
                  reminderEnabled ? 'bg-[#0040A8]' : 'bg-gray-200'
                }`}
                aria-pressed={reminderEnabled}
              >
                <span
                  className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-200 ${
                    reminderEnabled ? 'left-[23px]' : 'left-[3px]'
                  }`}
                />
              </button>
              <span className="text-[13px] text-[#374151] font-medium">
                {reminderEnabled ? 'Reminder ON' : 'Reminder OFF'}
              </span>
            </label>

            {reminderEnabled && (
              <select
                value={reminderMinutes}
                onChange={(e) => setReminderMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#e8e8e0] rounded-lg text-[13px] font-[inherit] mb-2 outline-none focus:border-[#0040A8] transition-colors"
              >
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
                <option value={120}>2 hours before</option>
                <option value={1440}>1 day before</option>
              </select>
            )}

            <button
              type="button"
              onClick={handleReminderUpdate}
              className="w-full py-2 bg-[#f8f9ff] border border-[#e8e8e0] rounded-lg text-[13px] font-semibold text-[#0040A8] cursor-pointer hover:bg-[#e8f0fe] transition-colors"
            >
              Save Reminder
            </button>
          </div>

          {isPending && (
            <div className="bg-white rounded-2xl border border-[#e8e8e0] p-5">
              <h4 className="m-0 mb-4 text-sm font-bold text-[#1a1a2e]">Actions</h4>

              <label className="flex items-center gap-[10px] cursor-pointer mb-[14px] pb-[14px] border-b border-[#f3f4f6]">
                <button
                  type="button"
                  onClick={() => setIsVirtual((v) => !v)}
                  className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 flex-shrink-0 border-0 p-0 ${
                    isVirtual ? 'bg-[#0040A8]' : 'bg-gray-200'
                  }`}
                  aria-pressed={isVirtual}
                >
                  <span
                    className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white [box-shadow:0_1px_4px_rgba(0,0,0,0.2)] transition-all duration-200 ${
                      isVirtual ? 'left-[23px]' : 'left-[3px]'
                    }`}
                  />
                </button>
                <span className="text-[13px] text-[#374151] font-medium">
                  🎥 Virtual Meeting (Google Meet)
                </span>
              </label>

              {isVirtual && (
                <div className="mb-[14px]">
                  <p className="m-0 mb-2 text-[11px] text-[#9ca3af] font-semibold uppercase tracking-[0.05em]">
                    Meet link
                  </p>
                  <input
                    type="url"
                    value={meetLinkDraft}
                    onChange={(e) => setMeetLinkDraft(e.target.value)}
                    placeholder="Paste Google Meet link..."
                    className="w-full px-3 py-2 border border-[#e8e8e0] rounded-lg text-[13px] font-[inherit] outline-none focus:border-[#0040A8] transition-colors box-border"
                  />
                  <p className="m-0 mt-1.5 text-[11px] text-[#9ca3af]">
                    Optional if the calendar creates a link automatically; paste here to override.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={actionLoading === 'confirm'}
                className="w-full py-3 bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 mb-[10px] hover:bg-[#002d7a] disabled:opacity-60 transition-colors"
              >
                {actionLoading === 'confirm' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Confirm & Add to Calendar
              </button>

              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="w-full py-3 bg-white text-red-500 border border-[#fca5a5] rounded-[10px] text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 hover:bg-[#fce4ec] transition-colors"
              >
                <XCircle size={16} /> Reject Booking
              </button>
            </div>
          )}

          {isConfirmed && (
            <div className="bg-white rounded-2xl border border-[#e8e8e0] p-5">
              <h4 className="m-0 mb-3 text-sm font-bold text-[#1a1a2e]">Actions</h4>
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                className="w-full py-3 bg-white text-red-500 border border-[#fca5a5] rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#fce4ec] transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[480px] shadow-xl">
            <h3 className="m-0 mb-2 text-lg font-bold text-[#1a1a2e]">Reject Booking</h3>
            <p className="m-0 mb-5 text-[#6b7280] text-sm">
              Optionally add a personal message for the client.
            </p>
            <textarea
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              placeholder="Sorry, we're unable to accommodate your booking at this time..."
              rows={4}
              className="w-full p-3 border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] resize-y outline-none box-border focus:border-[#0040A8] transition-colors"
            />
            <div className="flex gap-[10px] mt-4">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 bg-gray-100 border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading === 'reject'}
                className="flex-1 py-3 bg-red-500 text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {actionLoading === 'reject' ? 'Sending...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )

  if (variant === 'drawer') {
    return (
      <div className="flex flex-col h-full min-h-0 bg-[#f7f7f2] font-app-sans">
        <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-b border-[#e8e8e0] bg-white sticky top-0 z-10">
          <h2 className="m-0 text-base font-bold text-[#1a1a2e]">Manage booking</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-[10px] border border-[#e8e8e0] bg-white flex items-center justify-center text-[#6b7280] hover:bg-[#f8f9ff] hover:text-[#1a1a2e] transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0 p-5">{inner}</div>
      </div>
    )
  }

  return <div className="max-w-[800px] mx-auto font-app-sans">{inner}</div>
}
