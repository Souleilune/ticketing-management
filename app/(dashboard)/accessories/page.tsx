import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Package2, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, formatStatusText } from '@/lib/utils/status'
import Link from 'next/link'

export default async function AccessoriesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all accessories
  const { data: accessories, error } = await supabase
    .from('accessories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching accessories:', error)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Package2 className="h-9 w-9 text-primary-600" />
            Accessories
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Track and manage accessory inventory</p>
        </div>
        <Link href="/accessories/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Accessory
        </Link>
      </div>

      {/* Accessories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!accessories || accessories.length === 0 ? (
          <div className="col-span-full">
            <div className="empty-state">
              <Package2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">No accessories yet</h3>
              <p className="text-neutral-500 mb-6">Start tracking your accessory inventory</p>
              <Link href="/accessories/new" className="btn btn-primary inline-flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Accessory
              </Link>
            </div>
          </div>
        ) : (
          accessories.map((accessory) => {
            const stockStatus = 
              accessory.quantity === 0 
                ? 'out_of_stock' 
                : accessory.quantity <= (accessory.min_quantity || 5) 
                ? 'low_stock' 
                : 'available'
            
            return (
              <div key={accessory.id} className="card group cursor-pointer hover:shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package2 className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 text-lg">{accessory.name}</h3>
                      {accessory.location && (
                        <p className="text-xs text-neutral-500 mt-0.5">{accessory.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Quantity Display */}
                  <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                    <span className="text-sm font-medium text-neutral-600">Quantity</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-neutral-900">{accessory.quantity}</span>
                      {accessory.quantity > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-accent-500" />
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Status</span>
                    <span className={`badge ${getStatusColor(stockStatus)}`}>
                      {formatStatusText(stockStatus)}
                    </span>
                  </div>

                  {/* Last Updated */}
                  {accessory.updated_at && (
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                      <span>Last updated</span>
                      <span>{formatRelativeTime(accessory.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}