# COM7 HR Document Workflow V4

ระบบบริหารเอกสาร HR ของ COM7 Group — Next.js 14 + Supabase

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.local.example .env.local
# แก้ไข NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Setup database
# Copy supabase/schema.sql → Supabase SQL Editor → Run

# 4. Run development server
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Static layout (html+body only)
│   ├── globals.css             # CSS Reset + Design tokens
│   ├── styles.ts               # Shared style objects (inline styles)
│   ├── page.tsx                # Landing page
│   ├── submit/page.tsx         # Document submission form
│   ├── tracking/page.tsx       # Status tracking (UUID search)
│   ├── upload-signed/page.tsx  # Upload signed documents
│   ├── admin/
│   │   ├── login/page.tsx      # Admin login
│   │   ├── dashboard/page.tsx  # Admin dashboard + table
│   │   ├── cases/[id]/page.tsx # Case detail (3-column)
│   │   ├── draft-letter/page.tsx # Warning letter draft + preview
│   │   ├── master-data/page.tsx  # CSV import (4 tabs)
│   │   └── letterheads/page.tsx  # Letterhead management
│   └── api/
│       └── send-email/route.ts # Mock email API
├── lib/
│   └── supabase.ts             # Supabase client
└── supabase/
    └── schema.sql              # Database schema (10 tables)
```

## 🎨 Design System

- **Colors**: COM7 Green (#00A651), Off-white (#f8f9fa), Gray scale
- **Typography**: -apple-system, Noto Sans Thai
- **Styling**: Inline styles via `styles.ts` (no Tailwind)
- **Components**: Cards, Badges, Inputs, Tables, Upload Zones

## 📋 Pages (10 total)

| Route | Description |
|-------|-------------|
| `/` | Landing — 3 cards navigation |
| `/submit` | 6-section form for HR document submission |
| `/tracking` | UUID-based status tracking + timeline |
| `/upload-signed` | Upload signed documents back |
| `/admin/login` | Admin authentication |
| `/admin/dashboard` | Stats + filters + cases table |
| `/admin/cases/[id]` | 3-column case detail + action bar |
| `/admin/draft-letter` | Warning letter form + A4 live preview |
| `/admin/master-data` | 4-tab CSV import (company/branch/employee/supervisor) |
| `/admin/letterheads` | Letterhead preview + CRUD |

## ⚙️ Build Requirements Met

- ✅ `layout.tsx` = static (html + body + children only)
- ✅ All pages = "use client" + immediate render
- ✅ `typescript.ignoreBuildErrors: true`
- ✅ `eslint.ignoreDuringBuilds: true`
- ✅ `tsconfig.strict: false`
- ✅ No `resend` import — uses mock `/api/send-email`
- ✅ `globals.css` = plain CSS reset + variables
- ✅ Inline styles only (no Tailwind)
- ✅ Dependencies: next@14.2.5, react@18, supabase, zod
- ✅ Data fetch in useEffect/onClick only

## 🗄️ Database

10 tables in Supabase:
1. `companies` — Company master data
2. `branches` — Branch/store info
3. `employees` — Employee records
4. `supervisors` — Supervisor/manager info
5. `cases` — Main case tracking
6. `case_documents` — Uploaded files metadata
7. `case_logs` — Timeline/activity logs
8. `warning_letters` — Generated warning letters
9. `letterheads` — Company letterhead templates
10. `admin_users` — Admin user registry

## 🚀 Deploy to Vercel

```bash
# Rename branch to main
git branch -m master main

# Push
git remote add origin <your-repo>
git push -u origin main
```

Then connect to Vercel:
1. Import GitHub repo
2. Set environment variables (SUPABASE_URL + ANON_KEY)
3. Deploy!

## 📝 Notes

- Email sending is mocked via `/api/send-email` (console.log)
- File uploads use Supabase Storage bucket "documents"
- Auth uses Supabase Auth (email/password)
- SLA calculated client-side (7 days target)
