-- ============================================================
-- Mayar Payment Integration — Database Migration
-- Run this in Supabase SQL Editor (or psql)
-- ============================================================

-- 1. Add plan fields to users_profile
ALTER TABLE users_profile
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'starter'
    CHECK (plan IN ('starter', 'professional', 'education')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS mayar_invoice_id TEXT,
  ADD COLUMN IF NOT EXISTS pending_plan TEXT,
  ADD COLUMN IF NOT EXISTS pending_billing_cycle TEXT,
  ADD COLUMN IF NOT EXISTS last_payment_ref TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

-- 2. Create payment_invoices table
CREATE TABLE IF NOT EXISTS payment_invoices (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id       TEXT NOT NULL UNIQUE,  -- Mayar invoice ID
  reference_id     TEXT UNIQUE,           -- Internal reference ID
  plan_id          TEXT NOT NULL CHECK (plan_id IN ('professional', 'education')),
  billing_cycle    TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  email            TEXT NOT NULL,
  amount           INTEGER NOT NULL,       -- in Rupiah
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'canceled')),
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_payment_invoices_invoice_id ON payment_invoices (invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_invoices_email ON payment_invoices (email);
CREATE INDEX IF NOT EXISTS idx_users_profile_email ON users_profile (email);

-- 4. RLS policies
ALTER TABLE payment_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON payment_invoices
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users read own invoices" ON payment_invoices
  FOR SELECT USING (email = (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));
