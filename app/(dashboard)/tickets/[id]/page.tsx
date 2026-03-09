import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, TicketCheck, Clock, User, AlertCircle } from 'lucide-react'
import { formatDateTime, formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, getPriorityColor, formatStatusText } from '@/lib/utils/status'
import TicketUpdateForm from '@/components/tickets/TicketUpdateForm'
import TicketStatusForm from '@/components/tickets/TicketStatusForm'

interface TicketDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get current user profile
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch ticket with creator and assignee info
  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:created_by(id, full_name, email),
      assignee:assigned_to(id, full_name, email)
    `)
    .eq('id', id)
    .single()

  if (ticketError || !ticket) {
    notFound()
  }

  // Fetch all ticket updates
  const { data: updates } = await supabase
    .from('ticket_updates')
    .select(`
      *,
      user:user_id(full_name, email)
    `)
    .eq('ticket_id', id)
    .order('created_at', { ascending: false })

  // Fetch all technicians for assignment dropdown
  const { data: technicians } = await supabase
    .from('profiles')
    .select('*')
    .eq('is_active', true)
    .order('full_name')

  return (
    <div className="min-h-screen p-8">
      {/* Back Navigation */}
      <Link
        href="/tickets"
        className="inline-flex items-center text-sm text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tickets
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Ticket Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Header */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <TicketCheck className="h-6 w-6 text-red-600" />
                  <h1 className="text-2xl font-bold text-neutral-900">{ticket.title}</h1>
                </div>
                <p className="text-sm text-neutral-500">
                  Created {formatRelativeTime(ticket.created_at)} by {ticket.creator?.full_name}
                </p>
              </div>
            </div>

            {/* Status and Priority Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`badge ${getStatusColor(ticket.status)}`}>
                {formatStatusText(ticket.status)}
              </span>
              <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                {formatStatusText(ticket.priority)} Priority
              </span>
            </div>

            {/* Description */}
            <div className="bg-neutral-50 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">Description</h3>
              <p className="text-neutral-800 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Ticket Updates / Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Activity Timeline</h2>
            
            {(!updates || updates.length === 0) ? (
              <div className="text-center py-8 text-neutral-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                <p className="text-sm">No updates yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {updates.map((update, index) => (
                  <div
                    key={update.id}
                    className="relative pl-8 pb-6 border-l-2 border-neutral-200 last:border-l-0 last:pb-0"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-red-600 ring-4 ring-white" />
                    
                    <div className="bg-neutral-50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-neutral-400" />
                          <span className="text-sm font-semibold text-neutral-900">
                            {update.user?.full_name || 'Unknown User'}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          {formatRelativeTime(update.created_at)}
                        </span>
                      </div>

                      {/* Status Change Indicator */}
                      {update.old_status && update.new_status && (
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          <span className={`badge ${getStatusColor(update.old_status)}`}>
                            {formatStatusText(update.old_status)}
                          </span>
                          <span className="text-neutral-400">→</span>
                          <span className={`badge ${getStatusColor(update.new_status)}`}>
                            {formatStatusText(update.new_status)}
                          </span>
                        </div>
                      )}

                      {/* Note/Comment */}
                      <p className="text-sm text-neutral-700 whitespace-pre-wrap">{update.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Update Form */}
          <TicketUpdateForm ticketId={ticket.id} currentUserId={user.id} />
        </div>

        {/* Sidebar - Ticket Info & Actions */}
        <div className="space-y-6">
          {/* Quick Info Card */}
          <div className="card">
            <h3 className="text-sm font-semibold text-neutral-700 mb-4">Ticket Information</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</label>
                <p className="mt-1">
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {formatStatusText(ticket.status)}
                  </span>
                </p>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Priority</label>
                <p className="mt-1">
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                    {formatStatusText(ticket.priority)}
                  </span>
                </p>
              </div>

              {/* Assigned To */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Assigned To</label>
                <p className="mt-1 text-sm text-neutral-900">
                  {ticket.assignee?.full_name || 'Unassigned'}
                </p>
                {ticket.assignee?.email && (
                  <p className="text-xs text-neutral-500">{ticket.assignee.email}</p>
                )}
              </div>

              {/* Created By */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Created By</label>
                <p className="mt-1 text-sm text-neutral-900">{ticket.creator?.full_name}</p>
                {ticket.creator?.email && (
                  <p className="text-xs text-neutral-500">{ticket.creator.email}</p>
                )}
              </div>

              {/* Created At */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Created</label>
                <p className="mt-1 text-sm text-neutral-900">{formatDateTime(ticket.created_at)}</p>
              </div>

              {/* Updated At */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Last Updated</label>
                <p className="mt-1 text-sm text-neutral-900">{formatDateTime(ticket.updated_at)}</p>
              </div>

              {/* Resolved At */}
              {ticket.resolved_at && (
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">Resolved</label>
                  <p className="mt-1 text-sm text-neutral-900">{formatDateTime(ticket.resolved_at)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <TicketStatusForm 
            ticket={ticket} 
            technicians={technicians || []}
            currentUserRole={currentProfile?.role || 'technician'}
          />
        </div>
      </div>
    </div>
  )
}