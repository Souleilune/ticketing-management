import Link from 'next/link'
import { Ticket } from '@/types/database'
import { formatRelativeTime } from '@/lib/utils/date'
import { getStatusColor, getPriorityColor, formatStatusText } from '@/lib/utils/status'

interface RecentTicketsProps {
  tickets: Ticket[]
}

export default function RecentTickets({ tickets }: RecentTicketsProps) {
  if (tickets.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h2>
        <p className="text-gray-500 text-center py-8">No recent tickets</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tickets</h2>
        <Link href="/tickets" className="text-sm text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/tickets/${ticket.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{ticket.title}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {ticket.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {formatStatusText(ticket.status)}
                  </span>
                  <span className={`badge ${getPriorityColor(ticket.priority)}`}>
                    {formatStatusText(ticket.priority)}
                  </span>
                </div>
              </div>
              <div className="ml-4 text-right">
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(ticket.created_at)}
                </p>
                {ticket.assignee && (
                  <p className="mt-1 text-xs text-gray-600">
                    {ticket.assignee.full_name}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
