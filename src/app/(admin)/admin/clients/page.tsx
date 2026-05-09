'use client'
import { useEffect, useState } from 'react'
import { Search, Mail, Phone, Calendar } from 'lucide-react'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(setClients)
      .finally(() => setLoading(false))
  }, [])

  const filtered = clients.filter(c =>
    c.clientName.toLowerCase().includes(search.toLowerCase()) ||
    c.clientEmail.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-[#e8e8e0] p-4 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full py-[10px] pr-3 pl-9 border border-[#e8e8e0] rounded-[10px] text-sm outline-none font-[inherit] box-border focus:border-[#0040A8] transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#9ca3af]">Loading clients...</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:[grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {filtered.map((client, i) => (
            <div key={i} className="bg-white rounded-[14px] border border-[#e8e8e0] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[#e8f0fe] flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-[#0040A8]">
                    {client.clientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="m-0 font-bold text-[15px] text-[#1a1a2e]">{client.clientName}</p>
                  <p className="m-0 text-xs text-[#9ca3af]">
                    {client._count} booking{client._count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="grid gap-[6px]">
                <div className="flex gap-2 items-center">
                  <Mail size={13} className="text-[#9ca3af] flex-shrink-0" />
                  <span className="text-[13px] text-[#374151] truncate">{client.clientEmail}</span>
                </div>
                {client.clientPhone && (
                  <div className="flex gap-2 items-center">
                    <Phone size={13} className="text-[#9ca3af] flex-shrink-0" />
                    <span className="text-[13px] text-[#374151]">{client.clientPhone}</span>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <Calendar size={13} className="text-[#9ca3af] flex-shrink-0" />
                  <span className="text-[13px] text-[#374151]">Last: {client.lastBooking}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
