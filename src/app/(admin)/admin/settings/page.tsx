'use client'
import { useEffect, useState } from 'react'
import { Save, Plus, Trash2, CheckCircle, XCircle, Loader2, Link2 } from 'lucide-react'
import { toast } from 'sonner'

interface CustomField {
  id: string
  label: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select'
  required: boolean
  options?: string
  placeholder?: string
}

interface Settings {
  businessName: string
  businessEmail: string
  businessPhone: string
  timezone: string
  slotDuration: number
  bufferTime: number
  maxAdvanceBooking: number
  minAdvanceBooking: number
  customFields: CustomField[]
  confirmationSubject: string
  rejectionSubject: string
  reminderSubject: string
  googleCalendarId: string
  googleLinked: boolean
  adminEmailNotify: boolean
}

const TIMEZONES = ['Asia/Karachi', 'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Dubai']
const FIELD_TYPES = ['text', 'email', 'phone', 'textarea', 'select']

/** Reusable toggle switch */
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [googleTesting, setGoogleTesting] = useState(false)
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [activeTab, setActiveTab] = useState<'general' | 'booking' | 'fields' | 'notifications' | 'google'>('general')

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setSettings)
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      toast.success('Settings saved!')
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const testGoogle = async () => {
    setGoogleTesting(true)
    const res = await fetch('/api/admin/settings/test-google')
    const data = await res.json()
    setGoogleStatus(data.success ? 'ok' : 'fail')
    setGoogleTesting(false)
  }

  const addField = () => {
    if (!settings) return
    const newField: CustomField = { id: Date.now().toString(), label: '', type: 'text', required: false, placeholder: '' }
    setSettings(s => s ? { ...s, customFields: [...s.customFields, newField] } : s)
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setSettings(s => s ? { ...s, customFields: s.customFields.map(f => f.id === id ? { ...f, ...updates } : f) } : s)
  }

  const removeField = (id: string) => {
    setSettings(s => s ? { ...s, customFields: s.customFields.filter(f => f.id !== id) } : s)
  }

  const tabs = [
    { key: 'general',       label: 'General' },
    { key: 'booking',       label: 'Booking' },
    { key: 'fields',        label: 'Client Fields' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'google',        label: 'Google Calendar' },
  ]

  const inputCls = 'w-full px-3 py-[10px] border border-[#e8e8e0] rounded-[10px] text-sm font-[inherit] outline-none box-border focus:border-[#0040A8] transition-colors'

  if (!settings) return (
    <div className="flex items-center justify-center h-[300px] text-[#9ca3af]">
      <Loader2 size={24} className="animate-spin" />
    </div>
  )

  return (
    <div className="max-w-[820px] mx-auto">
      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#e8e8e0] mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as typeof activeTab)}
            className={`shrink-0 sm:flex-1 px-3 py-2 border-none rounded-[10px] text-[13px] font-semibold cursor-pointer font-[inherit] transition-all duration-200 ${
              activeTab === t.key ? 'bg-[#0040A8] text-white' : 'bg-transparent text-[#6b7280] hover:text-[#1a1a2e]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e8e0] p-4 sm:p-8">

        {/* GENERAL */}
        {activeTab === 'general' && (
          <div className="grid gap-5">
            <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Business Information</h3>
            {[
              { label: 'Business Name',  key: 'businessName',  type: 'text' },
              { label: 'Business Email', key: 'businessEmail', type: 'email' },
              { label: 'Business Phone', key: 'businessPhone', type: 'tel' },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">{label}</label>
                <input
                  type={type}
                  value={(settings as any)[key] || ''}
                  onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                  className={inputCls}
                />
              </div>
            ))}
            <div>
              <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Timezone</label>
              <select
                value={settings.timezone}
                onChange={e => setSettings(s => s ? { ...s, timezone: e.target.value } : s)}
                className={inputCls}
              >
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* BOOKING */}
        {activeTab === 'booking' && (
          <div className="grid gap-5">
            <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Booking Rules</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Default Slot Duration (min)',        key: 'slotDuration',      options: [15,30,45,60,90,120] },
                { label: 'Buffer Time Between Bookings (min)', key: 'bufferTime',        options: [0,5,10,15,30,60] },
                { label: 'Max Advance Booking (days)',         key: 'maxAdvanceBooking', options: [7,14,30,60,90] },
                { label: 'Min Notice Required (hours)',        key: 'minAdvanceBooking', options: [1,2,6,12,24,48] },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">{label}</label>
                  <select
                    value={(settings as any)[key]}
                    onChange={e => setSettings(s => s ? { ...s, [key]: Number(e.target.value) } : s)}
                    className={inputCls}
                  >
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENT FIELDS */}
        {activeTab === 'fields' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Client Booking Fields</h3>
                <p className="m-0 mt-1 text-[13px] text-[#6b7280]">
                  Name, Email & Phone are always included. Add custom fields below.
                </p>
              </div>
              <button
                onClick={addField}
                className="flex items-center gap-[6px] px-4 py-2 bg-[#0040A8] text-white border-none rounded-[10px] text-[13px] font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
              >
                <Plus size={14} /> Add Field
              </button>
            </div>

            {/* Default fields (non-editable) */}
            {['Full Name', 'Email Address', 'Phone Number'].map(f => (
              <div key={f} className="flex items-center gap-3 px-4 py-3 bg-[#f8f9ff] rounded-[10px] mb-2 border border-[#e8e8e0]">
                <span className="flex-1 text-sm text-[#374151] font-medium">{f}</span>
                <span className="text-[11px] bg-[#e8f0fe] text-[#0040A8] px-2 py-[2px] rounded-full font-semibold">
                  Default · Required
                </span>
              </div>
            ))}

            <div className="grid gap-3 mt-4">
              {settings.customFields.map(field => (
                <div key={field.id} className="border border-[#e8e8e0] rounded-xl p-4">
                  <div className="grid gap-[10px] items-center grid-cols-1 sm:[grid-template-columns:1fr_140px_80px_auto]">
                    <input
                      value={field.label}
                      onChange={e => updateField(field.id, { label: e.target.value })}
                      placeholder="Field label e.g. Company Name"
                      className="px-3 py-2 border border-[#e8e8e0] rounded-lg text-sm font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                    />
                    <select
                      value={field.type}
                      onChange={e => updateField(field.id, { type: e.target.value as any })}
                      className="px-[10px] py-2 border border-[#e8e8e0] rounded-lg text-[13px] font-[inherit] outline-none focus:border-[#0040A8] transition-colors"
                    >
                      {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <label className="flex items-center gap-[6px] cursor-pointer text-[13px] text-[#374151]">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={e => updateField(field.id, { required: e.target.checked })}
                        className="cursor-pointer"
                      />
                      Required
                    </label>
                    <button
                      onClick={() => removeField(field.id)}
                      className="bg-transparent border-none cursor-pointer text-red-500 hover:bg-[#fce4ec] rounded p-1 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {field.type === 'select' && (
                    <input
                      value={field.options || ''}
                      onChange={e => updateField(field.id, { options: e.target.value })}
                      placeholder="Options: Option 1, Option 2, Option 3 (comma separated)"
                      className="w-full mt-2 px-3 py-2 border border-[#e8e8e0] rounded-lg text-[13px] font-[inherit] outline-none box-border focus:border-[#0040A8] transition-colors"
                    />
                  )}
                  <input
                    value={field.placeholder || ''}
                    onChange={e => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Placeholder text (optional)"
                    className="w-full mt-2 px-3 py-2 border border-[#e8e8e0] rounded-lg text-[13px] font-[inherit] outline-none box-border focus:border-[#0040A8] transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="grid gap-5">
            <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Email Templates — Subjects</h3>
            {[
              { label: 'Confirmation Email Subject', key: 'confirmationSubject' },
              { label: 'Rejection Email Subject',    key: 'rejectionSubject' },
              { label: 'Reminder Email Subject',     key: 'reminderSubject' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">{label}</label>
                <input
                  value={(settings as any)[key] || ''}
                  onChange={e => setSettings(s => s ? { ...s, [key]: e.target.value } : s)}
                  className={inputCls}
                />
              </div>
            ))}
            <label className="flex items-center gap-[10px] cursor-pointer">
              <Toggle
                on={settings.adminEmailNotify}
                onClick={() => setSettings(s => s ? { ...s, adminEmailNotify: !s.adminEmailNotify } : s)}
              />
              <span className="text-sm font-medium text-[#374151]">Notify admin by email on new booking</span>
            </label>
          </div>
        )}

        {/* GOOGLE CALENDAR */}
        {activeTab === 'google' && (
          <div className="grid gap-5">
            <h3 className="m-0 text-base font-bold text-[#1a1a2e]">Google Calendar Integration</h3>

            <div className="bg-[#f8f9ff] rounded-xl p-5 border border-[#e8e8e0]">
              <p className="m-0 mb-3 text-[13px] text-[#374151]">
                Make sure your <strong>.env</strong> has:
              </p>
              {['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY', 'GOOGLE_CALENDAR_ID'].map(k => (
                <code
                  key={k}
                  className="block text-xs bg-[#1a1a2e] text-[#e8f0fe] px-[10px] py-1 rounded-md mb-1"
                >
                  {k}
                </code>
              ))}
            </div>

            <div>
              <label className="block text-[13px] font-semibold mb-[6px] text-[#374151]">Calendar ID</label>
              <input
                value={settings.googleCalendarId || ''}
                onChange={e => setSettings(s => s ? { ...s, googleCalendarId: e.target.value } : s)}
                placeholder="your-calendar@gmail.com"
                className={inputCls}
              />
            </div>

            <button
              onClick={testGoogle}
              disabled={googleTesting}
              className="flex items-center gap-2 px-5 py-[10px] bg-[#1a1a2e] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer w-fit hover:bg-black disabled:opacity-60 transition-colors"
            >
              {googleTesting ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
              Test Connection
            </button>

            {googleStatus === 'ok' && (
              <div className="flex gap-2 items-center p-[14px] bg-[#e8f5e9] rounded-[10px]">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-sm text-[#15803d] font-medium">Google Calendar connected successfully!</span>
              </div>
            )}
            {googleStatus === 'fail' && (
              <div className="flex gap-2 items-center p-[14px] bg-[#fce4ec] rounded-[10px]">
                <XCircle size={18} className="text-red-500" />
                <span className="text-sm text-[#b91c1c] font-medium">Connection failed. Check your .env credentials.</span>
              </div>
            )}
          </div>
        )}

        {/* Save button */}
        <div className="border-t border-[#e8e8e0] mt-8 pt-6">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-[#0040A8] text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer hover:bg-[#002d7a] disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
