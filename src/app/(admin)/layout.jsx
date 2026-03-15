// src/app/(admin)/layout.jsx
import { redirect }         from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@/lib/auth';
import AdminSidebar         from '@/app/components/admin/AdminSidebar';
import AdminHeader          from '@/app/components/admin/AdminHeader';

export const metadata = {
  title: { template: '%s | Admin Dashboard', default: 'Admin Dashboard' },
};

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'STAFF'];
  if (!allowedRoles.includes(session.user.role)) redirect('/login');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',   // stacking context for mobile drawer z-index
      background: '#F0F5FF',
    }}>
      <AdminSidebar user={session.user} />

      {/* Main column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,          // prevents flex child from overflowing
        overflow: 'hidden',
      }}>
        <AdminHeader user={session.user} />

        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'clamp(1rem, 3vw, 2rem)',
          background: 'linear-gradient(160deg,#F0F5FF 0%,#F8FBFF 60%,#EEF4FF 100%)',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}