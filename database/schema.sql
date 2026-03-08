-- =============================================
-- IT Ticketing System - Database Schema
-- PostgreSQL + Supabase
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('administrator', 'technician');

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'technician',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TICKETING SYSTEM
-- =============================================

-- Ticket priority enum
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high');

-- Ticket status enum
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority NOT NULL DEFAULT 'medium',
    status ticket_status NOT NULL DEFAULT 'open',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Ticket updates/notes table
CREATE TABLE ticket_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    old_status ticket_status,
    new_status ticket_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVENTORY MANAGEMENT
-- =============================================

-- Device status enum
CREATE TYPE device_status AS ENUM ('active', 'maintenance', 'retired');

-- Laptops/Devices table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_name TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT UNIQUE NOT NULL,
    assigned_user TEXT,
    assigned_department TEXT,
    status device_status NOT NULL DEFAULT 'active',
    last_maintenance_date DATE,
    purchase_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accessories table
CREATE TABLE accessories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL, -- mouse, keyboard, charger, monitor, etc.
    quantity INTEGER NOT NULL DEFAULT 0,
    storage_location TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- MAINTENANCE & DEVICE UPDATES
-- =============================================

-- Update type enum
CREATE TYPE update_type AS ENUM ('software_update', 'issue_detection', 'repair', 'hardware_replacement', 'routine_maintenance');

-- Device maintenance logs
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    update_type update_type NOT NULL,
    performed_at DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AUDIT LOGS
-- =============================================

-- Action type enum
CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete',
    'login', 'logout',
    'ticket_created', 'ticket_updated', 'ticket_assigned', 'ticket_resolved',
    'device_added', 'device_updated', 'device_retired',
    'maintenance_logged',
    'user_created', 'user_updated', 'user_deactivated'
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action audit_action NOT NULL,
    entity_type TEXT NOT NULL, -- 'ticket', 'device', 'user', etc.
    entity_id UUID,
    details JSONB, -- Store additional context
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Tickets indexes
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_created_by ON tickets(created_by);
CREATE INDEX idx_tickets_created_at ON tickets(created_at DESC);

-- Ticket updates indexes
CREATE INDEX idx_ticket_updates_ticket_id ON ticket_updates(ticket_id);
CREATE INDEX idx_ticket_updates_created_at ON ticket_updates(created_at DESC);

-- Devices indexes
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_serial_number ON devices(serial_number);
CREATE INDEX idx_devices_assigned_department ON devices(assigned_department);

-- Maintenance logs indexes
CREATE INDEX idx_maintenance_logs_device_id ON maintenance_logs(device_id);
CREATE INDEX idx_maintenance_logs_technician_id ON maintenance_logs(technician_id);
CREATE INDEX idx_maintenance_logs_performed_at ON maintenance_logs(performed_at DESC);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accessories_updated_at BEFORE UPDATE ON accessories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically set resolved_at when ticket is resolved
CREATE OR REPLACE FUNCTION set_ticket_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('resolved', 'closed') AND OLD.status NOT IN ('resolved', 'closed') THEN
        NEW.resolved_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_status_resolved BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION set_ticket_resolved_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Administrators can manage all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );

-- Tickets policies (all authenticated users can read and create)
CREATE POLICY "Authenticated users can view tickets" ON tickets
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create tickets" ON tickets
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update tickets" ON tickets
    FOR UPDATE USING (
        auth.uid() = created_by OR 
        auth.uid() = assigned_to OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrator')
    );

CREATE POLICY "Administrators can delete tickets" ON tickets
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrator')
    );

-- Ticket updates policies
CREATE POLICY "Authenticated users can view ticket updates" ON ticket_updates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create ticket updates" ON ticket_updates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Devices policies
CREATE POLICY "Authenticated users can view devices" ON devices
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage devices" ON devices
    FOR ALL USING (auth.role() = 'authenticated');

-- Accessories policies
CREATE POLICY "Authenticated users can view accessories" ON accessories
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage accessories" ON accessories
    FOR ALL USING (auth.role() = 'authenticated');

-- Maintenance logs policies
CREATE POLICY "Authenticated users can view maintenance logs" ON maintenance_logs
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create maintenance logs" ON maintenance_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Audit logs policies (read-only for all, system writes)
CREATE POLICY "Authenticated users can view audit logs" ON audit_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- SEED DATA (Optional - for testing)
-- =============================================

-- Note: After creating your first user through Supabase Auth UI,
-- you need to insert a profile record manually or through a trigger.
-- Example:
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('your-user-uuid', 'admin@example.com', 'Admin User', 'administrator');
