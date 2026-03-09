'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageSquarePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createAuditLog } from '@/lib/audit'

interface TicketUpdateFormProps {
  ticketId: string
  currentUserId: string
}

export default function TicketUpdateForm({ ticketId, currentUserId }: TicketUpdateFormProps) {
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!note.trim()) {
      setError('Please enter a comment')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Insert ticket update
      const { error: updateError } = await supabase
        .from('ticket_updates')
        .insert({
          ticket_id: ticketId,
          user_id: currentUserId,
          note: note.trim(),
          old_status: null,
          new_status: null
        })

      if (updateError) throw updateError

      // Update ticket's updated_at timestamp
      await supabase
        .from('tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId)

      // Log audit trail
      await createAuditLog(supabase, {
        userId: currentUserId,
        action: 'ticket_updated',
        entityType: 'ticket',
        entityId: ticketId,
        details: { action: 'comment_added' }
      })

      // Reset form
      setNote('')
      
      // Refresh the page to show new comment
      router.refresh()
    } catch (err: any) {
      console.error('Error adding comment:', err)
      setError(err.message || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
        <MessageSquarePlus className="h-5 w-5 text-red-600" />
        Add Comment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-neutral-700 mb-2">
            Your Comment
          </label>
          <textarea
            id="note"
            rows={4}
            className="input"
            placeholder="Add a comment or update about this ticket..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
          />
          <p className="mt-1 text-xs text-neutral-500">
            Add notes, updates, or progress on this ticket
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !note.trim()}
            className="btn btn-primary"
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  )
}