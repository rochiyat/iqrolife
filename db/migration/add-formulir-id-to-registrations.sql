-- Migration: Add formulir_pendaftaran_id to registrations table
-- Date: 2025-12-02
-- Description: Adds formulir_pendaftaran_id column as foreign key to registrations table

-- Step 1: Add the column (nullable initially)
ALTER TABLE registrations 
ADD COLUMN formulir_pendaftaran_id INTEGER;

-- Step 2: Add comment on column
COMMENT ON COLUMN registrations.formulir_pendaftaran_id IS 'Foreign key reference to formulir_pendaftaran table';

-- Step 3: Create index for performance
CREATE INDEX idx_registrations_formulir_id ON registrations(formulir_pendaftaran_id);

-- Step 4: Add foreign key constraint
ALTER TABLE registrations
ADD CONSTRAINT fk_registrations_formulir_pendaftaran
FOREIGN KEY (formulir_pendaftaran_id) 
REFERENCES formulir_pendaftaran(id)
ON DELETE SET NULL;

-- Verification queries
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'registrations' 
  AND column_name = 'formulir_pendaftaran_id';

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
