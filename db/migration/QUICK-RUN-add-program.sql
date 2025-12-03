-- QUICK RUN: Add program column to registrations
-- Copy and paste this entire script into your PostgreSQL client

-- 1. Add column if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'registrations' 
        AND column_name = 'program'
    ) THEN
        ALTER TABLE registrations ADD COLUMN program VARCHAR(100);
    END IF;
END$$;

-- 2. Add comment
COMMENT ON COLUMN registrations.program IS 'Program yang dipilih: Kelas Siap Sekolah atau Kelas Bermain';

-- 3. Create index (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'registrations' 
        AND indexname = 'idx_registrations_program'
    ) THEN
        CREATE INDEX idx_registrations_program ON registrations(program);
    END IF;
END$$;

-- 4. Set default value for existing NULL records
UPDATE registrations SET program = 'Belum Dipilih' WHERE program IS NULL;

-- 5. Verify column was added
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations' 
  AND column_name = 'program';

-- 6. Show distribution
SELECT program, COUNT(*) as count
FROM registrations
GROUP BY program;
