import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users as UsersIcon, Shield, UserCog, CheckCircle2, XCircle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'administrator') {
    redirect('/dashboard')
  }

  // Fetch all users
  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <UsersIcon className="h-9 w-9 text-primary-600" />
            User Management
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Manage system users and permissions</p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!users || users.length === 0 ? (
          <div className="col-span-full">
            <div className="empty-state">
              <UsersIcon className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">No users found</h3>
              <p className="text-neutral-500">Users will appear here once they register</p>
            </div>
          </div>
        ) : (
          users.map((userProfile) => (
            <div key={userProfile.id} className="card group cursor-pointer hover:shadow-2xl">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-lg ring-4 ring-white group-hover:scale-110 transition-transform">
                    <span className="text-xl font-bold text-white">
                      {userProfile.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 text-lg truncate mb-1">
                    {userProfile.full_name}
                  </h3>
                  
                  {/* Role Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    {userProfile.role === 'administrator' ? (
                      <>
                        <Shield className="h-4 w-4 text-primary-600" />
                        <span className="badge bg-primary-100 text-primary-700">
                          Administrator
                        </span>
                      </>
                    ) : (
                      <>
                        <UserCog className="h-4 w-4 text-secondary-600" />
                        <span className="badge bg-secondary-100 text-secondary-700">
                          Technician
                        </span>
                      </>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-3">
                    {userProfile.is_active ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-600 font-medium">Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm text-neutral-500 font-medium">Inactive</span>
                      </>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                    Joined {formatRelativeTime(userProfile.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Box */}
      <div className="mt-8 card bg-gradient-to-br from-secondary-50 to-white">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary-100 flex items-center justify-center">
            <Shield className="h-5 w-5 text-secondary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Role Permissions</h3>
            <div className="text-sm text-neutral-600 space-y-1">
              <p><strong>Administrator:</strong> Full system access, can manage users, tickets, devices, and all settings.</p>
              <p><strong>Technician:</strong> Can create and manage tickets, update devices, and log maintenance activities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}