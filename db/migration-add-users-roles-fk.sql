-- ============================================
-- MIGRATION: Add Foreign Key between users and roles
-- Date: 2024-11-29
-- Purpose: Add proper FK relationship for data integrity
-- ============================================

-- Step 1: Add role_id column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role_id INTEGER;

-- Step 2: Populate role_id from existing role names
UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role = r.name;

-- Step 3: Add foreign key constraint
ALTER TABLE users 
ADD CONSTRAINT fk_users_role_id 
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;

-- Step 4: Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- Step 5: Add NOT NULL constraint (after data is populated)
-- Note: Commented out for safety, uncomment after verification
-- ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;

-- Step 6: Keep old 'role' column for backward compatibility
-- We'll deprecate it later after updating all application code
-- ALTER TABLE users DROP COLUMN role;  -- Don't drop yet!

-- Add comments
COMMENT ON COLUMN users.role_id IS 'Foreign key to roles table (NEW - preferred)';
COMMENT ON COLUMN users.role IS 'Role name as string (DEPRECATED - use role_id instead)';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if all users have role_id
-- SELECT COUNT(*) as total, COUNT(role_id) as with_role_id FROM users;

-- Check if role_id matches role name
-- SELECT u.id, u.email, u.role, r.name as role_name, u.role_id, r.id as role_table_id
-- FROM users u
-- LEFT JOIN roles r ON u.role_id = r.id;

-- Find users with mismatched roles
-- SELECT u.id, u.email, u.role, r.name as role_from_fk
-- FROM users u
-- LEFT JOIN roles r ON u.role_id = r.id
-- WHERE u.role != r.name OR r.name IS NULL;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- DROP INDEX IF EXISTS idx_users_role_id;
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role_id;
-- ALTER TABLE users DROP COLUMN IF EXISTS role_id;

-- ============================================
-- NOTES:
-- 1. role_id is the NEW preferred column
-- 2. role (VARCHAR) kept for backward compatibility
-- 3. Application should be updated to use role_id
-- 4. After full migration, drop 'role' column
-- ============================================
