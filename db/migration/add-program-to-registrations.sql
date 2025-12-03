-- Migration: Add program column to registrations table
-- Date: 2025-12-02
-- Description: Adds program column to store selected program type

-- Step 1: Add the column
ALTER TABLE registrations 
ADD COLUMN program VARCHAR(100);

-- Step 2: Add comment on column
COMMENT ON COLUMN registrations.program IS 'Program yang dipilih: Kelas Siap Sekolah atau Kelas Bermain';

-- Step 3: Create index for performance (optional, for filtering)
CREATE INDEX idx_registrations_program ON registrations(program);

-- Step 4: Set default value for existing records (optional)
UPDATE registrations SET program = 'Belum Dipilih' WHERE program IS NULL;

-- Verification queries
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations' 
  AND column_name = 'program';

SELECT program, COUNT(*) as count
FROM registrations
GROUP BY program;
