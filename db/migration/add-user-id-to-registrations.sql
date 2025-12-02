-- ============================================
-- Add user_id column to registrations table
-- This column will link registration to a parent user
-- ============================================

-- Add user_id column (nullable initially to allow existing records)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);

-- Add comment
COMMENT ON COLUMN registrations.user_id IS 'ID user parent yang terkait dengan registrasi ini (NULL jika belum dimapping)';

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the column was added:
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'registrations' AND column_name = 'user_id';
