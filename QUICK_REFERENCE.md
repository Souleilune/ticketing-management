# IT Ticketing System - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🌐 URLs (Development)

- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard
- **Tickets**: http://localhost:3000/tickets
- **Devices**: http://localhost:3000/devices
- **Accessories**: http://localhost:3000/accessories
- **Maintenance**: http://localhost:3000/maintenance
- **Reports**: http://localhost:3000/reports
- **Users** (Admin): http://localhost:3000/users

## 🔑 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Tables

1. **profiles** - Users
2. **tickets** - Support tickets
3. **ticket_updates** - Ticket history
4. **devices** - Laptops
5. **accessories** - Computer accessories
6. **maintenance_logs** - Device updates
7. **audit_logs** - Activity tracking

## 👥 User Roles

- **administrator** - Full access, user management
- **technician** - Tickets, devices, maintenance

## 🎫 Ticket Statuses

- `open` - Newly created
- `in_progress` - Being worked on
- `resolved` - Issue fixed
- `closed` - Archived

## ⚡ Priority Levels

- `low` - Can wait
- `medium` - Normal urgency
- `high` - Urgent attention needed

## 💻 Device Statuses

- `active` - In use
- `maintenance` - Being serviced
- `retired` - No longer in use

## 🛠️ Maintenance Types

- `software_update` - OS/app updates
- `issue_detection` - Problem found
- `repair` - Hardware fix
- `hardware_replacement` - Part replaced
- `routine_maintenance` - Regular checkup

## 📁 Key Files

| File | Purpose |
|------|---------|
| `database/schema.sql` | Complete DB schema |
| `types/database.ts` | TypeScript types |
| `middleware.ts` | Auth protection |
| `lib/supabase/client.ts` | Browser client |
| `lib/supabase/server.ts` | Server client |
| `components/Sidebar.tsx` | Navigation |
| `.env.local` | Your secrets (don't commit!) |

## 🔧 Common Tasks

### Create First Admin User
1. Register at `/register`
2. Go to Supabase → profiles table
3. Change role to `administrator`
4. Refresh browser

### Add Sample Ticket
```sql
-- In Supabase SQL Editor
INSERT INTO tickets (title, description, priority, status, created_by)
VALUES (
  'Printer not working',
  'Office printer shows error message',
  'high',
  'open',
  'your-user-id-here'
);
```

### Add Sample Device
```sql
INSERT INTO devices (device_name, model, serial_number, status)
VALUES ('Dell Laptop #1', 'Latitude 5420', 'SN123456', 'active');
```

### View Audit Logs
```sql
SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10;
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Check .env.local credentials |
| Tables don't exist | Run schema.sql in Supabase |
| Can't login | Verify user in Supabase Auth |
| Permission denied | Check user role in profiles |
| Build errors | Run `rm -rf .next && npm install` |

## 📚 Documentation Files

1. **README.md** - Overview
2. **SETUP_GUIDE.md** - Detailed setup
3. **DOCUMENTATION.md** - Complete reference
4. **PROJECT_SUMMARY.md** - This delivery

## 🔍 Useful Supabase Queries

```sql
-- Count tickets by status
SELECT status, COUNT(*) FROM tickets GROUP BY status;

-- Active devices
SELECT * FROM devices WHERE status = 'active';

-- Recent maintenance
SELECT * FROM maintenance_logs 
ORDER BY performed_at DESC LIMIT 10;

-- User activity
SELECT action, COUNT(*) FROM audit_logs 
WHERE user_id = 'xxx' GROUP BY action;
```

## 🎨 UI Components

```tsx
// Button
<button className="btn btn-primary">Click me</button>

// Input
<input className="input" type="text" />

// Card
<div className="card">Content here</div>

// Badge
<span className="badge bg-blue-100 text-blue-800">Status</span>
```

## 📦 Project Structure

```
it-ticketing-system/
├── app/
│   ├── (dashboard)/     # Protected routes
│   ├── login/
│   └── register/
├── components/          # Reusable UI
├── lib/                # Utilities
├── types/              # TypeScript
└── database/           # SQL schema
```

## 🚀 Deployment Checklist

- [ ] Create Supabase project
- [ ] Run schema.sql
- [ ] Get API keys
- [ ] Set environment variables
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test in production
- [ ] Create first admin user

## 📞 Need Help?

1. Check SETUP_GUIDE.md
2. Review DOCUMENTATION.md
3. Search Supabase docs
4. Check Next.js docs

---

**Quick Tip**: Start with SETUP_GUIDE.md for step-by-step instructions!
