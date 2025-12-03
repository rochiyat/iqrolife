-- ============================================
-- QUICK MIGRATION: Add user_id to registrations
-- Copy paste this entire SQL to your database client
-- ============================================

-- Add user_id column
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Create index
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);

-- Add comment
COMMENT ON COLUMN registrations.user_id IS 'ID user parent yang terkait dengan registrasi ini (NULL jika belum dimapping)';

-- ============================================
-- VERIFICATION QUERIES (run these to verify)
-- ============================================

-- Check if column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' AND column_name = 'user_id';

-- Check sample data
SELECT id, nama_lengkap, email, user_id, created_at
FROM registrations
ORDER BY created_at DESC
LIMIT 5;

-- Expected output:
-- id | nama_lengkap | email | user_id | created_at
-- ---+--------------+-------+---------+------------
-- [data rows with user_id column visible]
