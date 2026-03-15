// src/components/admin/services/ServicesEmptyState.jsx
'use client';

import { Briefcase, Plus } from 'lucide-react';

export default function ServicesEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
        <Briefcase className="w-7 h-7 text-blue-400" />
      </div>
      <h3 className="text-base font-bold text-gray-900">No services yet</h3>
      <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
        Services define what clients can book. Add your first service to start accepting appointments.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-200"
      >
        <Plus className="w-4 h-4" />
        Add First Service
      </button>
    </div>
  );
}