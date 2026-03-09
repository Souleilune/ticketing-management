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
  Package2
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
    <div className="flex flex-col h-screen w-64 bg-neutral-900 shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-4 bg-red-600 shadow-lg">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-white">ThinkSafe Hub</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-5 bg-neutral-800 border-b border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-11 w-11 rounded-full bg-secondary-500 flex items-center justify-center shadow-md ring-2 ring-secondary-600">
              <span className="text-base font-bold text-white">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile.full_name}</p>
            <p className="text-xs text-neutral-400 capitalize font-medium">{profile.role}</p>
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
                ${isActive ? 'bg-primary-600 text-white shadow-md' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'}
              `}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-neutral-700 bg-neutral-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-neutral-300 hover:text-white hover:bg-primary-600 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}