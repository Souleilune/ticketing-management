'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  TicketCheck, 
  Laptop, 
  Settings, 
  FileBarChart, 
  Users, 
  LogOut,
  Package2,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/types/database'

interface SidebarProps {
  profile: Profile
}

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', href: '/tickets', icon: TicketCheck },
    { name: 'Devices', href: '/devices', icon: Laptop },
    { name: 'Accessories', href: '/accessories', icon: Package2 },
    { name: 'Maintenance', href: '/maintenance', icon: Settings },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
  ]

  if (profile.role === 'administrator') {
    navigation.push({ name: 'Users', href: '/users', icon: Users })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-white via-primary-50/30 to-secondary-50/30 backdrop-blur-xl shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-white" />
          <h1 className="text-lg font-bold text-white">ThinkSafe Hub</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-5 bg-gradient-to-br from-white/80 to-primary-50/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-md ring-2 ring-white">
              <span className="text-base font-bold text-white">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 truncate">{profile.full_name}</p>
            <p className="text-xs text-neutral-600 capitalize font-medium">{profile.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                sidebar-link
                ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200/50">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-neutral-600 rounded-xl hover:bg-accent-50 hover:text-accent-700 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )
}