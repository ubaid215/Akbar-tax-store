// src/components/admin/services/ServiceFormModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, DollarSign, Clock, Palette } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_COLORS = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#F97316',
  '#6366F1', '#14B8A6', '#84CC16', '#A855F7',
];

const DURATION_PRESETS = [
  { label: '15 min',   value: 15  },
  { label: '30 min',   value: 30  },
  { label: '45 min',   value: 45  },
  { label: '1 hour',   value: 60  },
  { label: '1.5 hrs',  value: 90  },
  { label: '2 hours',  value: 120 },
  { label: '3 hours',  value: 180 },
  { label: 'Custom',   value: 0   },
];

const BUFFER_PRESETS = [
  { label: 'None',    value: 0  },
  { label: '5 min',   value: 5  },
  { label: '10 min',  value: 10 },
  { label: '15 min',  value: 15 },
  { label: '30 min',  value: 30 },
];

const EMPTY_FORM = {
  name:        '',
  description: '',
  price:       '',
  isFree:      true,
  duration:    60,
  customDuration: '',
  useCustomDuration: false,
  bufferTime:  10,
  color:       '#3B82F6',
  status:      'ACTIVE',
};

export default function ServiceFormModal({ service, onClose, onSave }) {
  const isEdit = !!service;
  const [form,   setForm]   = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (service) {
      const durationPreset = DURATION_PRESETS.find(d => d.value === service.duration && d.value !== 0);
      setForm({
        name:               service.name ?? '',
        description:        service.description ?? '',
        price:              service.price != null ? String(service.price) : '',
        isFree:             service.price == null,
        duration:           durationPreset ? service.duration : 60,
        customDuration:     !durationPreset ? String(service.duration ?? '') : '',
        useCustomDuration:  !durationPreset && service.duration != null,
        bufferTime:         service.bufferTime ?? 10,
        color:              service.color ?? '#3B82F6',
        status:             service.status ?? 'ACTIVE',
      });
    }
  }, [service]);

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.isFree && form.price !== '' && isNaN(parseFloat(form.price))) e.price = 'Enter a valid price';
    if (!form.isFree && parseFloat(form.price) < 0) e.price = 'Price cannot be negative';
    const dur = form.useCustomDuration ? parseInt(form.customDuration) : form.duration;
    if (!dur || dur < 5 || dur > 480) e.duration = 'Duration must be 5–480 minutes';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSaving(true);
    try {
      const dur   = form.useCustomDuration ? parseInt(form.customDuration) : form.duration;
      const price = form.isFree ? null : (form.price !== '' ? parseFloat(form.price) : null);

      const body = {
        name:        form.name.trim(),
        description: form.description.trim() || null,
        price,
        duration:    dur,
        bufferTime:  form.bufferTime || null,
        color:       form.color,
        status:      form.status,
      };

      const url    = isEdit ? `/api/services/${service.id}` : '/api/services';
      const method = isEdit ? 'PATCH' : 'POST';

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      toast.success(isEdit ? 'Service updated' : 'Service created');
      onSave(json.data);
    } catch (err) {
      toast.error(err.message ?? 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {isEdit ? 'Edit Service' : 'New Service'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? 'Update service details' : 'Add a service clients can book'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Service Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g. Tax Consultation"
              className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="What does this service include?"
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Pricing</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update('isFree', true)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  form.isFree
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Free
              </button>
              <button
                type="button"
                onClick={() => update('isFree', false)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  !form.isFree
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                Paid
              </button>
            </div>

            {!form.isFree && (
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={e => update('price', e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.price ? 'border-red-300' : 'border-gray-200'}`}
                />
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</label>
            <div className="grid grid-cols-4 gap-1.5">
              {DURATION_PRESETS.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (value === 0) {
                      update('useCustomDuration', true);
                    } else {
                      update('duration', value);
                      update('useCustomDuration', false);
                    }
                  }}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    (value === 0 && form.useCustomDuration) || (value === form.duration && !form.useCustomDuration)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {form.useCustomDuration && (
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="number"
                  min="5"
                  max="480"
                  value={form.customDuration}
                  onChange={e => update('customDuration', e.target.value)}
                  placeholder="Minutes (5–480)"
                  className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all ${errors.duration ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
            )}
            {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
          </div>

          {/* Buffer */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              Buffer Time <span className="text-gray-400 font-normal normal-case">(after appointment)</span>
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {BUFFER_PRESETS.map(({ label, value }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => update('bufferTime', value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    form.bufferTime === value
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
              <Palette className="inline w-3.5 h-3.5 mr-1" />Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update('color', c)}
                  className="w-7 h-7 rounded-lg transition-all hover:scale-110"
                  style={{
                    background: c,
                    outline:    form.color === c ? `3px solid ${c}` : 'none',
                    outlineOffset: '2px',
                  }}
                />
              ))}
              {/* Custom color */}
              <div className="relative">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => update('color', e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                  title="Custom color"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Status</label>
            <div className="flex gap-2">
              {['ACTIVE', 'INACTIVE'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update('status', s)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    form.status === s
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {s === 'ACTIVE' ? '✓ Active' : '○ Inactive'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Only Active services appear on the public booking page.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 shadow-sm shadow-blue-200"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      </div>
    </div>
  );
}