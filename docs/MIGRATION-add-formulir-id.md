# Migration: Add formulir_pendaftaran_id to registrations

## Overview

This migration adds a `formulir_pendaftaran_id` column to the `registrations` table as a foreign key reference to the `formulir_pendaftaran` table.

## Purpose

- Maintain a relationship between registration records and their corresponding formulir_pendaftaran entries
- Enable efficient querying of student portfolio data
- Support the student-portfolio API that joins registrations with formulir_pendaftaran

## Changes Made

### Database Schema

1. **Added Column**: `formulir_pendaftaran_id INTEGER`

   - Nullable (allows NULL values)
   - Foreign key reference to `formulir_pendaftaran.id`
   - Indexed for performance

2. **Foreign Key Constraint**: `fk_registrations_formulir_pendaftaran`

   - References: `formulir_pendaftaran(id)`
   - ON DELETE: SET NULL (if formulir is deleted, set reference to NULL)

3. **Index**: `idx_registrations_formulir_id`
   - Improves query performance for joins

### Code Updates

1. **create-user API** (`app/api/dashboard/calon-murid/create-user/route.ts`)

   - After creating formulir_pendaftaran entry, now updates `registrations.formulir_pendaftaran_id`
   - Handles both new formulir creation and existing formulir linking

2. **student-portfolio API** (`app/api/dashboard/student-portfolio/route.ts`)
   - Changed from querying `calon_murid` to `registrations`
   - Uses `formulir_pendaftaran_id` for JOIN operations

## How to Run

### Option 1: Using Node.js Script (Recommended)

```bash
node db/migration/run-add-formulir-id-to-registrations.js
```

### Option 2: Using SQL Client

1. Connect to your PostgreSQL database
2. Execute the content of `QUICK-RUN-add-formulir-id.sql`

### Option 3: Manual SQL Execution

Execute `add-formulir-id-to-registrations.sql` in your PostgreSQL client

## Verification

After running the migration, verify with these queries:

```sql
-- Check column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'registrations'
  AND column_name = 'formulir_pendaftaran_id';

-- Check foreign key constraint
SELECT constraint_name, table_name
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_name = 'registrations'
  AND constraint_name = 'fk_registrations_formulir_pendaftaran';

-- Check index
SELECT indexname
FROM pg_indexes
WHERE tablename = 'registrations'
  AND indexname = 'idx_registrations_formulir_id';
```

## Rollback (If Needed)

```sql
-- Remove foreign key constraint
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS fk_registrations_formulir_pendaftaran;

-- Drop index
DROP INDEX IF EXISTS idx_registrations_formulir_id;

-- Remove column
ALTER TABLE registrations DROP COLUMN IF EXISTS formulir_pendaftaran_id;
```

## Date

2025-12-02

## Related Files

- `db/migration/add-formulir-id-to-registrations.sql`
- `db/migration/run-add-formulir-id-to-registrations.js`
- `db/migration/QUICK-RUN-add-formulir-id.sql`
- `app/api/dashboard/calon-murid/create-user/route.ts`
- `app/api/dashboard/student-portfolio/route.ts`
