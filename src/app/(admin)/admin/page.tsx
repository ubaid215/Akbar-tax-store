'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Users, TrendingUp, ArrowRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Stats {
  totalBookings: number
  pendingBookings: number
  confirmedToday: number
  totalClients: number
  recentBookings: any[]
}

const statusStyles: Record<string, { bg: string; color: string; label: string; icon: any }> = {
  PENDING:   { bg: '#fff8e1', color: '#f59e0b', label: 'Pending',   icon: AlertCircle },
  CONFIRMED: { bg: '#e8f5e9', color: '#22c55e', label: 'Confirmed', icon: CheckCircle },
  REJECTED:  { bg: '#fce4ec', color: '#ef4444', label: 'Rejected',  icon: XCircle },
  CANCELLED: { bg: '#f3f4f6', color: '#9ca3af', label: 'Cancelled', icon: XCircle },
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Bookings',  value: stats?.totalBookings  ?? 0, icon: Calendar,    color: '#0040A8', bg: '#e8f0fe' },
    { label: 'Pending Review',  value: stats?.pendingBookings ?? 0, icon: Clock,       color: '#f59e0b', bg: '#fff8e1' },
    { label: 'Confirmed Today', value: stats?.confirmedToday ?? 0, icon: CheckCircle, color: '#22c55e', bg: '#e8f5e9' },
    { label: 'Total Clients',   value: stats?.totalClients   ?? 0, icon: Users,       color: '#8b5cf6', bg: '#f3e8ff' },
  ]

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 sm:mb-8">
        <h2 className="m-0 mb-1 text-2xl sm:text-[28px] font-bold text-[#1a1a2e] font-app-sans">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'} 👋
        </h2>
        <p className="m-0 text-[#6b7280] text-[15px]">
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl p-6 border border-[#e8e8e0] [box-shadow:0_2px_12px_rgba(0,64,168,0.04)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}
              >
                <card.icon size={22} style={{ color: card.color }} />
              </div>
              <TrendingUp size={16} className="text-gray-300" />
            </div>
            <p className="m-0 mb-1 text-[32px] font-bold text-[#1a1a2e] font-app-sans">
              {loading ? '—' : card.value}
            </p>
            <p className="m-0 text-[13px] text-[#6b7280] font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-[#e8e8e0] overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e8e8e0] flex items-center justify-between">
          <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Recent Bookings</h3>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-1 text-[#0040A8] text-[13px] font-semibold no-underline hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-[#9ca3af]">Loading...</div>
        ) : !stats?.recentBookings?.length ? (
          <div className="py-12 text-center text-[#9ca3af]">
            <Calendar size={32} className="mx-auto mb-3 block opacity-40" />
            <p className="m-0">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f8f9ff]">
                {['Client', 'Date', 'Time', 'Service', 'Status', 'Actions'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-[0.05em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking: any) => {
                const s = statusStyles[booking.status] || statusStyles.PENDING
                return (
                  <tr key={booking.id} className="border-t border-[#f3f4f6]">
                    <td className="px-6 py-4">
                      <p className="m-0 font-semibold text-[#1a1a2e] text-sm">{booking.clientName}</p>
                      <p className="m-0 text-xs text-[#9ca3af]">{booking.clientEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#374151]">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-[#374151]">{booking.startTime}</td>
                    <td className="px-6 py-4 text-sm text-[#374151]">{booking.service?.name || '—'}</td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-xs font-semibold"
                        style={{ background: s.bg, color: s.color }}
                      >
                        <s.icon size={12} /> {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="text-[#0040A8] text-[13px] font-semibold no-underline hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
