import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentTickets from '@/components/dashboard/RecentTickets'
import { Activity } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch statistics
  const { data: tickets } = await supabase
    .from('tickets')
    .select('status')

  const { data: devices } = await supabase
    .from('devices')
    .select('status')

  const stats = {
    totalTickets: tickets?.length || 0,
    openTickets: tickets?.filter(t => t.status === 'open').length || 0,
    inProgressTickets: tickets?.filter(t => t.status === 'in_progress').length || 0,
    resolvedTickets: tickets?.filter(t => t.status === 'resolved').length || 0,
    totalDevices: devices?.length || 0,
    devicesUnderMaintenance: devices?.filter(d => d.status === 'maintenance').length || 0,
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Activity className="h-9 w-9 text-primary-600" />
            Dashboard
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="section-title">Recent Activity</h2>
        <RecentTickets />
      </div>
    </div>
  )
}