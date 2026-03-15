// src/components/admin/services/ServiceCard.jsx
'use client';

import { GripVertical, Pencil, Trash2, ToggleLeft, ToggleRight, Clock,  CalendarDays } from 'lucide-react';

const STATUS_STYLES = {
  ACTIVE:   { label: 'Active',   dot: '#10b981', bg: '#f0fdf4', text: '#166534' },
  INACTIVE: { label: 'Inactive', dot: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  ARCHIVED: { label: 'Archived', dot: '#94a3b8', bg: '#f8fafc', text: '#475569' },
};

export default function ServiceCard({ service, onEdit, onDelete, onToggle, dragHandleProps }) {
  const style    = STATUS_STYLES[service.status] ?? STATUS_STYLES.INACTIVE;
  const isActive = service.status === 'ACTIVE';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden group">
      <div className="flex items-start gap-3 p-5">

        {/* Drag handle */}
        <div
          {...dragHandleProps}
          className="mt-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing flex-shrink-0 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Color dot / icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${service.color ?? '#3B82F6'}18` }}
        >
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ background: service.color ?? '#3B82F6' }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">{service.name}</h3>
              {service.description && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{service.description}</p>
              )}
            </div>

            {/* Status badge */}
            <span
              className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: style.bg, color: style.text }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
              {style.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {service.price != null ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                Rs. 
                {Number(service.price).toFixed(2)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-gray-400">Free</span>
            )}

            {service.duration && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3 text-gray-400" />
                {service.duration} min
              </span>
            )}

            {service.bufferTime ? (
              <span className="text-xs text-gray-400">+{service.bufferTime} min buffer</span>
            ) : null}

            <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
              <CalendarDays className="w-3 h-3" />
              {service._count?.bookings ?? 0} bookings
            </span>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/50">
        {/* Toggle active/inactive */}
        <button
          onClick={() => onToggle(service)}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isActive ? 'text-emerald-600 hover:text-emerald-700' : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isActive ? 'Deactivate service' : 'Activate service'}
          disabled={service.status === 'ARCHIVED'}
        >
          {isActive
            ? <ToggleRight className="w-4 h-4" />
            : <ToggleLeft  className="w-4 h-4" />
          }
          {isActive ? 'Active' : 'Inactive'}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(service)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(service)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}