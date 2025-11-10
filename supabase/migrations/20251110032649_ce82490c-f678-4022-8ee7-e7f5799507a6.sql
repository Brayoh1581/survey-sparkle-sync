-- Add 'pending' status to package_purchases if not exists
-- This allows tracking payments that are awaiting verification

-- First, let's check the current check constraint and update it
ALTER TABLE package_purchases 
DROP CONSTRAINT IF EXISTS package_purchases_status_check;

ALTER TABLE package_purchases 
ADD CONSTRAINT package_purchases_status_check 
CHECK (status IN ('pending', 'verified', 'rejected'));

-- Add a column to store the full M-PESA message for verification purposes
ALTER TABLE package_purchases 
ADD COLUMN IF NOT EXISTS mpesa_message TEXT;