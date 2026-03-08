import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TicketCheck, Plus, Eye } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, getPriorityColor, formatStatusText } from '@/lib/utils/status'

export default async function TicketsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all tickets with creator and assignee info
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:created_by(full_name),
      assignee:assigned_to(full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tickets:', error)
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <TicketCheck className="h-9 w-9 text-primary-600" />
            Tickets
          </h1>
          <p className="text-neutral-600 mt-2 text-sm">Manage all support tickets and requests</p>
        </div>
        <Link href="/tickets/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          New Ticket
        </Link>
      </div>

      {/* Tickets List */}
      <div className="card">
        {!tickets || tickets.length === 0 ? (
          <div className="empty-state">
            <TicketCheck className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">No tickets yet</h3>
            <p className="text-neutral-500 mb-6">Create your first ticket to get started</p>
            <Link href="/tickets/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr>
                  <th className="table-header">Ticket</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Assignee</th>
                  <th className="table-header">Created</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{ticket.title}</p>
                        <p className="text-sm text-neutral-500 line-clamp-1 mt-1">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusColor(ticket.status)}`}>
                        {formatStatusText(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                        {formatStatusText(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-700">
                        {ticket.assignee?.full_name || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {formatRelativeTime(ticket.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
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