# IT Ticketing System - Documentation

## 📚 Documentation Index

### Getting Started
- **[README.md](./README.md)** - Project overview and features
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions

### Database
- **[database/schema.sql](./database/schema.sql)** - Full PostgreSQL database schema

### Project Structure

```
it-ticketing-system/
│
├── 📁 app/                          # Next.js app directory
│   ├── 📁 (dashboard)/              # Protected dashboard routes (grouped)
│   │   ├── layout.tsx               # Dashboard layout with sidebar
│   │   ├── 📁 dashboard/            # Main dashboard
│   │   ├── 📁 tickets/              # Ticket management
│   │   │   ├── page.tsx             # Tickets list
│   │   │   └── new/page.tsx         # Create ticket form
│   │   ├── 📁 devices/              # Device inventory management
│   │   ├── 📁 accessories/          # Accessory inventory
│   │   ├── 📁 maintenance/          # Maintenance logs
│   │   ├── 📁 reports/              # PDF reports generation
│   │   └── 📁 users/                # User management (admin only)
│   │
│   ├── 📁 login/                    # Login page
│   ├── 📁 register/                 # User registration
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Home page (redirects to dashboard)
│   └── globals.css                  # Global Tailwind styles
│
├── 📁 components/                   # Reusable React components
│   ├── Sidebar.tsx                  # Main navigation sidebar
│   └── 📁 dashboard/                # Dashboard-specific components
│       ├── DashboardStats.tsx       # Statistics cards
│       └── RecentTickets.tsx        # Recent tickets widget
│
├── 📁 lib/                          # Utility libraries and helpers
│   ├── 📁 supabase/                 # Supabase client configurations
│   │   ├── client.ts                # Browser client
│   │   └── server.ts                # Server component client
│   ├── 📁 utils/                    # Helper functions
│   │   ├── date.ts                  # Date formatting utilities
│   │   └── status.ts                # Status badge utilities
│   └── audit.ts                     # Audit logging functions
│
├── 📁 types/                        # TypeScript type definitions
│   └── database.ts                  # Database types matching schema
│
├── 📁 database/                     # Database files
│   └── schema.sql                   # Complete PostgreSQL schema
│
├── middleware.ts                    # Next.js middleware (auth protection)
├── package.json                     # Project dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── next.config.js                   # Next.js configuration
└── .env.example                     # Environment variables template
```

## 🗄️ Database Schema

### Tables Overview

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `profiles` | User accounts | Roles (admin/technician), active status |
| `tickets` | IT support tickets | Status, priority, assignments |
| `ticket_updates` | Ticket history | Notes, status changes |
| `devices` | Laptop inventory | Serial tracking, maintenance dates |
| `accessories` | Accessories stock | Quantity, location tracking |
| `maintenance_logs` | Device updates | Weekly maintenance records |
| `audit_logs` | System activity | Complete audit trail |

### Key Relationships

```
profiles (users)
  ├── tickets.created_by
  ├── tickets.assigned_to
  ├── maintenance_logs.technician_id
  └── audit_logs.user_id

tickets
  └── ticket_updates.ticket_id

devices
  └── maintenance_logs.device_id
```

## 🔐 Authentication & Security

### Authentication Flow
1. User registers → Supabase Auth creates user
2. Profile record created in `profiles` table
3. User logs in → Session token stored in cookies
4. Middleware validates token on protected routes
5. Logout clears session

### Row Level Security (RLS)
- ✅ Enabled on all tables
- Authenticated users can view most data
- Admins have full access
- Users can update own profiles
- Audit logs are read-only

### Role-Based Access
- **Administrator**: Full system access, user management
- **Technician**: Create/manage tickets, devices, maintenance

## 🎨 UI Components & Styling

### Design System
- **Colors**: Primary blue theme with status colors
- **Components**: Tailwind CSS utility classes
- **Icons**: Lucide React icons
- **Layout**: Responsive grid system

### Custom CSS Classes
```css
.btn              - Base button styles
.btn-primary      - Primary action button
.btn-secondary    - Secondary button
.btn-danger       - Destructive action
.input            - Form input styling
.card             - Card container
.badge            - Status badge
```

## 📊 Features Breakdown

### ✅ Implemented Features

1. **Authentication System**
   - Registration with email/password
   - Login with session management
   - Protected routes with middleware
   - Role-based access control

2. **Dashboard**
   - Real-time statistics
   - Ticket counts by status
   - Device counts by status
   - Recent tickets feed

3. **Ticketing System**
   - List all tickets
   - Create new tickets
   - Priority levels (Low/Medium/High)
   - Status tracking (Open/In Progress/Resolved/Closed)
   - Assignment to technicians
   - Automatic timestamps

4. **Inventory Management**
   - Device listing (laptops)
   - Accessory listing
   - Status tracking
   - Serial number management

5. **Maintenance Logs**
   - Device maintenance history
   - Update type categorization
   - Technician attribution

6. **Audit Logging**
   - Automatic logging of all actions
   - User attribution
   - Timestamp tracking
   - JSON detail storage

### 🚧 Pending Implementation

1. **Ticket Details Page**
   - View full ticket details
   - Add comments/updates
   - Change status/priority
   - Reassign tickets
   - View update history

2. **CRUD Operations**
   - Create/Edit/Delete devices
   - Create/Edit/Delete accessories
   - Create/Edit maintenance logs
   - Edit ticket assignments

3. **PDF Report Generation**
   - Weekly maintenance summary
   - Ticket status report
   - Inventory report
   - Custom date ranges

4. **Advanced Features**
   - Search and filtering
   - Bulk operations
   - Data visualization (charts)
   - Email notifications
   - File attachments
   - Export to CSV

5. **User Management**
   - Create users (admin only)
   - Edit user roles
   - Deactivate users
   - Password reset

## 🛠️ Development Guidelines

### Adding New Features

1. **Backend (Supabase)**
   - Add/modify tables in `database/schema.sql`
   - Update RLS policies if needed
   - Add indexes for performance

2. **Types**
   - Update `types/database.ts` with new interfaces
   - Keep types in sync with database schema

3. **Frontend**
   - Create page in appropriate `app/(dashboard)/` folder
   - Use existing components where possible
   - Follow Tailwind CSS patterns
   - Add to sidebar navigation if needed

4. **API/Data**
   - Use Supabase client from `lib/supabase/`
   - Add audit logging for important actions
   - Handle errors gracefully
   - Show loading states

### Code Style
- Use TypeScript for type safety
- Follow Next.js 15 app router patterns
- Use async/await for database operations
- Keep components small and focused
- Comment complex logic

## 📦 Dependencies

### Core
- `next` - Next.js framework
- `react` - React library
- `typescript` - Type safety

### Backend
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support

### UI
- `tailwindcss` - Utility-first CSS
- `lucide-react` - Icon library
- `recharts` - Charts (for future use)

### Utilities
- `date-fns` - Date formatting
- `jspdf` - PDF generation
- `jspdf-autotable` - PDF tables

## 🔍 Testing Checklist

Before deployment, verify:

- [ ] User registration works
- [ ] Login/logout works
- [ ] Dashboard loads with correct stats
- [ ] Can create tickets
- [ ] Tickets appear in list
- [ ] All navigation links work
- [ ] Admin can access Users page
- [ ] Technician cannot access Users page
- [ ] RLS policies prevent unauthorized access
- [ ] Audit logs are being created
- [ ] Mobile responsive design works

## 📈 Performance Considerations

- Database indexes on frequently queried columns
- Pagination for large lists (to be implemented)
- Image optimization (if avatars added)
- Bundle size monitoring
- Server-side rendering where appropriate

## 🔒 Security Best Practices

- ✅ Environment variables not committed
- ✅ Row Level Security enabled
- ✅ Authentication required for all routes
- ✅ HTTPS in production (Vercel default)
- ✅ SQL injection protected (Supabase client)
- ⚠️ Rate limiting (to be implemented)
- ⚠️ Input validation (to be enhanced)

## 📞 Support

For questions or issues:
1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Review [README.md](./README.md)
3. Check Supabase documentation
4. Contact development team

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Active Development
