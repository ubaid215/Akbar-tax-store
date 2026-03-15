// src/app/(admin)/services/page.jsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ServiceCard        from '@/app/components/admin/services/ServiceCard';
import ServiceFormModal   from '@/app/components/admin/services/ServiceFormModal';
import DeleteConfirmModal from '@/app/components/admin/services/DeleteConfirmModal';
import ServicesEmptyState from '@/app/components/admin/services/ServicesEmptyState';

const T = {
  navy:    '#0B1E3D',
  brand:   '#0040A8',
  brandLt: '#0059F5',
  text2:   '#5D7A96',
  muted:   '#A0BBCF',
  border:  'rgba(0,64,168,0.10)',
};

const FILTER_OPTIONS = ['ALL', 'ACTIVE', 'INACTIVE', 'ARCHIVED'];

const FILTER_COLORS = {
  ALL:      { idle: { bg: 'rgba(0,64,168,0.07)',   color: T.text2   }, active: { bg: T.brand,   color: '#fff' } },
  ACTIVE:   { idle: { bg: 'rgba(5,150,105,0.08)',  color: '#059669' }, active: { bg: '#059669', color: '#fff' } },
  INACTIVE: { idle: { bg: 'rgba(217,119,6,0.08)',  color: '#D97706' }, active: { bg: '#D97706', color: '#fff' } },
  ARCHIVED: { idle: { bg: 'rgba(93,122,150,0.08)', color: T.text2   }, active: { bg: T.text2,   color: '#fff' } },
};

/* ── Minimal drag-sort ─────────────────────────────────────── */
function useDragSort(items, setItems, onReorder) {
  const dragIdx = useRef(null);
  const onDragStart = (idx) => { dragIdx.current = idx; };
  const onDragOver  = (e, idx) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx.current, 1);
    next.splice(idx, 0, moved);
    dragIdx.current = idx;
    setItems(next);
  };
  const onDrop = () => { dragIdx.current = null; onReorder(); };
  return { onDragStart, onDragOver, onDrop };
}

/* ── Filter pill ───────────────────────────────────────────── */
function FilterPill({ label, count, active, colors, onClick }) {
  const [hov, setHov] = useState(false);
  const col = active ? colors.active : colors.idle;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        padding: '6px 14px', borderRadius: 99, border: 'none', cursor: 'pointer',
        fontSize: 11, fontWeight: 700, background: col.bg, color: col.color,
        boxShadow: active ? '0 2px 10px rgba(0,64,168,0.18)' : 'none',
        opacity: !active && hov ? 0.75 : 1,
        transform: active ? 'scale(1.03)' : 'scale(1)',
        transition: 'all .15s ease',
      }}
    >
      {label}
      <span style={{
        background: 'rgba(255,255,255,0.28)', padding: '1px 7px',
        borderRadius: 99, fontSize: 10, fontWeight: 800,
      }}>
        {count}
      </span>
    </button>
  );
}

/* ── Add service button ────────────────────────────────────── */
function AddBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 20px', borderRadius: 12, border: 'none',
        fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', flexShrink: 0,
        background: hov
          ? 'linear-gradient(135deg,#072971,#0040A8)'
          : 'linear-gradient(135deg,#0040A8,#0059F5)',
        boxShadow: hov
          ? '0 6px 20px rgba(0,64,168,0.38)'
          : '0 4px 14px rgba(0,64,168,0.28)',
        transition: 'all .18s ease',
      }}
    >
      <Plus style={{ width: 15, height: 15 }} />
      Add Service
    </button>
  );
}

/* ── Skeleton grid ─────────────────────────────────────────── */
function SkeletonGrid() {
  return (
    <div style={{
      display: 'grid', gap: 16,
      gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
    }} className="services-grid">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="anim-pulse"
          style={{
            height: 160, borderRadius: 16, background: '#EEF4FF',
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────── */
export default function ServicesPage() {
  const [services,    setServices]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState('ALL');
  const [showForm,    setShowForm]    = useState(false);
  const [editService, setEditService] = useState(null);
  const [delService,  setDelService]  = useState(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/services');
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setServices(json.data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const saveOrder = useCallback(async () => {
    try {
      const order = services.map((s, i) => ({ id: s.id, sortOrder: i + 1 }));
      await fetch('/api/services/reorder', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order }),
      });
    } catch { /* silent */ }
  }, [services]);

  const { onDragStart, onDragOver, onDrop } = useDragSort(services, setServices, saveOrder);

  const handleEdit   = (s) => { setEditService(s); setShowForm(true); };
  const handleDelete = (s) => setDelService(s);
  const handleAdd    = ()  => { setEditService(null); setShowForm(true); };

  const handleToggle = async (service) => {
    if (service.status === 'ARCHIVED') return;
    const newStatus = service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: newStatus } : s));
    try {
      const res  = await fetch(`/api/services/${service.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success(`Service ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, status: service.status } : s));
      toast.error(err.message);
    }
  };

  const handleSaved = (saved) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === saved.id);
      return exists
        ? prev.map(s => s.id === saved.id ? { ...saved, _count: s._count } : s)
        : [...prev, { ...saved, _count: { bookings: 0 } }];
    });
    setShowForm(false);
    setEditService(null);
  };

  const handleDeleted = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setDelService(null);
  };

  const filtered = filter === 'ALL'
    ? services.filter(s => s.status !== 'ARCHIVED')
    : services.filter(s => s.status === filter);

  const counts = {
    ALL:      services.filter(s => s.status !== 'ARCHIVED').length,
    ACTIVE:   services.filter(s => s.status === 'ACTIVE').length,
    INACTIVE: services.filter(s => s.status === 'INACTIVE').length,
    ARCHIVED: services.filter(s => s.status === 'ARCHIVED').length,
  };

  const activeCount = counts.ACTIVE;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900, margin: '0 auto' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: 'linear-gradient(135deg,#0040A8,#0059F5)',
              boxShadow: '0 4px 12px rgba(0,64,168,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Briefcase style={{ width: 15, height: 15, color: '#fff' }} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: T.navy, margin: 0, letterSpacing: '-0.02em' }}>
              Services
            </h1>
          </div>
          <p style={{ fontSize: 12, color: T.muted, margin: 0, paddingLeft: 42 }}>
            Manage what clients can book — drag cards to reorder
          </p>
        </div>
        <AddBtn onClick={handleAdd} />
      </div>

      {/* ── Stats bar ──────────────────────────────────────── */}
      {services.length > 0 && (
        <div style={{
          display: 'grid', gap: 12,
          gridTemplateColumns: 'repeat(4, minmax(0,1fr))',
        }} className="services-stats-grid">
          {[
            { label: 'Total',    value: services.length,          color: T.brand   },
            { label: 'Active',   value: counts.ACTIVE,            color: '#059669' },
            { label: 'Inactive', value: counts.INACTIVE,          color: '#D97706' },
            { label: 'Archived', value: counts.ARCHIVED,          color: T.text2   },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: 14,
              border: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(0,64,168,0.04)',
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter pills ───────────────────────────────────── */}
      {services.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {FILTER_OPTIONS.map(f => (
            <FilterPill
              key={f}
              label={f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
              count={counts[f]}
              active={filter === f}
              colors={FILTER_COLORS[f]}
              onClick={() => setFilter(f)}
            />
          ))}
        </div>
      )}

      {/* ── Services grid ──────────────────────────────────── */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <ServicesEmptyState onAdd={handleAdd} />
      ) : (
        <div style={{
          display: 'grid', gap: 16,
          gridTemplateColumns: 'repeat(2, minmax(0,1fr))',
        }} className="services-grid">
          {filtered.map((service, idx) => (
            <div
              key={service.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={e => onDragOver(e, idx)}
              onDrop={onDrop}
              style={{ cursor: 'grab' }}
            >
              <ServiceCard
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                dragHandleProps={{}}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Live notice ────────────────────────────────────── */}
      {activeCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(5,150,105,0.06)',
          border: '1px solid rgba(5,150,105,0.18)',
          borderRadius: 14, padding: '12px 18px',
        }}>
          <span
            className="anim-pulse"
            style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', flexShrink: 0 }}
          />
          <p style={{ fontSize: 12, color: '#047857', margin: 0 }}>
            <strong style={{ color: '#065f46' }}>
              {activeCount} active service{activeCount !== 1 ? 's' : ''}
            </strong>
            {' '}visible on your public booking page. Drag cards to change display order.
          </p>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────── */}
      {showForm && (
        <ServiceFormModal
          service={editService}
          onClose={() => { setShowForm(false); setEditService(null); }}
          onSave={handleSaved}
        />
      )}

      {delService && (
        <DeleteConfirmModal
          service={delService}
          onClose={() => setDelService(null)}
          onDelete={handleDeleted}
        />
      )}
    </div>
  );
}