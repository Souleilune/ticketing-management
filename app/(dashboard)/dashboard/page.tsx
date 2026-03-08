import { createClient } from '@/lib/supabase/server'
import DashboardStats from '@/components/dashboard/DashboardStats'
import RecentTickets from '@/components/dashboard/RecentTickets'

export default async function DashboardPage() {
  const supabase = await createClient()

  try {
    // Fetch dashboard statistics with error handling
    const [
      ticketsResult,
      openResult,
      inProgressResult,
      resolvedResult,
      devicesResult,
      maintenanceResult,
      recentResult,
    ] = await Promise.all([
      supabase.from('tickets').select('*', { count: 'exact', head: true }),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).in('status', ['resolved', 'closed']),
      supabase.from('devices').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }).eq('status', 'maintenance'),
      supabase
        .from('tickets')
        .select('*, created_by, assigned_to')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

    const stats = {
      totalTickets: ticketsResult.count || 0,
      openTickets: openResult.count || 0,
      inProgressTickets: inProgressResult.count || 0,
      resolvedTickets: resolvedResult.count || 0,
      totalDevices: devicesResult.count || 0,
      devicesUnderMaintenance: maintenanceResult.count || 0,
    }

    // Fetch user profiles for recent tickets if they exist
    const recentTickets = recentResult.data || []
    
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Think Safe IT Service Hub</p>
        </div>

        <div className="space-y-8">
          <DashboardStats stats={stats} />
          <RecentTickets tickets={recentTickets} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Think Safe IT Service Hub</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Loading Dashboard</h3>
          <p className="text-yellow-700">Setting up your dashboard. This may take a moment...</p>
          <pre className="mt-4 text-xs text-gray-600 overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      </div>
    )
  }
}