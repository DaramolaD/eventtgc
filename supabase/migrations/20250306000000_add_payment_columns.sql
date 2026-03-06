-- Add payment tracking columns to submissions
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
--
-- Required for: Admin Invoices page, "I've made the payment" button on My Bookings,
-- and "Confirm payment received" on admin invoice detail.

ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS payment_reported_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_confirmed_at TIMESTAMPTZ;
