// src/components/admin/settings/SettingsSections.jsx
'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff, Loader2, CheckCircle, User, Lock, Bell, Info } from 'lucide-react';
import { toast } from 'sonner';

// ── Shared field ────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#5D7A96', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize:11, color:'#A0BBCF', marginTop:4 }}>{hint}</p>}
    </div>
  );
}

const inputStyle = (err) => ({
  width:'100%', padding:'10px 14px', fontSize:13, borderRadius:12,
  border:`1px solid ${err ? '#fca5a5' : 'rgba(0,64,168,.12)'}`,
  background:'#F8FBFF', outline:'none', boxSizing:'border-box',
  color:'#0B1E3D', transition:'border .15s',
});

function SaveButton({ saving, saved, label = 'Save Changes' }) {
  return (
    <button
      type="submit"
      disabled={saving}
      style={{
        display:'flex', alignItems:'center', gap:8,
        padding:'10px 20px', borderRadius:12, border:'none', cursor:'pointer',
        fontSize:13, fontWeight:700, transition:'all .15s',
        background: saved ? '#059669' : 'linear-gradient(135deg,#0040A8,#0059F5)',
        color:'#fff', opacity: saving ? 0.6 : 1,
        boxShadow:'0 4px 14px rgba(0,64,168,.25)',
      }}
    >
      {saving ? <Loader2 style={{ width:15, height:15, animation:'spin 1s linear infinite' }} />
              : saved  ? <CheckCircle style={{ width:15, height:15 }} />
                       : <Save style={{ width:15, height:15 }} />}
      {saving ? 'Saving…' : saved ? 'Saved!' : label}
    </button>
  );
}

// ── Profile Section ─────────────────────────────────────────
export function ProfileSection({ user, onUpdate }) {
  const [name,    setName]    = useState(user?.name  ?? '');
  const [phone,   setPhone]   = useState(user?.phone ?? '');
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      const res  = await fetch('/api/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name, phone }) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Profile updated');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onUpdate?.({ name, phone });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'24px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'#EEF4FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <User style={{ width:17, height:17, color:'#0040A8' }} />
        </div>
        <div>
          <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Profile</h3>
          <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>Your personal details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
          <Field label="Full Name">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle(false)}
              onFocus={e => e.target.style.border = '1px solid #0040A8'}
              onBlur={e => e.target.style.border  = '1px solid rgba(0,64,168,.12)'} />
          </Field>
          <Field label="Email" hint="Email cannot be changed">
            <input value={user?.email ?? ''} disabled style={{ ...inputStyle(false), opacity:0.5, cursor:'not-allowed' }} />
          </Field>
          <Field label="Phone Number">
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 555 000 0000" style={inputStyle(false)}
              onFocus={e => e.target.style.border = '1px solid #0040A8'}
              onBlur={e => e.target.style.border  = '1px solid rgba(0,64,168,.12)'} />
          </Field>
          <Field label="Role" hint="Contact super admin to change role">
            <input value={(user?.role ?? '').replace('_',' ')} disabled style={{ ...inputStyle(false), opacity:0.5, cursor:'not-allowed', textTransform:'capitalize' }} />
          </Field>
        </div>
        <SaveButton saving={saving} saved={saved} />
      </form>
    </div>
  );
}

// ── Password Section ────────────────────────────────────────
export function PasswordSection() {
  const [curr,    setCurr]    = useState('');
  const [next,    setNext]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [show,    setShow]    = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = {};
    if (!curr)        e2.curr    = 'Required';
    if (next.length < 8) e2.next = 'Min 8 characters';
    if (next !== confirm) e2.confirm = 'Passwords do not match';
    if (Object.keys(e2).length) { setErrors(e2); return; }

    setSaving(true);
    try {
      const res  = await fetch('/api/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ currentPassword:curr, newPassword:next }) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Password changed successfully');
      setCurr(''); setNext(''); setConfirm('');
      setErrors({});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'24px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'#FEF3C7', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Lock style={{ width:17, height:17, color:'#d97706' }} />
        </div>
        <div>
          <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Password</h3>
          <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>Change your login password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:16 }}>
          {[
            { label:'Current Password', val:curr, set:setCurr, key:'curr'    },
            { label:'New Password',      val:next, set:setNext, key:'next'    },
            { label:'Confirm Password',  val:confirm, set:setConfirm, key:'confirm' },
          ].map(({ label, val, set, key }) => (
            <Field key={key} label={label}>
              <div style={{ position:'relative' }}>
                <input
                  type={show ? 'text' : 'password'}
                  value={val}
                  onChange={e => { set(e.target.value); if (errors[key]) setErrors(p => ({ ...p, [key]:null })); }}
                  style={{ ...inputStyle(errors[key]), paddingRight:40 }}
                  onFocus={e => e.target.style.border = '1px solid #0040A8'}
                  onBlur={e  => e.target.style.border = `1px solid ${errors[key] ? '#fca5a5' : 'rgba(0,64,168,.12)'}`}
                />
                <button type="button" onClick={() => setShow(p => !p)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#A0BBCF' }}>
                  {show ? <EyeOff style={{ width:15, height:15 }} /> : <Eye style={{ width:15, height:15 }} />}
                </button>
              </div>
              {errors[key] && <p style={{ fontSize:11, color:'#ef4444', margin:'4px 0 0' }}>{errors[key]}</p>}
            </Field>
          ))}
        </div>
        <SaveButton saving={saving} label="Change Password" />
      </form>
    </div>
  );
}

// ── Notifications Section ───────────────────────────────────
export function NotificationsSection({ user, onUpdate }) {
  const [pushEnabled,  setPush]   = useState(user?.pushEnabled  ?? true);
  const [emailEnabled, setEmail]  = useState(user?.emailEnabled ?? true);
  const [saving,       setSaving] = useState(false);
  const [saved,        setSaved]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res  = await fetch('/api/settings', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pushEnabled, emailEnabled }) });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast.success('Notification preferences saved');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onUpdate?.({ pushEnabled, emailEnabled });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange, label, desc }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(0,64,168,.06)' }}>
      <div>
        <p style={{ margin:0, fontSize:13, fontWeight:700, color:'#0B1E3D' }}>{label}</p>
        <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', padding:3, flexShrink:0,
          background: checked ? 'linear-gradient(135deg,#0040A8,#0059F5)' : '#E2E8F0',
          display:'flex', alignItems:'center',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          transition:'all .2s',
        }}
      >
        <div style={{ width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
      </button>
    </div>
  );

  return (
    <div style={{ background:'#fff', borderRadius:20, padding:'24px', border:'1px solid rgba(0,64,168,.08)', boxShadow:'0 2px 12px rgba(0,64,168,.06)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:'#EEF4FF', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Bell style={{ width:17, height:17, color:'#0040A8' }} />
        </div>
        <div>
          <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:'#0B1E3D' }}>Notifications</h3>
          <p style={{ margin:0, fontSize:11, color:'#A0BBCF' }}>How you receive alerts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Toggle checked={pushEnabled}  onChange={setPush}  label="Browser Notifications" desc="Real-time alerts for new bookings and reminders" />
        <Toggle checked={emailEnabled} onChange={setEmail} label="Email Notifications"   desc="Get email summaries and booking confirmations" />
        <div style={{ marginTop:20 }}>
          <SaveButton saving={saving} saved={saved} />
        </div>
      </form>
    </div>
  );
}

// ── Info Section ────────────────────────────────────────────
export function AccountInfoSection({ user }) {
  return (
    <div style={{ background:'#F8FBFF', borderRadius:20, padding:'20px 24px', border:'1px solid rgba(0,64,168,.08)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <Info style={{ width:15, height:15, color:'#A0BBCF' }} />
        <h3 style={{ margin:0, fontSize:12, fontWeight:700, color:'#5D7A96', textTransform:'uppercase', letterSpacing:'0.08em' }}>Account Info</h3>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12 }}>
        {[
          { label:'Member Since',  value: user?.createdAt  ? new Date(user.createdAt).toLocaleDateString()  : '—' },
          { label:'Last Login',    value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : '—' },
          { label:'Account Role',  value: (user?.role ?? '').replace('_',' ') },
          { label:'Status',        value: user?.status ?? '—' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ margin:0, fontSize:10, fontWeight:700, color:'#A0BBCF', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
            <p style={{ margin:'3px 0 0', fontSize:13, fontWeight:700, color:'#0B1E3D', textTransform:'capitalize' }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}