// src/components/admin/bookings/Pagination.jsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const T = { navy: '#0B1E3D', brand: '#0040A8', text2: '#5D7A96', muted: '#A0BBCF', border: 'rgba(0,64,168,0.10)' };

function PageBtn({ children, onClick, disabled, active }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 32, height: 32, borderRadius: 8, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: active ? 700 : 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        background: active
          ? 'linear-gradient(135deg,#0040A8,#0059F5)'
          : hov ? 'rgba(0,64,168,0.06)' : 'transparent',
        color: active ? '#fff' : hov ? T.brand : T.text2,
        boxShadow: active ? '0 2px 8px rgba(0,64,168,0.25)' : 'none',
        border: active ? 'none' : `1px solid ${hov ? 'rgba(0,64,168,0.18)' : T.border}`,
        transition: 'all .15s ease',
      }}
    >
      {children}
    </button>
  );
}

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = pagination;
  const from = (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
      justifyContent: 'space-between', gap: 12, padding: '0 4px',
    }}>
      <p style={{ fontSize: 12, color: T.muted, margin: 0 }}>
        Showing{' '}
        <strong style={{ color: T.text2, fontWeight: 700 }}>{from}–{to}</strong>
        {' '}of{' '}
        <strong style={{ color: T.text2, fontWeight: 700 }}>{total}</strong>
        {' '}bookings
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          <ChevronLeft style={{ width: 14, height: 14 }} />
        </PageBtn>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} style={{ width: 32, textAlign: 'center', fontSize: 12, color: T.muted }}>…</span>
          ) : (
            <PageBtn key={p} onClick={() => onPageChange(p)} active={p === page}>
              {p}
            </PageBtn>
          )
        )}

        <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          <ChevronRight style={{ width: 14, height: 14 }} />
        </PageBtn>
      </div>
    </div>
  );
}