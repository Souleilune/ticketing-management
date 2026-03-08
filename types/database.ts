// Database types matching the PostgreSQL schema

export type UserRole = 'administrator' | 'technician';

export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type DeviceStatus = 'active' | 'maintenance' | 'retired';

export type UpdateType = 
  | 'software_update' 
  | 'issue_detection' 
  | 'repair' 
  | 'hardware_replacement'
  | 'routine_maintenance';

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete'
  | 'login' 
  | 'logout'
  | 'ticket_created' 
  | 'ticket_updated' 
  | 'ticket_assigned' 
  | 'ticket_resolved'
  | 'device_added' 
  | 'device_updated' 
  | 'device_retired'
  | 'maintenance_logged'
  | 'user_created' 
  | 'user_updated' 
  | 'user_deactivated';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  created_by: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  // Joined fields
  creator?: Profile;
  assignee?: Profile;
}

export interface TicketUpdate {
  id: string;
  ticket_id: string;
  user_id: string | null;
  note: string;
  old_status?: TicketStatus | null;
  new_status?: TicketStatus | null;
  created_at: string;
  // Joined fields
  user?: Profile;
}

export interface Device {
  id: string;
  device_name: string;
  model: string;
  serial_number: string;
  assigned_user?: string | null;
  assigned_department?: string | null;
  status: DeviceStatus;
  last_maintenance_date?: string | null;
  purchase_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Accessory {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  storage_location?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceLog {
  id: string;
  device_id: string;
  technician_id: string | null;
  description: string;
  update_type: UpdateType;
  performed_at: string;
  notes?: string | null;
  created_at: string;
  // Joined fields
  device?: Device;
  technician?: Profile;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: AuditAction;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, any> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
  // Joined fields
  user?: Profile;
}

// Dashboard statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  devicesUnderMaintenance: number;
  totalDevices: number;
  totalAccessories: number;
  recentTickets: Ticket[];
  recentMaintenanceLogs: MaintenanceLog[];
}

// Form types for creating/updating records
export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  assigned_to?: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  priority?: TicketPriority;
  status?: TicketStatus;
  assigned_to?: string;
}

export interface CreateDeviceInput {
  device_name: string;
  model: string;
  serial_number: string;
  assigned_user?: string;
  assigned_department?: string;
  status?: DeviceStatus;
  purchase_date?: string;
  notes?: string;
}

export interface CreateAccessoryInput {
  item_name: string;
  category: string;
  quantity: number;
  storage_location?: string;
  notes?: string;
}

export interface CreateMaintenanceLogInput {
  device_id: string;
  description: string;
  update_type: UpdateType;
  performed_at: string;
  notes?: string;
}
