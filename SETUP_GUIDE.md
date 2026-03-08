# Complete Setup Guide - IT Ticketing System

This guide will walk you through setting up the IT Ticketing and Inventory Management System from scratch.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Project Installation](#project-installation)
4. [Database Configuration](#database-configuration)
5. [Environment Variables](#environment-variables)
6. [First User Setup](#first-user-setup)
7. [Testing the Application](#testing-the-application)
8. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18 or higher** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A **Supabase account** (free tier is sufficient)
- A code editor (VS Code recommended)
- Basic knowledge of command line operations

Verify Node.js installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: IT Ticketing System
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your location
   - **Pricing Plan**: Free (sufficient for this project)
5. Click **"Create new project"**
6. Wait 2-3 minutes for project initialization

### Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Project API keys:**
     - `anon` / `public` key (starts with `eyJ...`)
     - `service_role` key (starts with `eyJ...`)
4. **Copy these values** - you'll need them soon

⚠️ **Important**: Never commit the `service_role` key to version control!

---

## Project Installation

### Step 1: Extract and Navigate to Project

```bash
# Navigate to the project directory
cd it-ticketing-system

# Verify you're in the right directory
ls -la
# You should see: app/, components/, lib/, database/, package.json, etc.
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This will install:
# - Next.js and React
# - Supabase client libraries
# - Tailwind CSS
# - Date utilities
# - PDF generation libraries
# - And more...
```

Wait for installation to complete (may take 2-5 minutes).

---

## Database Configuration

### Step 1: Open Supabase SQL Editor

1. In your Supabase dashboard, click **SQL Editor** in the sidebar
2. Click **"New query"**

### Step 2: Run Database Schema

1. Open the file `database/schema.sql` in your code editor
2. **Copy the entire contents** of this file
3. **Paste** into the Supabase SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)

You should see: ✅ Success. No rows returned

This creates:
- 7 main tables (profiles, tickets, devices, accessories, etc.)
- All necessary indexes
- Row Level Security policies
- Triggers and functions
- Proper relationships

### Step 3: Verify Tables Were Created

1. Go to **Table Editor** in Supabase sidebar
2. You should see these tables:
   - profiles
   - tickets
   - ticket_updates
   - devices
   - accessories
   - maintenance_logs
   - audit_logs

---

## Environment Variables

### Step 1: Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

### Step 2: Add Your Supabase Credentials

Open `.env.local` in your editor and replace the placeholder values:

```env
# Replace with your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Replace with your anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replace with your service role key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Keep this as is for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find these values:**
- Supabase Dashboard → Settings → API
- Copy Project URL and both API keys

### Step 3: Verify Configuration

```bash
# Check if .env.local exists
cat .env.local

# Make sure .env.local is in .gitignore
grep ".env.local" .gitignore  # Should return: .env.local
```

---

## First User Setup

### Step 1: Start the Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 15.x.x
  - Local:        http://localhost:3000
  - Ready in X.Xs
```

### Step 2: Register Your First User

1. Open your browser to [http://localhost:3000](http://localhost:3000)
2. You'll be redirected to `/login`
3. Click **"Register here"**
4. Fill in the registration form:
   - **Full Name**: Your Name
   - **Email**: admin@yourcompany.com
   - **Password**: Choose a strong password (min 6 characters)
5. Click **"Create account"**

### Step 3: Upgrade to Administrator

Your first user is created as a "technician" by default. Let's make them an admin:

1. Go to Supabase Dashboard → **Table Editor**
2. Click on the **profiles** table
3. Find your newly created user
4. Click on the **role** cell
5. Change from `technician` to `administrator`
6. Refresh your browser

Now you have admin access!

### Step 4: Test Admin Access

1. In the application, click **Users** in the sidebar
2. You should see the users management page
3. If you see "You do not have permission", refresh the page

---

## Testing the Application

### Test Each Module

#### 1. Dashboard
- Navigate to `/dashboard`
- Should see statistics (all zeros initially)
- Should see "Recent Tickets" section

#### 2. Create a Test Ticket
- Click **Tickets** → **Create Ticket**
- Fill in:
  - Title: "Test laptop not connecting to WiFi"
  - Description: "Employee laptop cannot connect to office WiFi"
  - Priority: High
  - Assign To: Your name
- Click **Create Ticket**
- Verify it appears in the tickets list

#### 3. Check Dashboard Updates
- Return to Dashboard
- Statistics should now show:
  - Total Tickets: 1
  - Open Tickets: 1

#### 4. Test Other Sections
- **Devices**: Should load (empty initially)
- **Accessories**: Should load (empty initially)
- **Maintenance**: Should load (empty initially)
- **Reports**: Should show report options
- **Users**: Should show your user account

### Create Sample Data (Optional)

To fully test the system, create:

**Sample Device:**
```sql
-- Run in Supabase SQL Editor
INSERT INTO devices (device_name, model, serial_number, assigned_user, status)
VALUES ('Dell Laptop #1', 'Dell Latitude 5420', 'DL123456789', 'John Doe', 'active');
```

**Sample Accessory:**
```sql
INSERT INTO accessories (item_name, category, quantity, storage_location)
VALUES ('Wireless Mouse', 'mouse', 15, 'Storage Room A');
```

Refresh your browser to see the new data.

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

2. **Connect to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repository
- Framework Preset: Next.js (auto-detected)

3. **Add Environment Variables in Vercel:**
- In Vercel project settings → Environment Variables
- Add all variables from `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL` (your Vercel URL)

4. **Deploy:**
- Click "Deploy"
- Wait 2-3 minutes
- Your app is live!

---

## Troubleshooting

### Issue: "Invalid API key" error

**Solution:**
- Verify `.env.local` has correct Supabase credentials
- Restart dev server: Stop (Ctrl+C) and run `npm run dev` again
- Check for typos in environment variables

### Issue: "Table does not exist"

**Solution:**
- Go to Supabase SQL Editor
- Re-run the entire `database/schema.sql` file
- Check Table Editor to verify tables exist

### Issue: Can't login after registration

**Solution:**
- Check Supabase Dashboard → Authentication → Users
- Verify user was created
- Check if email confirmation is required (disable in Auth settings for development)
- Verify profile record exists in profiles table

### Issue: Permission denied on pages

**Solution:**
- Verify user's role in profiles table
- For admin access, role must be `administrator`
- Refresh browser after changing role

### Issue: Blank page or errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

---

## Next Steps

Now that your system is running:

1. **Add More Users**: Use the registration page or Users section
2. **Create Tickets**: Test the full ticket workflow
3. **Add Devices**: Populate your device inventory
4. **Track Maintenance**: Log device updates
5. **Generate Reports**: Export data as needed

For questions or issues, refer to the main README.md file.

---

## Quick Reference

**Start Development:**
```bash
npm run dev
```

**Build for Production:**
```bash
npm run build
npm start
```

**Useful Supabase Links:**
- Dashboard: https://app.supabase.com
- Documentation: https://supabase.com/docs
- SQL Reference: https://supabase.com/docs/guides/database

**Application URLs (Local):**
- Login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard
- Tickets: http://localhost:3000/tickets
- Devices: http://localhost:3000/devices

---

**Setup Complete! 🎉**

You now have a fully functional IT Ticketing and Inventory Management System.
