-- ============================================
-- MIGRATION: Add 'enrolled' status to formulir_pendaftaran
-- Date: 2024-11-28
-- ============================================

-- Drop existing constraint
ALTER TABLE formulir_pendaftaran 
DROP CONSTRAINT IF EXISTS formulir_pendaftaran_status_check;

-- Add new constraint with 'enrolled' status
ALTER TABLE formulir_pendaftaran 
ADD CONSTRAINT formulir_pendaftaran_status_check 
CHECK (status IN ('draft', 'submitted', 'pending', 'reviewed', 'approved', 'rejected', 'enrolled'));

-- Update comment
COMMENT ON COLUMN formulir_pendaftaran.status IS 'Status formulir: draft (belum selesai), submitted/pending (baru dikirim), reviewed (sudah direview), approved (disetujui), rejected (ditolak), enrolled (sudah terdaftar resmi)';

-- ============================================
-- NOTES:
-- Status flow: draft → submitted/pending → reviewed → approved → enrolled
-- atau: draft → submitted/pending → reviewed → rejected
-- ============================================
