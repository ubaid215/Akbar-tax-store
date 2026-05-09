'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { toast } from 'sonner'

interface Service {
  id?: string
  name: string
  description: string
  duration: number
  price: number | ''
  color: string
  isActive: boolean
  order: number
}

const COLORS = ['#0040A8', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [form, setForm] = useState<Service>({
    name: '', description: '', duration: 60, price: '', color: '#0040A8', isActive: true, order: 0,
  })

  const fetchServices = () => {
    fetch('/api/admin/services').then(r => r.json()).then(setServices).finally(() => setLoading(false))
  }

  useEffect(() => { fetchServices() }, [])

  const openForm = (service?: Service) => {
    if (service) { setEditService(service); setForm(service) }
    else { setEditService(null); setForm({ name: '', description: '', duration: 60, price: '', color: '#0040A8', isActive: true, order: services.length }) }
    setShowForm(true)
  }

  const saveService = async () => {
    const method = editService?.id ? 'PUT' : 'POST'
    const url = editService?.id ? `/api/admin/services/${editService.id}` : '/api/admin/services'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    toast.success(editService ? 'Service updated!' : 'Service created!')
    setShowForm(false)
    fetchServices()
  }

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    toast.success('Service deleted')
    fetchServices()
  }

  const toggleActive = async (service: Service) => {
    await fetch(`/api/admin/services/${service.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...service, isActive: !service.isActive }),
    })
    fetchServices()
  }

  return (
    <div className="max-w-[800px] mx-auto">
      <div className="flex justify-end mb-5">
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 px-5 py-[10px] bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#9ca3af]">Loading...</div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e8e0] py-16 text-center">
          <p className="m-0 mb-4 text-[#9ca3af] text-[15px]">No services yet. Add your first service.</p>
          <button
            onClick={() => openForm()}
            className="px-6 py-[10px] bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
          >
            Add Service
          </button>
        </div>
      ) : (
        <div className="grid gap-3">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-[14px] border border-[#e8e8e0] px-4 sm:px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div
                className="w-1 h-12 rounded flex-shrink-0"
                style={{ background: service.color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-[2px]">
                  <span className="font-bold text-[15px] text-[#1a1a2e]">{service.name}</span>
                  {!service.isActive && (
                    <span className="bg-gray-100 text-[#9ca3af] text-[11px] px-2 py-[2px] rounded-full font-semibold">
                      Inactive
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="m-0 mb-1 text-[13px] text-[#6b7280]">{service.description}</p>
                )}
                <div className="flex gap-3">
                  <span className="text-xs text-[#9ca3af]">⏱ {service.duration} min</span>
                  {service.price ? <span className="text-xs text-[#9ca3af]">💰 PKR {service.price}</span> : null}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => toggleActive(service)}
                  className={`bg-transparent border border-[#e8e8e0] rounded-lg p-[6px] cursor-pointer transition-colors hover:bg-[#f8f9ff] ${
                    service.isActive ? 'text-green-500' : 'text-[#9ca3af]'
                  }`}
                >
                  {service.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
                <button
                  onClick={() => openForm(service)}
                  className="bg-[#e8f0fe] border-none rounded-lg px-[14px] py-[6px] text-[13px] font-semibold text-[#0040A8] cursor-pointer hover:bg-[#0040A8] hover:text-white transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service.id!)}
                  className="bg-transparent border border-[#fca5a5] rounded-lg p-[6px] cursor-pointer text-red-500 hover:bg-[#fce4ec] transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-[520px] max-h-[92vh] overflow-y-auto">
            <h3 className="m-0 mb-6 text-lg font-bold text-[#1a1a2e]">
              {editService ? 'Edit Service' : 'New Service'}
            </h3>

            <div className="grid gap-4">
              <div>
                <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Service Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Tax Filing Consultation"
                  className="w-full px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none box-border focus:border-[#0040A8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Brief description..."
                  className="w-full px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none resize-y box-border focus:border-[#0040A8] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Duration (minutes)</label>
                  <select
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="w-full px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                  >
                    {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Price (PKR, optional)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value ? Number(e.target.value) : '' }))}
                    placeholder="Optional"
                    className="w-full px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none box-border focus:border-[#0040A8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold mb-2 text-[#374151]">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <div
                      key={c}
                      onClick={() => setForm(f => ({ ...f, color: c }))}
                      className="w-7 h-7 rounded-full cursor-pointer box-border transition-transform hover:scale-110"
                      style={{
                        background: c,
                        border: form.color === c ? '3px solid #1a1a2e' : '3px solid transparent',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-[10px] mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-gray-100 border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="flex-1 py-3 bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
              >
                {editService ? 'Save Changes' : 'Create Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
