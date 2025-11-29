-- ============================================
-- PHASE 1 MIGRATION: Soft Delete Implementation
-- Date: 2024-11-29
-- Purpose: Add soft delete capability to main tables
-- ============================================

-- Add deleted_at column to main tables
ALTER TABLE calon_murid ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE formulir_pendaftaran ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE formulir ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Create indexes for soft delete queries
CREATE INDEX IF NOT EXISTS idx_calon_murid_deleted_at ON calon_murid(deleted_at);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_formulir_pendaftaran_deleted_at ON formulir_pendaftaran(deleted_at);
CREATE INDEX IF NOT EXISTS idx_formulir_deleted_at ON formulir(deleted_at);

-- Add comments
COMMENT ON COLUMN calon_murid.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN formulir_pendaftaran.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';
COMMENT ON COLUMN formulir.deleted_at IS 'Soft delete timestamp - NULL means active, timestamp means deleted';

-- Create helper function for soft delete
CREATE OR REPLACE FUNCTION soft_delete(table_name TEXT, record_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL', table_name)
  USING record_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create helper function for restore
CREATE OR REPLACE FUNCTION restore_deleted(table_name TEXT, record_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  EXECUTE format('UPDATE %I SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL', table_name)
  USING record_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create helper function to permanently delete
CREATE OR REPLACE FUNCTION hard_delete(table_name TEXT, record_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  EXECUTE format('DELETE FROM %I WHERE id = $1', table_name)
  USING record_id;
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- USAGE EXAMPLES:
-- ============================================

-- Soft delete (mark as deleted)
-- SELECT soft_delete('calon_murid', 1);
-- Or manually:
-- UPDATE calon_murid SET deleted_at = NOW() WHERE id = 1;

-- Restore deleted record
-- SELECT restore_deleted('calon_murid', 1);
-- Or manually:
-- UPDATE calon_murid SET deleted_at = NULL WHERE id = 1;

-- Hard delete (permanent)
-- SELECT hard_delete('calon_murid', 1);

-- Query active records only
-- SELECT * FROM calon_murid WHERE deleted_at IS NULL;

-- Query deleted records
-- SELECT * FROM calon_murid WHERE deleted_at IS NOT NULL;

-- Query all records (including deleted)
-- SELECT * FROM calon_murid;

-- ============================================
-- NOTES:
-- ============================================
-- 1. Always add "WHERE deleted_at IS NULL" to queries for active records
-- 2. Soft delete preserves data for audit trail and recovery
-- 3. Use hard_delete() only when absolutely necessary
-- 4. Consider archiving old deleted records periodically
