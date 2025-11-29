-- ============================================
-- MIGRATION: Add Multiple Roles Support (Many-to-Many)
-- Date: 2024-11-29
-- Purpose: Allow users to have multiple roles
-- ============================================

-- Step 1: Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  assigned_by INTEGER REFERENCES users(id),
  is_primary BOOLEAN DEFAULT false,
  
  -- Ensure unique combination
  CONSTRAINT unique_user_role UNIQUE (user_id, role_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_primary ON user_roles(is_primary);

-- Step 3: Migrate existing data from users.role_id
INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
SELECT 
  id as user_id,
  role_id,
  true as is_primary,  -- Mark as primary role
  created_at as assigned_at
FROM users
WHERE role_id IS NOT NULL
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Step 4: Add comments
COMMENT ON TABLE user_roles IS 'Junction table for many-to-many relationship between users and roles';
COMMENT ON COLUMN user_roles.user_id IS 'Reference to user';
COMMENT ON COLUMN user_roles.role_id IS 'Reference to role';
COMMENT ON COLUMN user_roles.is_primary IS 'Indicates if this is the primary/main role for the user';
COMMENT ON COLUMN user_roles.assigned_by IS 'User who assigned this role (admin)';

-- Step 5: Create helper function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(p_user_id INTEGER)
RETURNS TABLE (
  role_id INTEGER,
  role_name VARCHAR,
  display_name VARCHAR,
  is_primary BOOLEAN,
  permissions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as role_id,
    r.name as role_name,
    r.display_name,
    ur.is_primary,
    r.permissions
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id
  ORDER BY ur.is_primary DESC, r.name;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create helper function to get primary role
CREATE OR REPLACE FUNCTION get_primary_role(p_user_id INTEGER)
RETURNS TABLE (
  role_id INTEGER,
  role_name VARCHAR,
  display_name VARCHAR,
  permissions JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as role_id,
    r.name as role_name,
    r.display_name,
    r.permissions
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = p_user_id AND ur.is_primary = true
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- NOTES:
-- 1. user_roles is the NEW junction table for many-to-many
-- 2. users.role_id is kept for backward compatibility
-- 3. is_primary marks the main role (for backward compatibility)
-- 4. Users can now have multiple roles
-- 5. Helper functions for easy querying
-- ============================================

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Get all roles for a user
-- SELECT * FROM get_user_roles(1);

-- Get primary role for a user
-- SELECT * FROM get_primary_role(1);

-- Add additional role to user
-- INSERT INTO user_roles (user_id, role_id, is_primary)
-- VALUES (1, 2, false);

-- Get users with specific role
-- SELECT u.* FROM users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- WHERE ur.role_id = 1;

-- Get users with multiple roles
-- SELECT u.id, u.email, COUNT(ur.role_id) as role_count
-- FROM users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- GROUP BY u.id, u.email
-- HAVING COUNT(ur.role_id) > 1;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================

-- DROP FUNCTION IF EXISTS get_user_roles(INTEGER);
-- DROP FUNCTION IF EXISTS get_primary_role(INTEGER);
-- DROP TABLE IF EXISTS user_roles;
