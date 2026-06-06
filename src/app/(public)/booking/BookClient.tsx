'use client'
// src/app/booking/BookClient.tsx
// ─────────────────────────────────────────────────────────────────────────────
// This is the original BookPage UI component — ZERO changes to logic or design.
// Renamed from page.tsx → BookClient.tsx as part of the Server/Client split.
// The Server Component wrapper (page.tsx) now handles metadata + JSON-LD schema.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Calendar, User, Mail, Phone, Loader2, ArrowRight, AlertCircle } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Slot { time: string; status: 'available' | 'booked' }
interface Service { id: string; name: string; duration: number; price?: number; color: string; description?: string }
interface CustomField { id: string; label: string; type: string; required: boolean; options?: string; placeholder?: string }
interface Settings {
  customFields: CustomField[]
  bookingFormFields?: CustomField[]
  slotDuration: number
  businessName: string
  minAdvanceBooking: number
  maxAdvanceBooking: number
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`
}

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`
}

// ─── Animation variants ───────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookClient() {
  const [mounted, setMounted] = useState(false)
  const today = useRef(new Date())

  const [step, setStep] = useState<1|2|3|4>(1)
  const [calMonth, setCalMonth] = useState(today.current.getMonth())
  const [calYear, setCalYear] = useState(today.current.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [bookingId, setBookingId] = useState('')
  const [form, setForm] = useState<Record<string, string>>({ name: '', email: '', phone: '', notes: '' })
  const topRef = useRef<HTMLDivElement>(null)
  const adminDefinedFields = settings?.bookingFormFields ?? settings?.customFields ?? []
  const getBuiltInKey = (idOrLabel: string) => {
    const normalized = idOrLabel.trim().toLowerCase().replace(/\s+/g, ' ')
    if (['name', 'full name', 'client name'].includes(normalized)) return 'name'
    if (['email', 'email address', 'client email'].includes(normalized)) return 'email'
    if (['phone', 'phone number', 'mobile', 'mobile number', 'client phone'].includes(normalized)) return 'phone'
    if (['notes', 'additional notes'].includes(normalized)) return 'notes'
    return null
  }

  const requiredOverrides: Record<'name' | 'email' | 'phone' | 'notes', boolean> = {
    name: true,
    email: true,
    phone: false,
    notes: false,
  }

  for (const field of adminDefinedFields) {
    const keyFromId = getBuiltInKey(field.id || '')
    const keyFromLabel = getBuiltInKey(field.label || '')
    const builtInKey = keyFromId || keyFromLabel
    if (builtInKey) requiredOverrides[builtInKey] = !!field.required
  }

  const dynamicFields = adminDefinedFields.filter((field) => {
    const id = (field.id || '').trim().toLowerCase()
    const label = (field.label || '').trim().toLowerCase()
    const normalized = label.replace(/\s+/g, ' ')

    const duplicateDefault =
      ['name', 'full name', 'client name'].includes(normalized) ||
      ['email', 'email address', 'client email'].includes(normalized) ||
      ['phone', 'phone number', 'mobile', 'mobile number', 'client phone'].includes(normalized) ||
      ['notes', 'additional notes'].includes(normalized) ||
      ['name', 'email', 'phone', 'notes'].includes(id)

    return !duplicateDefault
  })

  useEffect(() => {
    setMounted(true)
    Promise.all([
      fetch('/api/admin/services')
        .then(async (r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch('/api/admin/settings')
        .then(async (r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ]).then(([svcs, sett]) => {
      const active = Array.isArray(svcs)
        ? svcs.filter((s: Service & { isActive?: boolean }) => s.isActive !== false)
        : []

      setServices(active)
      setSettings(sett)
      setStep(active.length > 0 ? 1 : 2)
      setDataLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (dataLoaded && services.length === 0 && step === 1) {
      setStep(2)
    }
  }, [dataLoaded, services.length, step])

  useEffect(() => {
    if (!selectedDate) return
    setSlotsLoading(true)
    fetch(`/api/bookings?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setSlots(data.slots || []))
      .finally(() => setSlotsLoading(false))
  }, [selectedDate])

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' })

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDay = new Date(calYear, calMonth, 1).getDay()

  const isDaySelectable = (day: number) => {
    if (!mounted) return false
    const maxDate = new Date(); maxDate.setDate(maxDate.getDate() + (settings?.maxAdvanceBooking || 30))
    const minDate = new Date(); minDate.setHours(0, 0, 0, 0)
    const d = new Date(calYear, calMonth, day)
    return d >= minDate && d <= maxDate
  }

  const calendarDays = Array.from({ length: firstDay }, () => null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1) } else setCalMonth(m => m-1) }
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1) } else setCalMonth(m => m+1) }

  const handleDateSelect = (day: number) => {
    if (!isDaySelectable(day)) return
    const d = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    setSelectedDate(d); setSelectedSlot(null)
  }

  const handleSubmit = async () => {
    setError(''); setSubmitting(true)
    if (requiredOverrides.name && !form.name.trim()) { setError('Full Name is required'); setSubmitting(false); return }
    if (requiredOverrides.email && !form.email.trim()) { setError('Email Address is required'); setSubmitting(false); return }
    if (requiredOverrides.phone && !form.phone.trim()) { setError('Phone Number is required'); setSubmitting(false); return }
    if (requiredOverrides.notes && !form.notes.trim()) { setError('Additional Notes is required'); setSubmitting(false); return }
    if (!selectedDate || !selectedSlot) { setError('Please select a date and time'); setSubmitting(false); return }
    for (const f of dynamicFields) {
      if (f.required && !(form[f.id] || '').trim()) { setError(`${f.label} is required`); setSubmitting(false); return }
    }

    const slotDuration = settings?.slotDuration || 60
    const endTime = addMinutes(selectedSlot, selectedService?.duration || slotDuration)
    const customFields: Record<string, string> = {}
    dynamicFields.forEach(f => { customFields[f.label] = form[f.id] || '' })

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name, clientEmail: form.email, clientPhone: form.phone,
          serviceId: selectedService?.id, date: selectedDate, startTime: selectedSlot,
          endTime, notes: form.notes, customFields,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); return }
      setBookingId(data.bookingId)
      setStep(4); scrollTop()
    } catch { setError('Network error. Please try again.') } finally { setSubmitting(false) }
  }

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  const stepList = services.length > 0
    ? [{ n: 1, label: 'Service' }, { n: 2, label: 'Date & Time' }, { n: 3, label: 'Your Details' }]
    : [{ n: 2, label: 'Date & Time' }, { n: 3, label: 'Your Details' }]

  return (
    <div
      ref={topRef}
      className="min-h-screen bg-[#f7f7f2] booking-page font-app-sans"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Hero + Step Indicator ── */}
      <div className="bg-[#0040A8] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute -top-10 -right-10 w-[280px] h-[280px] rounded-full border border-white/[0.08] pointer-events-none" />
        <div className="absolute top-5 right-5 w-[160px] h-[160px] rounded-full border border-white/[0.05] pointer-events-none" />

        <div className="max-w-[800px] mx-auto px-6 pt-12 pb-10 relative">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-white/60 text-[13px] font-semibold tracking-[0.1em] uppercase mb-3">
              Akbar Tax Store
            </p>
            <h1 className="text-white text-5xl font-bold leading-[1.15] mb-4 max-sm:text-[36px]">
              Book an Appointment
            </h1>
            <p className="text-white/65 text-base max-w-[480px] leading-relaxed">
              Schedule a consultation with our tax professionals. Select a time that works for you.
            </p>
          </motion.div>
        </div>

        {dataLoaded && step < 4 && (
          <div className="max-w-[800px] mx-auto px-6 relative" style={{ zIndex: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl px-7 py-5 shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-[#e8e8e0] flex items-center translate-y-1/2"
            >
              {stepList.map((s, i) => (
                <div key={s.n} className={`flex items-center ${i < stepList.length - 1 ? 'flex-1' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300 ${
                        step >= s.n ? 'bg-[#0040A8] text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step > s.n ? <CheckCircle size={16} /> : (services.length > 0 ? s.n : s.n - 1)}
                    </div>
                    <span
                      className={`text-[13px] font-semibold whitespace-nowrap max-sm:hidden ${
                        step >= s.n ? 'text-[#1a1a2e]' : 'text-gray-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < stepList.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 transition-colors duration-300 ${
                        step > s.n ? 'bg-[#0040A8]' : 'bg-[#e8e8e0]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        )}

        <div className={dataLoaded && step < 4 ? 'h-10' : 'h-6'} />
      </div>

      <div className={`max-w-[800px] mx-auto px-6 pb-20 ${dataLoaded && step < 4 ? 'pt-14' : 'pt-8'}`}>

        {!dataLoaded && (
          <div className="py-20 text-center text-[#6b7280]">
            <Loader2 size={32} className="mx-auto mb-3 block animate-spin" />
            <p className="text-[15px]">Loading…</p>
          </div>
        )}

        <AnimatePresence>

          {/* STEP 1: Service selection */}
          {dataLoaded && step === 1 && services.length > 0 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              <h2 className="text-[22px] font-bold text-[#1a1a2e] mb-2 font-app-sans">Select a Service</h2>
              <p className="text-[#6b7280] text-sm mb-7">Choose the service you&apos;d like to book</p>
              <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-3.5">
                {services.map(service => (
                  <motion.div
                    key={service.id}
                    variants={fadeUp}
                    onClick={() => { setSelectedService(service); setStep(2); scrollTop() }}
                    className={`bg-white rounded-2xl px-6 py-5 flex items-center gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,64,168,0.1)] border ${selectedService?.id === service.id ? 'border-[#0040A8]' : 'border-[#e8e8e0]'}`}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: service.color + '18' }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: service.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base text-[#1a1a2e] mb-0.5">{service.name}</p>
                      {service.description && <p className="text-[13px] text-[#6b7280] mb-1">{service.description}</p>}
                      <div className="flex gap-3">
                        <span className="text-xs text-[#6b7280] flex items-center gap-1"><Clock size={12} /> {service.duration} min</span>
                        {service.price && <span className="text-xs text-[#6b7280]">PKR {service.price.toLocaleString()}</span>}
                      </div>
                    </div>
                    <ArrowRight size={18} className="text-[#0040A8] opacity-50" />
                  </motion.div>
                ))}
                <motion.div
                  variants={fadeUp}
                  onClick={() => { setSelectedService(null); setStep(2); scrollTop() }}
                  className="bg-[#f8f9ff] border border-dashed border-[#e8e8e0] rounded-2xl px-6 py-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                >
                  <p className="text-sm text-[#6b7280] flex-1">General Consultation / Not sure</p>
                  <ArrowRight size={16} className="text-[#6b7280]" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* STEP 2: Date + Time */}
          {dataLoaded && step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              {services.length > 0 && (
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 bg-transparent border-none text-[#6b7280] text-sm cursor-pointer mb-6 p-0 hover:text-[#1a1a2e] transition-colors"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              )}
              <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                <div className="bg-white rounded-2xl border border-[#e8e8e0] p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-[#1a1a2e]">{MONTHS[calMonth]} {calYear}</h3>
                    <div className="flex gap-1">
                      <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#e8e8e0] bg-white cursor-pointer flex items-center justify-center text-[#6b7280] hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={16} />
                      </button>
                      <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-[#e8e8e0] bg-white cursor-pointer flex items-center justify-center text-[#6b7280] hover:bg-gray-50 transition-colors">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 mb-2">
                    {WEEKDAYS.map(d => (
                      <div key={d} className="text-center text-[11px] font-bold text-[#6b7280] py-1 uppercase tracking-[0.04em]">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5">
                    {calendarDays.map((day, i) => {
                      if (!day) return <div key={i} />
                      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                      const selectable = isDaySelectable(day)
                      const isSelected = dateStr === selectedDate
                      const isToday = mounted && day === today.current.getDate() && calMonth === today.current.getMonth() && calYear === today.current.getFullYear()
                      return (
                        <button
                          key={i}
                          onClick={() => selectable && handleDateSelect(day)}
                          className={`
                            rounded-lg py-2 px-1 text-sm transition-all duration-150 border-0
                            ${isSelected ? 'bg-[#0040A8] text-white font-semibold' : ''}
                            ${!isSelected && !selectable ? 'text-gray-300 cursor-not-allowed' : ''}
                            ${!isSelected && selectable && isToday ? 'text-[#0040A8] font-bold outline outline-1 outline-[#0040A8]' : ''}
                            ${!isSelected && selectable && !isToday ? 'text-[#1a1a2e] hover:bg-[#e8f0fe] hover:text-[#0040A8]' : ''}
                            ${selectable && !isSelected ? 'cursor-pointer' : ''}
                          `}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#e8e8e0] p-6">
                  <h3 className="text-base font-bold text-[#1a1a2e] mb-1.5">Available Times</h3>
                  {!selectedDate ? (
                    <div className="py-10 text-center text-[#6b7280]">
                      <Calendar size={32} className="mx-auto mb-3 block opacity-30" />
                      <p className="text-sm">Select a date first</p>
                    </div>
                  ) : slotsLoading ? (
                    <div className="py-10 text-center text-[#6b7280]">
                      <Loader2 size={24} className="mx-auto mb-2 block animate-spin" />
                      <p className="text-sm">Loading slots…</p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="py-10 text-center text-[#6b7280]">
                      <Clock size={32} className="mx-auto mb-3 block opacity-30" />
                      <p className="text-sm">No slots available for this day</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[13px] text-[#6b7280] mb-4">{formattedDate}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {slots.map(slot => {
                          const isSelected = slot.time === selectedSlot
                          const isBooked = slot.status === 'booked'
                          const todayStr = `${today.current.getFullYear()}-${String(today.current.getMonth()+1).padStart(2,'0')}-${String(today.current.getDate()).padStart(2,'0')}`
                          const isPast = selectedDate === todayStr && (() => {
                            const [h, m] = slot.time.split(':').map(Number)
                            const now = new Date()
                            return h * 60 + m < now.getHours() * 60 + now.getMinutes()
                          })()
                          const isDisabled = isBooked || isPast
                          return (
                            <button
                              key={slot.time}
                              disabled={isDisabled}
                              onClick={() => !isDisabled && setSelectedSlot(slot.time)}
                              className={`
                                py-2.5 px-2 rounded-xl border text-[13px] font-semibold transition-all duration-[180ms] relative
                                ${isSelected ? 'bg-[#0040A8] text-white border-[#0040A8]' : ''}
                                ${isBooked && !isSelected ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' : ''}
                                ${isPast && !isSelected ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' : ''}
                                ${!isSelected && !isDisabled ? 'bg-white text-[#1a1a2e] border-[#e8e8e0] cursor-pointer hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,64,168,0.15)]' : ''}
                              `}
                            >
                              {formatTime(slot.time)}
                              {isBooked && <span className="block text-[10px] text-red-400 font-medium no-underline mt-0.5">Booked</span>}
                              {isPast && !isBooked && <span className="block text-[10px] text-gray-400 font-medium mt-0.5">Passed</span>}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {selectedDate && selectedSlot && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 bg-white rounded-2xl border border-[#e8e8e0] px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-[#1a1a2e] text-[15px]">{formattedDate}</p>
                    <p className="text-[#6b7280] text-[13px]">{formatTime(selectedSlot)} {selectedService ? `· ${selectedService.name}` : ''}</p>
                  </div>
                  <button
                    onClick={() => { setStep(3); scrollTop() }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0040A8] text-white border-none rounded-xl text-sm font-bold cursor-pointer hover:bg-[#002d7a] transition-colors"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Client details */}
          {dataLoaded && step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="max-w-[560px] mx-auto"
            >
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 bg-transparent border-none text-[#6b7280] text-sm cursor-pointer mb-6 p-0 hover:text-[#1a1a2e] transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>

              <div className="bg-[#0040A8] rounded-2xl px-6 py-5 mb-7 text-white">
                <p className="text-[12px] text-white/60 font-semibold uppercase tracking-[0.06em] mb-2">Your Appointment</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2 items-center">
                    <Calendar size={15} className="opacity-70" />
                    <span className="text-sm font-semibold">{formattedDate}</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock size={15} className="opacity-70" />
                    <span className="text-sm font-semibold">{selectedSlot && formatTime(selectedSlot)}</span>
                  </div>
                  {selectedService && (
                    <div className="col-span-2 text-[13px] text-white/75 mt-1">
                      {selectedService.name} · {selectedService.duration} min
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#e8e8e0] p-7">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-6 font-app-sans">Your Information</h2>
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-[18px]">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name', required: requiredOverrides.name },
                    { id: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'your@email.com', required: requiredOverrides.email },
                    { id: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+92 3xx xxxxxxx', required: requiredOverrides.phone },
                  ].map(f => (
                    <motion.div key={f.id} variants={fadeUp}>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        {f.label}{' '}
                        {f.required ? (
                          <span className="text-red-500">*</span>
                        ) : (
                          <span className="text-[#9ca3af] font-normal">(optional)</span>
                        )}
                      </label>
                      <div className="relative">
                        <f.icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7280]" />
                        <input
                          type={f.type}
                          value={form[f.id] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full py-[11px] pr-3.5 pl-10 border border-[#e8e8e0] rounded-xl text-sm outline-none transition-colors focus:border-[#0040A8]"
                          style={{ fontFamily: 'inherit' }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {dynamicFields.map(field => (
                    <motion.div key={field.id} variants={fadeUp}>
                      <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                        {field.label}{' '}
                        {field.required ? (
                          <span className="text-red-500">*</span>
                        ) : (
                          <span className="text-[#9ca3af] font-normal">(optional)</span>
                        )}
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={form[field.id] || ''}
                          onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full py-[11px] px-3.5 border border-[#e8e8e0] rounded-xl text-sm outline-none resize-y focus:border-[#0040A8]"
                          style={{ fontFamily: 'inherit' }}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={form[field.id] || ''}
                          onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))}
                          className="w-full py-[11px] px-3.5 border border-[#e8e8e0] rounded-xl text-sm outline-none bg-white focus:border-[#0040A8]"
                          style={{ fontFamily: 'inherit' }}
                        >
                          <option value="">Select…</option>
                          {field.options?.split(',').map(o => <option key={o.trim()} value={o.trim()}>{o.trim()}</option>)}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={form[field.id] || ''}
                          onChange={e => setForm(p => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full py-[11px] px-3.5 border border-[#e8e8e0] rounded-xl text-sm outline-none focus:border-[#0040A8]"
                          style={{ fontFamily: 'inherit' }}
                        />
                      )}
                    </motion.div>
                  ))}

                  <motion.div variants={fadeUp}>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                      Additional Notes{' '}
                      {requiredOverrides.notes ? (
                        <span className="text-red-500">*</span>
                      ) : (
                        <span className="text-[#9ca3af] font-normal">(optional)</span>
                      )}
                    </label>
                    <textarea
                      value={form.notes || ''}
                      onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                      placeholder="Anything we should know before your appointment..."
                      rows={3}
                      className="w-full py-[11px] px-3.5 border border-[#e8e8e0] rounded-xl text-sm outline-none resize-y focus:border-[#0040A8]"
                      style={{ fontFamily: 'inherit' }}
                    />
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-center bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4"
                  >
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <span className="text-sm text-red-700">{error}</span>
                  </motion.div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`w-full mt-6 py-3.5 bg-[#0040A8] text-white border-none rounded-xl text-[15px] font-bold flex items-center justify-center gap-2.5 transition-opacity ${submitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-[#002d7a]'}`}
                >
                  {submitting
                    ? <><Loader2 size={18} className="animate-spin" /> Submitting…</>
                    : <>Request Appointment <ArrowRight size={18} /></>
                  }
                </button>
                <p className="text-center mt-3 text-xs text-[#6b7280]">
                  Your booking is subject to confirmation. You&apos;ll receive an email once reviewed.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="max-w-[520px] mx-auto text-center pt-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-[#e8f5e9] flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-[28px] booking-page font-bold text-[#1a1a2e] mb-3 font-app-sans">
                  Booking Request Sent!
                </h2>
                <p className="text-[#6b7280] text-[15px] leading-[1.7] mb-8">
                  Thank you! We&apos;ve received your request for <strong>{formattedDate}</strong> at <strong>{selectedSlot && formatTime(selectedSlot)}</strong>.<br /><br />
                  Our team will review and confirm your appointment. You&apos;ll receive an email notification shortly.
                </p>
                <div className="bg-white border border-[#e8e8e0] rounded-2xl p-6 mb-6 text-left">
                  <p className="text-xs font-bold text-[#6b7280] uppercase tracking-[0.06em] mb-3">Booking Summary</p>
                  <div className="grid gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280]">Date</span>
                      <span className="font-semibold text-[#1a1a2e]">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280]">Time</span>
                      <span className="font-semibold text-[#1a1a2e]">{selectedSlot && formatTime(selectedSlot)}</span>
                    </div>
                    {selectedService && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6b7280]">Service</span>
                        <span className="font-semibold text-[#1a1a2e]">{selectedService.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b7280]">Status</span>
                      <span className="font-semibold text-amber-500 bg-amber-50 px-2.5 py-0.5 rounded-full text-xs">Pending Confirmation</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setStep(services.length ? 1 : 2)
                    setSelectedDate(null); setSelectedSlot(null); setSelectedService(null)
                    setForm({ name:'', email:'', phone:'', notes:'' })
                  }}
                  className="px-8 py-3 bg-[#0040A8] text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors"
                >
                  Book Another Appointment
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}