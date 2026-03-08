import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { TicketCheck, ArrowRight, Clock } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, getPriorityColor, formatStatusText } from '@/lib/utils/status'

export default async function RecentTickets() {
  const supabase = await createClient()

  const { data: tickets } = await supabase
    .from('tickets')
    .select(`
      *,
      creator:created_by(full_name),
      assignee:assigned_to(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  if (!tickets || tickets.length === 0) {
    return (
      <div className="card">
        <div className="empty-state py-12">
          <TicketCheck className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">No recent tickets</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Recent Tickets</h3>
        <Link 
          href="/tickets" 
          className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <TicketCheck className="h-4 w-4 text-primary-600 flex-shrink-0" />
                  <h4 className="font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
                    {ticket.title}
                  </h4>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-1 mb-2">
                  {ticket.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {formatStatusText(ticket.status)}
                  </span>
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                    {formatStatusText(ticket.priority)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <Clock className="h-3.5 w-3.5" />
                    {formatRelativeTime(ticket.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                  <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}