# IT Ticketing and Inventory Management System

A full-stack web application for managing IT support tickets, laptop/accessory inventory, and maintenance logs.

## Tech Stack

- **Frontend**: Next.js 15 (React 18) with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Deployment**: Vercel-ready

## Features

### ✅ Implemented
- 🔐 **Authentication** (Login/Register with Supabase Auth)
- 👥 **User Roles** (Administrator & Technician)
- 📊 **Dashboard** with real-time statistics
- 🎫 **Ticketing System** (Create, view, manage tickets)
- 💻 **Device Management** (Laptops tracking)
- 📦 **Accessory Inventory** (Mouse, keyboard, etc.)
- 🔧 **Maintenance Logs** (Weekly device updates)
- 📝 **Audit Logs** (Complete system activity tracking)
- 🎨 **Responsive UI** with Tailwind CSS

### 🚧 To Be Implemented
- Ticket detail page with update history
- Create/Edit forms for devices and accessories
- Maintenance log creation interface
- PDF report generation
- User management (admin only)
- Advanced filtering and search
- Charts and data visualization

## Project Structure

```
it-ticketing-system/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── dashboard/        # Main dashboard
│   │   ├── tickets/          # Ticket management
│   │   ├── devices/          # Device inventory
│   │   ├── accessories/      # Accessory inventory
│   │   ├── maintenance/      # Maintenance logs
│   │   ├── reports/          # PDF reports
│   │   └── users/            # User management (admin)
│   ├── login/                # Login page
│   ├── register/             # Registration page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page (redirects)
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── dashboard/            # Dashboard-specific components
├── lib/
│   ├── supabase/             # Supabase client utilities
│   ├── utils/                # Helper functions
│   └── audit.ts              # Audit logging functions
├── types/
│   └── database.ts           # TypeScript type definitions
├── database/
│   └── schema.sql            # Complete database schema
├── middleware.ts             # Auth middleware
└── README.md                 # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

### 1. Clone and Install

```bash
# Navigate to project directory
cd it-ticketing-system

# Install dependencies
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings** → **API**
3. Copy your project URL and anon key

### 3. Initialize Database

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `database/schema.sql`
3. Copy the entire content and paste into SQL Editor
4. Click **Run** to create all tables, indexes, and policies

### 4. Configure Environment Variables

```bash
# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Create First User

1. Navigate to `/register`
2. Create an account (will be created as 'technician' role by default)
3. To make yourself an admin:
   - Go to Supabase dashboard → **Table Editor** → **profiles**
   - Find your user and change `role` to `administrator`

## Database Schema Overview

### Core Tables

- **profiles** - User accounts with roles
- **tickets** - IT support tickets
- **ticket_updates** - Ticket history and notes
- **devices** - Laptop/computer inventory
- **accessories** - Computer accessories inventory
- **maintenance_logs** - Device maintenance history
- **audit_logs** - Complete system activity audit trail

### Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Audit logging for all major actions
- Secure authentication via Supabase

## Key Features Explained

### Ticketing System

- Create tickets with title, description, priority
- Assign to technicians
- Track status (Open → In Progress → Resolved → Closed)
- Priority levels (Low, Medium, High)
- Automatic timestamp tracking
- Update history

### Device Management

- Track laptops by serial number
- Assign to users/departments
- Monitor device status (Active, Maintenance, Retired)
- Link to maintenance logs
- Purchase date tracking

### Audit Logs

All significant actions are automatically logged:
- Ticket creation/updates
- Device changes
- User actions
- Login/logout events

## API Structure

The application uses Supabase's auto-generated REST API:

- All database operations via Supabase client
- Real-time subscriptions available
- Row-level security enforced
- Type-safe with TypeScript

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Environment Variables for Production

Add these in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## Capacity

System designed to handle:
- **20 tickets per day** (~600/month)
- **30 devices**
- **50 accessories**
- **30-40 users**

## Development Roadmap

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Basic dashboard
- ✅ Ticket listing
- ✅ Database schema

### Phase 2 (Next)
- ⬜ Complete ticket CRUD
- ⬜ Device/Accessory CRUD
- ⬜ Maintenance log interface
- ⬜ User management

### Phase 3
- ⬜ PDF report generation
- ⬜ Advanced search/filters
- ⬜ Charts and analytics
- ⬜ Email notifications

### Phase 4
- ⬜ File attachments
- ⬜ Bulk operations
- ⬜ Export capabilities
- ⬜ Mobile optimization

## Contributing

This is an internal IT system. For modifications:

1. Create a feature branch
2. Test thoroughly in development
3. Update documentation
4. Submit for review

## Troubleshooting

### Common Issues

**"Invalid API key"**
- Check `.env.local` has correct Supabase credentials
- Restart dev server after changing env variables

**"Table does not exist"**
- Run the `database/schema.sql` in Supabase SQL Editor
- Verify all tables created successfully

**Authentication errors**
- Clear browser cookies
- Check Supabase Auth settings
- Verify user exists in `profiles` table

**RLS policy errors**
- Ensure user has a profile record
- Check RLS policies in Supabase dashboard

## License

Internal use only. Proprietary software for company IT department.

## Support

For issues or questions, contact the development team.
