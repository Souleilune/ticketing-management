'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createAuditLog } from '@/lib/audit'
import { Ticket, Profile } from '@/types/database'

interface TicketStatusFormProps {
  ticket: Ticket & {
    creator: Profile | null
    assignee: Profile | null
  }
  technicians: Profile[]
  currentUserRole: string
}

export default function TicketStatusForm({ ticket, technicians, currentUserRole }: TicketStatusFormProps) {
  const [status, setStatus] = useState(ticket.status)
  const [priority, setPriority] = useState(ticket.priority)
  const [assignedTo, setAssignedTo] = useState(ticket.assigned_to || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const hasChanges = 
    status !== ticket.status || 
    priority !== ticket.priority || 
    assignedTo !== (ticket.assigned_to || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const oldStatus = ticket.status
      const statusChanged = status !== oldStatus

      // Update ticket
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          status,
          priority,
          assigned_to: assignedTo || null,
        })
        .eq('id', ticket.id)

      if (updateError) throw updateError

      // If status changed, create a ticket update entry
      if (statusChanged) {
        await supabase
          .from('ticket_updates')
          .insert({
            ticket_id: ticket.id,
            user_id: user.id,
            note: `Status changed from ${oldStatus} to ${status}`,
            old_status: oldStatus,
            new_status: status
          })
      }

      // Log audit trail
      const changes: any = {}
      if (statusChanged) changes.status = { from: oldStatus, to: status }
      if (priority !== ticket.priority) changes.priority = { from: ticket.priority, to: priority }
      if (assignedTo !== ticket.assigned_to) changes.assigned_to = { from: ticket.assigned_to, to: assignedTo }

      await createAuditLog(supabase, {
        userId: user.id,
        action: 'ticket_updated',
        entityType: 'ticket',
        entityId: ticket.id,
        details: { changes }
      })

      setSuccess(true)
      
      // Refresh the page to show updates
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error updating ticket:', err)
      setError(err.message || 'Failed to update ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Manage Ticket
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm text-green-800">✓ Ticket updated successfully</p>
          </div>
        )}

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-xs font-medium text-neutral-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="input text-sm"
            disabled={loading}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-xs font-medium text-neutral-700 mb-2">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="input text-sm"
            disabled={loading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Assign To */}
        <div>
          <label htmlFor="assignedTo" className="block text-xs font-medium text-neutral-700 mb-2">
            Assign To
          </label>
          <select
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="input text-sm"
            disabled={loading}
          >
            <option value="">Unassigned</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !hasChanges}
          className="w-full btn btn-primary text-sm"
        >
          {loading ? 'Updating...' : 'Update Ticket'}
        </button>

        {!hasChanges && (
          <p className="text-xs text-center text-neutral-500">
            Make changes to enable update
          </p>
        )}
      </form>
    </div>
  )
}