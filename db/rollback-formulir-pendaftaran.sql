-- ============================================
-- ROLLBACK FORMULIR PENDAFTARAN TABLE
-- Script untuk menghapus tabel formulir_pendaftaran
-- ============================================

-- Drop trigger first
DROP TRIGGER IF EXISTS update_formulir_pendaftaran_updated_at ON formulir_pendaftaran;

-- Drop indexes
DROP INDEX IF EXISTS idx_formulir_pendaftaran_user_id;
DROP INDEX IF EXISTS idx_formulir_pendaftaran_nama_lengkap;
DROP INDEX IF EXISTS idx_formulir_pendaftaran_status;
DROP INDEX IF EXISTS idx_formulir_pendaftaran_program;
DROP INDEX IF EXISTS idx_formulir_pendaftaran_submission_date;
DROP INDEX IF EXISTS idx_formulir_pendaftaran_tanggal_lahir;

-- Drop table
DROP TABLE IF EXISTS formulir_pendaftaran CASCADE;

-- Confirmation message
SELECT 'Tabel formulir_pendaftaran berhasil dihapus' AS status;
