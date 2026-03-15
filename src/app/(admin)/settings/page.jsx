// src/app/(admin)/settings/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSection, PasswordSection, NotificationsSection, AccountInfoSection } from '@/app/components/admin/settings/SettingsSections';

export default function SettingsPage() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(j => { if (j.success) setUser(j.data); })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = (partial) => setUser(prev => ({ ...prev, ...partial }));

  return (
    <div style={{ padding:'24px', maxWidth:800, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
        <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg,#0040A8,#0059F5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Settings style={{ width:16, height:16, color:'#fff' }} />
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#0B1E3D' }}>Settings</h1>
          <p style={{ margin:0, fontSize:13, color:'#A0BBCF' }}>Manage your account and preferences</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {Array.from({length:3}).map((_,i) => (
            <div key={i} style={{ height:180, borderRadius:20, background:'#F8FBFF', animation:'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <ProfileSection       user={user} onUpdate={handleUpdate} />
          <PasswordSection />
          <NotificationsSection user={user} onUpdate={handleUpdate} />
          <AccountInfoSection   user={user} />
        </div>
      )}
    </div>
  );
}