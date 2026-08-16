-- COM7 HR Document Workflow V4 — Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  tax_id TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Branches
CREATE TABLE IF NOT EXISTS branches (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  name TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Employees
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  employee_id TEXT UNIQUE,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  branch_id BIGINT REFERENCES branches(id),
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Supervisors
CREATE TABLE IF NOT EXISTS supervisors (
  id BIGSERIAL PRIMARY KEY,
  supervisor_id TEXT UNIQUE,
  name TEXT NOT NULL,
  position TEXT,
  branch_id BIGINT REFERENCES branches(id),
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Cases (main table)
CREATE TABLE IF NOT EXISTS cases (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
  category TEXT NOT NULL,
  company TEXT,
  branch TEXT,
  uploader_name TEXT,
  uploader_position TEXT,
  supervisor_name TEXT,
  supervisor_position TEXT,
  employee_name TEXT NOT NULL,
  employee_id TEXT,
  employee_position TEXT,
  employee_dept TEXT,
  incident_date DATE,
  incident_time TIME,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected', 'completed', 'draft')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Case Documents
CREATE TABLE IF NOT EXISTS case_documents (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT REFERENCES cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  document_type TEXT DEFAULT 'attachment',
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Case Logs (timeline)
CREATE TABLE IF NOT EXISTS case_logs (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT REFERENCES cases(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  actor TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Warning Letters
CREATE TABLE IF NOT EXISTS warning_letters (
  id BIGSERIAL PRIMARY KEY,
  case_id BIGINT REFERENCES cases(id),
  letter_no TEXT,
  warning_level TEXT,
  violation TEXT,
  regulation TEXT,
  action_required TEXT,
  letter_date DATE,
  pdf_path TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Letterheads
CREATE TABLE IF NOT EXISTS letterheads (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  company_name TEXT NOT NULL,
  header_text TEXT,
  logo_url TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cases_uuid ON cases(uuid);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_company ON cases(company);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_logs_case_id ON case_logs(case_id);

-- RLS Policies (basic — customize as needed)
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for case submission
CREATE POLICY "Allow anon insert cases" ON cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon read cases by uuid" ON cases FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access cases" ON cases FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow insert documents" ON case_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read documents" ON case_documents FOR SELECT USING (true);

CREATE POLICY "Allow insert logs" ON case_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read logs" ON case_logs FOR SELECT USING (true);

-- Storage bucket for documents
-- Run in Supabase Dashboard → Storage:
-- Create bucket: "documents" (public: false)
