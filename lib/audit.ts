import { AuditAction } from '@/types/database'
import { SupabaseClient } from '@supabase/supabase-js'

export async function createAuditLog(
  supabase: SupabaseClient,
  {
    userId,
    action,
    entityType,
    entityId,
    details,
    ipAddress,
    userAgent,
  }: {
    userId?: string | null
    action: AuditAction
    entityType: string
    entityId?: string | null
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
  }
) {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ipAddress,
      user_agent: userAgent,
    })

    if (error) {
      console.error('Failed to create audit log:', error)
    }
  } catch (error) {
    console.error('Error creating audit log:', error)
  }
}

export async function getAuditLogs(
  supabase: SupabaseClient,
  options?: {
    userId?: string
    entityType?: string
    entityId?: string
    action?: AuditAction
    limit?: number
  }
) {
  let query = supabase
    .from('audit_logs')
    .select('*, user:profiles(*)')
    .order('created_at', { ascending: false })

  if (options?.userId) {
    query = query.eq('user_id', options.userId)
  }

  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType)
  }

  if (options?.entityId) {
    query = query.eq('entity_id', options.entityId)
  }

  if (options?.action) {
    query = query.eq('action', options.action)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}
