'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type FieldType = 'text' | 'email' | 'phone' | 'textarea' | 'select'

interface BookingField {
  id: string
  label: string
  type: FieldType
  required: boolean
  options?: string
  placeholder?: string
}

interface SettingsPayload {
  businessName: string
  businessEmail: string
  businessPhone: string
  timezone: string
  slotDuration: number
  bufferTime: number
  maxAdvanceBooking: number
  minAdvanceBooking: number
  customFields: BookingField[]
  bookingFormFields?: BookingField[]
  confirmationSubject: string
  rejectionSubject: string
  reminderSubject: string
  googleCalendarId: string
  adminEmailNotify: boolean
}

const FIELD_TYPES: FieldType[] = ['text', 'email', 'phone', 'textarea', 'select']

export default function AdminBookingFieldsPage() {
  const [settings, setSettings] = useState<SettingsPayload | null>(null)
  const [fields, setFields] = useState<BookingField[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        const existing = (data.bookingFormFields || data.customFields || []) as BookingField[]
        setFields(existing)
      })
  }, [])

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
      },
    ])
  }

  const updateField = (id: string, updates: Partial<BookingField>) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id))
  }

  const saveFields = async () => {
    if (!settings) return
    const valid = fields.every((f) => f.label.trim().length > 0)
    if (!valid) {
      toast.error('Every custom field must have a label.')
      return
    }

    setSaving(true)
    try {
      const payload: SettingsPayload = {
        ...settings,
        bookingFormFields: fields,
        customFields: fields, // keep legacy consumers in sync
      }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed')
      setSettings(await res.json())
      toast.success('Booking fields saved.')
    } catch {
      toast.error('Failed to save booking fields.')
    } finally {
      setSaving(false)
    }
  }

  if (!settings) {
    return (
      <div className="h-[260px] flex items-center justify-center text-[#9ca3af]">
        <Loader2 size={22} className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[860px] mx-auto">
      <div className="bg-white rounded-2xl border border-[#e8e8e0] p-4 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-[#1a1a2e]">Booking Form Fields</h2>
            <p className="m-0 mt-1 text-[13px] text-[#6b7280]">
              Add or edit dynamic fields that clients fill on the public booking form.
            </p>
          </div>
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0040A8] text-white rounded-[10px] border-none text-sm font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
          >
            <Plus size={15} /> Add Field
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-[#e8e8e0] bg-[#f8f9ff] p-3 sm:p-4">
          <p className="m-0 text-[12px] text-[#6b7280]">
            Default fields already included on booking page: <strong>Name</strong>, <strong>Email</strong>,{' '}
            <strong>Phone</strong>, and <strong>Notes</strong>.
          </p>
        </div>

        <div className="grid gap-3">
          {fields.length === 0 ? (
            <div className="text-center py-10 text-[#9ca3af] border border-dashed border-[#d1d5db] rounded-xl">
              No custom fields yet
            </div>
          ) : (
            fields.map((field) => (
              <div key={field.id} className="border border-[#e8e8e0] rounded-xl p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:[grid-template-columns:1fr_150px_95px_auto] gap-2.5 items-center">
                  <input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Field label (e.g. Company Name)"
                    className="px-3 py-2 border border-[#e8e8e0] rounded-lg text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                  />

                  <select
                    value={field.type}
                    onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                    className="px-3 py-2 border border-[#e8e8e0] rounded-lg text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors bg-white"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  <label className="inline-flex items-center gap-1.5 text-[13px] text-[#374151]">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    Required
                  </label>

                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="w-fit p-2 border border-[#fca5a5] rounded-lg bg-transparent text-red-500 cursor-pointer hover:bg-[#fce4ec] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {field.type === 'select' && (
                  <input
                    value={field.options || ''}
                    onChange={(e) => updateField(field.id, { options: e.target.value })}
                    placeholder="Options: Option 1, Option 2, Option 3"
                    className="w-full mt-2 px-3 py-2 border border-[#e8e8e0] rounded-lg text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                  />
                )}

                <input
                  value={field.placeholder || ''}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  placeholder="Placeholder (optional)"
                  className="w-full mt-2 px-3 py-2 border border-[#e8e8e0] rounded-lg text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                />
              </div>
            ))
          )}
        </div>

        <div className="pt-5 mt-5 border-t border-[#e8e8e0]">
          <button
            type="button"
            onClick={saveFields}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] disabled:opacity-70 transition-colors"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving...' : 'Save Booking Fields'}
          </button>
        </div>
      </div>
    </div>
  )
}
