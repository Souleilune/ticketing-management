import { createClient } from '@/lib/supabase/server'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentTickets from '@/components/dashboard/RecentTickets'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [
    { count: totalTickets },
    { count: openTickets },
    { count: inProgressTickets },
    { count: resolvedTickets },
    { count: totalDevices },
    { count: devicesUnderMaintenance },
    { data: recentTickets },
  ] = await Promise.all([
    supabase.from('tickets').select('*', { count: 'exact', head: true }),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
    supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['resolved', 'closed']),
    supabase.from('devices').select('*', { count: 'exact', head: true }),
    supabase.from('devices').select('*', { count: 'exact', head: true }).eq('status', 'maintenance'),
    supabase
      .from('tickets')
      .select(`
        *,
        creator:profiles!tickets_created_by_fkey(id, full_name, email),
        assignee:profiles!tickets_assigned_to_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = {
    totalTickets: totalTickets || 0,
    openTickets: openTickets || 0,
    inProgressTickets: inProgressTickets || 0,
    resolvedTickets: resolvedTickets || 0,
    totalDevices: totalDevices || 0,
    devicesUnderMaintenance: devicesUnderMaintenance || 0,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the IT Ticketing System</p>
      </div>

      <div className="space-y-8">
        <DashboardStats stats={stats} />
        <RecentTickets tickets={recentTickets || []} />
      </div>
    </div>
  )
}
