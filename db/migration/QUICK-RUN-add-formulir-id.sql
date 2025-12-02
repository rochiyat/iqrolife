-- QUICK RUN: Add formulir_pendaftaran_id to registrations
-- Copy and paste this entire script into your PostgreSQL client

-- 1. Add column
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS formulir_pendaftaran_id INTEGER;

-- 2. Add comment
COMMENT ON COLUMN registrations.formulir_pendaftaran_id IS 'Foreign key reference to formulir_pendaftaran table';

-- 3. Create index (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'registrations' 
        AND indexname = 'idx_registrations_formulir_id'
    ) THEN
        CREATE INDEX idx_registrations_formulir_id ON registrations(formulir_pendaftaran_id);
    END IF;
END$$;

-- 4. Add foreign key constraint (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_registrations_formulir_pendaftaran' 
        AND table_name = 'registrations'
    ) THEN
        ALTER TABLE registrations
        ADD CONSTRAINT fk_registrations_formulir_pendaftaran
        FOREIGN KEY (formulir_pendaftaran_id) 
        REFERENCES formulir_pendaftaran(id)
        ON DELETE SET NULL;
    END IF;
END$$;

-- 5. Verify column was added
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations' 
  AND column_name = 'formulir_pendaftaran_id';

-- 6. Verify foreign key was created
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'registrations'
  AND kcu.column_name = 'formulir_pendaftaran_id';

-- 7. Show current count of registrations
SELECT COUNT(*) as total_registrations FROM registrations;
SELECT COUNT(*) as total_formulir FROM formulir_pendaftaran;
