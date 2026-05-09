'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Clock, Briefcase, Users,
  Settings, Menu, X, ChevronRight, Bell
} from 'lucide-react'
import { ListChecks } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/availability', label: 'Availability', icon: Clock },
  { href: '/admin/services', label: 'Services', icon: Briefcase },
  { href: '/admin/fields', label: 'Booking Fields', icon: ListChecks },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href) && href !== '/admin'
  }

  return (
    <div className="min-h-screen bg-[#f7f7f2] font-app-sans">
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 border-none lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-[#e8e8e0] [box-shadow:4px_0_24px_rgba(0,64,168,0.04)] transition-all duration-300 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${
          sidebarOpen ? 'w-[260px]' : 'w-[72px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-[#e8e8e0] min-h-[72px]">
          <div className="w-9 h-9 rounded-[10px] bg-[#0040A8] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base">A</span>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="m-0 font-app-sans font-bold text-[15px] text-[#1a1a2e] leading-tight">Akbar Tax</p>
              <p className="m-0 text-[11px] text-[#6b7280] font-medium">Admin Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto border-none bg-transparent cursor-pointer text-[#6b7280] p-1 rounded-md flex items-center hover:bg-[#e8f0fe] transition-colors"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-1 cursor-pointer transition-all duration-200 ${
                    active
                      ? 'bg-[#0040A8] text-white'
                      : 'text-[#6b7280] hover:bg-[#e8f0fe] hover:text-[#0040A8]'
                  }`}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className={`text-sm flex-1 ${active ? 'font-semibold' : 'font-normal'}`}>
                        {item.label}
                      </span>
                      {active && <ChevronRight size={14} />}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-[#e8e8e0]">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton />
            {sidebarOpen && (
              <div>
                <p className="m-0 text-[13px] font-semibold text-[#1a1a2e]">Admin</p>
                <p className="m-0 text-[11px] text-[#6b7280]">Akbar Tax Store</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-[260px]' : 'lg:ml-[72px]'
        }`}
      >
        {/* Top bar */}
        <div className="bg-white border-b border-[#e8e8e0] px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden border border-[#e8e8e0] rounded-[10px] p-[9px] bg-transparent cursor-pointer text-[#6b7280] flex items-center hover:bg-[#f8f9ff] transition-colors"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="m-0 text-base sm:text-lg font-bold text-[#1a1a2e] font-app-sans truncate">
              {navItems.find(n => isActive(n.href, n.exact))?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="border border-[#e8e8e0] rounded-[10px] p-[9px] bg-transparent cursor-pointer text-[#6b7280] flex items-center hover:bg-[#f8f9ff] transition-colors">
              <Bell size={18} />
            </button>
            <Link href="/booking" target="_blank">
              <button className="bg-[#0040A8] text-white border-none rounded-[10px] px-3 sm:px-[18px] py-2 text-xs sm:text-[13px] font-semibold cursor-pointer hover:bg-[#002d7a] transition-colors">
                <span className="hidden sm:inline">View Booking Page</span>
                <span className="sm:hidden">Booking Page</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
