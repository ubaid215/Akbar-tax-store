// src/components/admin/services/DeleteConfirmModal.jsx
'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteConfirmModal({ service, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const bookingCount = service?._count?.bookings ?? 0;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res  = await fetch(`/api/services/${service.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Service deleted');
      onDelete(service.id);
    } catch (err) {
      toast.error(err.message ?? 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Delete Service</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Delete "{service?.name}"?
              </p>
              {bookingCount > 0 ? (
                <p className="text-xs text-amber-700 mt-1">
                  This service has <strong>{bookingCount} booking{bookingCount !== 1 ? 's' : ''}</strong>. It will be
                  archived rather than permanently deleted to preserve booking history.
                </p>
              ) : (
                <p className="text-xs text-amber-700 mt-1">
                  This action cannot be undone. The service will be removed from the public booking page immediately.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : bookingCount > 0 ? 'Archive Service' : 'Delete Service'}
          </button>
        </div>
      </div>
    </div>
  );
}