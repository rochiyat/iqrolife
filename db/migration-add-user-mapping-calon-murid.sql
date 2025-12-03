-- ============================================
-- MIGRATION: Add user_id mapping to calon_murid
-- Date: 2024-11-28
-- Purpose: Link calon_murid with parent user for proper access control
-- ============================================

-- Add user_id column to calon_murid (parent user)
ALTER TABLE calon_murid 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

-- Add formulir_pendaftaran_id column (link to new form system)
ALTER TABLE calon_murid 
ADD COLUMN IF NOT EXISTS formulir_pendaftaran_id INTEGER REFERENCES formulir_pendaftaran(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calon_murid_user_id ON calon_murid(user_id);
CREATE INDEX IF NOT EXISTS idx_calon_murid_formulir_pendaftaran_id ON calon_murid(formulir_pendaftaran_id);

-- Update existing records: Match by email
UPDATE calon_murid cm
SET user_id = u.id
FROM users u
WHERE cm.email = u.email
  AND cm.user_id IS NULL;

-- Add comments
COMMENT ON COLUMN calon_murid.user_id IS 'Reference to parent user who registered this student';
COMMENT ON COLUMN calon_murid.formulir_pendaftaran_id IS 'Reference to formulir_pendaftaran (new form system)';

-- ============================================
-- NOTES:
-- - user_id: Parent user yang mendaftarkan anak
-- - formulir_pendaftaran_id: Link ke formulir baru (jika ada)
-- - Existing records akan di-update berdasarkan email matching
-- ============================================
