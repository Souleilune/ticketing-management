import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Settings, Plus, Laptop, User, Calendar } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'
import Link from 'next/link'

export default async function MaintenancePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all maintenance logs with related data
  const { data: logs, error } = await supabase
    .from('maintenance_logs')
    .select(`
      *,
      device:device_id(device_name, model),
      technician:technician_id(full_name)
    `)
    .order('performed_at', { ascending: false })

  if (error) {
    console.error('Error fetching maintenance logs:', error)
  }

  const getUpdateTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      software: 'bg-secondary-100 text-secondary-700',
      hardware: 'bg-purple-100 text-purple-700',
      cleaning: 'bg-emerald-100 text-emerald-700',
      inspection: 'bg-amber-100 text-amber-700',
      repair: 'bg-accent-100 text-accent-700',
    }
    return colors[type] || 'bg-neutral-100 text-neutral-700'
  }

  const getUpdateTypeIcon = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Settings className="h-9 w-9 text-primary-600" />
            Maintenance Logs
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Track device maintenance and service history</p>
        </div>
        <Link href="/maintenance/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Log Maintenance
        </Link>
      </div>

      {/* Maintenance Timeline */}
      <div className="card">
        {!logs || logs.length === 0 ? (
          <div className="empty-state">
            <Settings className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No maintenance logs yet</h3>
            <p className="text-neutral-500 mb-6">Start tracking device maintenance activities</p>
            <Link href="/maintenance/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Log
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div key={log.id} className="relative">
                {/* Timeline connector */}
                {index !== logs.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 to-transparent"></div>
                )}
                
                <div className="flex gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all duration-200">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center shadow-md">
                      <Settings className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Laptop className="h-4 w-4 text-neutral-500" />
                          <h3 className="font-semibold text-neutral-900">
                            {log.device?.device_name || 'Unknown Device'}
                          </h3>
                          {log.device?.model && (
                            <span className="text-sm text-neutral-500">• {log.device.model}</span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 mt-1">{log.notes || 'No notes provided'}</p>
                      </div>
                      <span className={`badge ${getUpdateTypeColor(log.update_type)} flex-shrink-0`}>
                        {getUpdateTypeIcon(log.update_type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        <span>{log.technician?.full_name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatRelativeTime(log.performed_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}