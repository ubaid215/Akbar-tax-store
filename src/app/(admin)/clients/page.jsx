// src/app/(admin)/clients/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import ClientsTable      from '@/app/components/admin/clients/ClientsTable';
import ClientDetailPanel from '@/app/components/admin/clients/ClientDetailPanel';
import Pagination        from '@/app/components/admin/bookings/Pagination';

export default function ClientsPage() {
  const [clients,    setClients]    = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [page,       setPage]       = useState(1);
  const [selected,   setSelected]   = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20, ...(search && { search }) });
      const res  = await fetch(`/api/clients?${params}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setClients(json.data.clients);
      setPagination(json.data.pagination);
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchClients(); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div style={{ padding:'24px', maxWidth:1100, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0040A8,#0059F5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Users style={{ width:16, height:16, color:'#fff' }} />
            </div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#0B1E3D' }}>Clients</h1>
          </div>
          <p style={{ margin:'4px 0 0 42px', fontSize:13, color:'#A0BBCF' }}>All clients who have made bookings</p>
        </div>

        {pagination && (
          <div style={{ fontSize:12, color:'#A0BBCF', fontWeight:600, background:'#F8FBFF', padding:'6px 14px', borderRadius:10, border:'1px solid rgba(0,64,168,.08)' }}>
            {pagination.total} total client{pagination.total !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:20, maxWidth:400 }}>
        <Search style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:15, height:15, color:'#A0BBCF', pointerEvents:'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or phone…"
          style={{ width:'100%', padding:'10px 40px 10px 40px', fontSize:13, borderRadius:12, border:'1px solid rgba(0,64,168,.12)', background:'#F8FBFF', outline:'none', boxSizing:'border-box', color:'#0B1E3D' }}
          onFocus={e => e.target.style.border = '1px solid #0040A8'}
          onBlur={e  => e.target.style.border = '1px solid rgba(0,64,168,.12)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#A0BBCF' }}>
            <X style={{ width:14, height:14 }} />
          </button>
        )}
      </div>

      {/* Table */}
      <ClientsTable clients={clients} loading={loading} onSelect={setSelected} />

      {/* Pagination */}
      {pagination && !loading && (
        <div style={{ marginTop:20 }}>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}

      {/* Detail panel */}
      {selected && (
        <ClientDetailPanel client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}