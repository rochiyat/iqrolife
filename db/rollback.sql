-- ============================================
-- ROLLBACK SCRIPT - DROP ALL TABLES
-- ============================================
-- WARNING: This will delete ALL data!
-- Use with caution!

-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS portofolio CASCADE;
DROP TABLE IF EXISTS menu CASCADE;
DROP TABLE IF EXISTS formulir CASCADE;
DROP TABLE IF EXISTS calon_murid CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Verify all tables are dropped
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users', 'roles', 'calon_murid', 'formulir', 
    'menu', 'portofolio', 'settings', 'activity_logs'
  );

-- If result is empty, rollback successful
