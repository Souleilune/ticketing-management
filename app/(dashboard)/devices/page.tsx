import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Laptop, Plus, Calendar } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, formatStatusText } from '@/lib/utils/status'
import Link from 'next/link'

export default async function DevicesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all devices
  const { data: devices, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching devices:', error)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Laptop className="h-9 w-9 text-primary-600" />
            Devices
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Manage device inventory and track maintenance</p>
        </div>
        <Link href="/devices/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Device
        </Link>
      </div>

      {/* Devices List */}
      <div className="card">
        {!devices || devices.length === 0 ? (
          <div className="empty-state">
            <Laptop className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No devices yet</h3>
            <p className="text-neutral-500 mb-6">Start tracking your device inventory</p>
            <Link href="/devices/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Device
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="table-header">Device</th>
                  <th className="table-header">Model</th>
                  <th className="table-header">Serial Number</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Last Maintenance</th>
                  <th className="table-header">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {devices.map((device) => (
                  <tr key={device.id} className="table-row">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                          <Laptop className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">{device.device_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-700">{device.model || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">
                        {device.serial_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusColor(device.status)}`}>
                        {formatStatusText(device.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {device.last_maintenance ? (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Calendar className="h-4 w-4" />
                          {formatRelativeTime(device.last_maintenance)}
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">Never</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatRelativeTime(device.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}