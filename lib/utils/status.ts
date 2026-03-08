import { TicketStatus, TicketPriority, DeviceStatus } from '@/types/database'

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Ticket statuses
    open: 'bg-amber-100 text-amber-700',
    in_progress: 'bg-primary-100 text-primary-700',
    resolved: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-neutral-200 text-neutral-700',
    
    // Device statuses
    active: 'bg-emerald-100 text-emerald-700',
    maintenance: 'bg-accent-100 text-accent-700',
    retired: 'bg-neutral-200 text-neutral-700',
    
    // Accessory statuses
    available: 'bg-emerald-100 text-emerald-700',
    low_stock: 'bg-amber-100 text-amber-700',
    out_of_stock: 'bg-accent-100 text-accent-700',
  }

  return statusColors[status] || 'bg-neutral-100 text-neutral-600'
}

export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    low: 'bg-secondary-100 text-secondary-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-accent-100 text-accent-700',
  }

  return priorityColors[priority] || 'bg-neutral-100 text-neutral-600'
}

export function formatStatusText(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}



