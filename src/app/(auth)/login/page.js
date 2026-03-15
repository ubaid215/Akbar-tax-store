'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';

const T = {
  navy:    '#0B1E3D',
  brand:   '#0040A8',
  brandLt: '#0059F5',
  text2:   '#5D7A96',
  muted:   '#A0BBCF',
  border:  'rgba(0,64,168,0.12)',
};

const FEATURES = [
  { icon: '📅', text: 'Manage bookings in real-time'       },
  { icon: '🔔', text: 'Instant push & email notifications'  },
  { icon: '📊', text: 'Analytics & revenue insights'       },
  { icon: '⚡', text: 'Set availability in minutes'        },
];

/* ── Reusable input field ─────────────────────────────── */
function InputField({ icon: Icon, label, right, inputProps }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
        textTransform: 'uppercase', color: T.text2,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <Icon style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)',
          width: 15, height: 15, color: focused ? T.brand : T.muted,
          pointerEvents: 'none', transition: 'color .15s',
        }} />
        <input
          {...inputProps}
          onFocus={(e) => { setFocused(true); inputProps.onFocus?.(e); }}
          onBlur={(e)  => { setFocused(false); inputProps.onBlur?.(e);  }}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '11px 40px 11px 42px',
            borderRadius: 12, fontSize: 13,
            color: T.navy, background: focused ? '#fff' : '#F8FBFF',
            border: `1.5px solid ${focused ? T.brand : T.border}`,
            outline: 'none', transition: 'all .18s ease',
            boxShadow: focused ? `0 0 0 3px rgba(0,64,168,0.10)` : 'none',
            ...(right ? { paddingRight: 44 } : {}),
          }}
        />
        {right}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form,         setForm]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [btnHovered,   setBtnHovered]   = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      className="login-root"
    >

      {/* ── LEFT PANEL ──────────────────────────────────── */}
      <div
        className="login-left"
        style={{
          display: 'none', /* shown via media query */
          flexDirection: 'column', justifyContent: 'space-between',
          padding: 48, position: 'relative', overflow: 'hidden',
          background: '#070D1F',
        }}
      >
        {/* Gradient orbs */}
        <div style={{
          position: 'absolute', top: -80, left: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(0,64,168,0.25)', filter: 'blur(100px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(0,89,245,0.12)', filter: 'blur(80px)',
          pointerEvents: 'none',
        }} />

        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#0040A8,#0059F5)',
            boxShadow: '0 4px 16px rgba(0,64,168,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <CalendarCheck style={{ width: 18, height: 18, color: '#fff' }} />
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>
            BookingAdmin
          </span>
        </div>

        {/* Headline + features */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 36 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(0,64,168,0.18)', border: '1px solid rgba(0,89,245,0.25)',
              borderRadius: 99, padding: '6px 14px', alignSelf: 'flex-start',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <span style={{ color: '#93c5fd', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Admin Portal
              </span>
            </div>

            <h1 style={{
              fontSize: 38, fontWeight: 800, color: '#fff',
              lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0,
            }}>
              Your booking<br />
              <span style={{
                background: 'linear-gradient(90deg, #60a5fa, #bfdbfe)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                command centre
              </span>
            </h1>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, maxWidth: 320, margin: 0 }}>
              Everything you need to manage appointments, clients, and revenue — in one clean dashboard.
            </p>
          </div>

          {/* Feature list */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FEATURES.map(({ icon, text }) => (
              <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {icon}
                </div>
                <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 500 }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p style={{ position: 'relative', zIndex: 1, fontSize: 11, color: '#334155', margin: 0 }}>
          © {new Date().getFullYear()} BookingAdmin. All rights reserved.
        </p>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#fff',
        padding: 'clamp(24px, 6vw, 48px)',
      }}>

        {/* Mobile logo */}
        <div className="mobile-logo" style={{
          display: 'none', /* shown via media query */
          alignItems: 'center', gap: 10, marginBottom: 36,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg,#0040A8,#0059F5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CalendarCheck style={{ width: 15, height: 15, color: '#fff' }} />
          </div>
          <span style={{ color: T.navy, fontWeight: 700, fontSize: 15, letterSpacing: '-0.01em' }}>
            BookingAdmin
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: 380 }}>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: T.navy, letterSpacing: '-0.03em', margin: '0 0 6px' }}>
              Sign in
            </h2>
            <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <InputField
              icon={Mail}
              label="Email"
              inputProps={{
                type: 'email', name: 'email',
                value: form.email, onChange: handleChange,
                placeholder: 'admin@example.com',
                disabled: loading, autoComplete: 'email',
              }}
            />

            <InputField
              icon={Lock}
              label="Password"
              right={
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: T.muted, display: 'flex', alignItems: 'center', padding: 0,
                    transition: 'color .15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = T.text2}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 15, height: 15 }} />
                    : <Eye    style={{ width: 15, height: 15 }} />}
                </button>
              }
              inputProps={{
                type: showPassword ? 'text' : 'password',
                name: 'password',
                value: form.password, onChange: handleChange,
                placeholder: '••••••••••',
                disabled: loading, autoComplete: 'current-password',
              }}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              style={{
                width: '100%', padding: '12px 20px', borderRadius: 12,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: loading
                  ? 'rgba(0,64,168,0.5)'
                  : btnHovered
                  ? `linear-gradient(135deg, #072971, #0040A8)`
                  : `linear-gradient(135deg, #0040A8, #0059F5)`,
                boxShadow: loading ? 'none'
                  : btnHovered ? '0 6px 20px rgba(0,64,168,0.40)'
                  : '0 4px 14px rgba(0,64,168,0.30)',
                transition: 'all .2s ease',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <Loader2 style={{ width: 15, height: 15, animation: 'spin .8s linear infinite' }} />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight style={{
                    width: 15, height: 15,
                    transform: btnHovered ? 'translateX(2px)' : 'translateX(0)',
                    transition: 'transform .2s ease',
                  }} />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 12, textAlign: 'center', color: T.muted, margin: 0 }}>
              Having trouble?{' '}
              <span
                style={{ color: T.brand, fontWeight: 600, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                Contact your administrator
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Responsive styles ────────────────────────────── */}
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }

        /* Stack vertically on mobile, side-by-side on lg+ */
        @media (min-width: 1024px) {
          .login-root  { flex-direction: row !important; }
          .login-left  { display: flex !important; width: 52%; }
          .mobile-logo { display: none !important; }
        }
        @media (max-width: 1023px) {
          .login-left  { display: none !important; }
          .mobile-logo { display: flex !important; }
        }

        /* Input placeholder color */
        input::placeholder { color: #A0BBCF; }
        input:disabled     { opacity: 0.55; cursor: not-allowed; }
      `}</style>
    </div>
  );
}