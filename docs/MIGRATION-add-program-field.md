# Migration: Add Program Field to Registrations

## Overview

This migration adds a `program` field to the registrations system to support multiple program types: "Kelas Siap Sekolah" dan "Kelas Bermain".

## Purpose

- Allow parents to select a specific program during registration
- Track which program each student is enrolling in
- Support filtering and reporting by program type

## Changes Made

### 1. Database Schema

**File**: `db/migration/add-program-to-registrations.sql`

- **Added Column**: `program VARCHAR(100)`
- **Index**: `idx_registrations_program` for query performance
- **Default Value**: Set existing records to 'Belum Dipilih'

### 2. Registration Form (Frontend)

**File**: `app/program/school/registration/page.tsx`

**Changes:**

- Added `program` field to form state
- Added dropdown selection with two options:
  - "Kelas Siap Sekolah"
  - "Kelas Bermain"
- Made program field **required** (marked with asterisk)
- Positioned after "Asal Sekolah" field in the "Data Anak" section

### 3. Registration API

**File**: `app/api/program/school/registration/route.ts`

**Changes:**

- Extract `program` from form data
- Validate `program` as required field
- Include `program` in registration data object
- Add `program` to INSERT statement (column 9)

**Updated SQL:**

```sql
INSERT INTO registrations (
  nama_lengkap, tanggal_lahir, jenis_kelamin, asal_sekolah,
  nama_orang_tua, no_telepon, email, alamat, program, catatan,
  bukti_transfer_url, bukti_transfer_public_id, status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
```

### 4. Dashboard API

**File**: `app/api/dashboard/calon-murid/route.ts`

**Changes:**

- Added `program` to SELECT query
- Added `program` to data transformation mapping
- Frontend interface updated to include `program` field

### 5. Student Portfolio API

**File**: `app/api/dashboard/student-portfolio/route.ts`

**Changes:**

- Added `r.program` to SELECT query
- Enables program display in portfolio views

### 6. Frontend Interfaces

**File**: `app/dashboard/(protected)/calon-murid/page.tsx`

**Changes:**

- Added `program?: string` to Student interface

## Migration Steps

### Option 1: Quick Run (Recommended)

```sql
-- Execute in PostgreSQL client
\i db/migration/QUICK-RUN-add-program.sql
```

### Option 2: Manual Execution

```sql
-- 1. Add column
ALTER TABLE registrations ADD COLUMN program VARCHAR(100);

-- 2. Add comment
COMMENT ON COLUMN registrations.program IS 'Program yang dipilih: Kelas Siap Sekolah atau Kelas Bermain';

-- 3. Create index
CREATE INDEX idx_registrations_program ON registrations(program);

-- 4. Set default for existing records
UPDATE registrations SET program = 'Belum Dipilih' WHERE program IS NULL;
```

## Verification

```sql
-- Check column exists
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'registrations' AND column_name = 'program';

-- Check program distribution
SELECT program, COUNT(*) as count
FROM registrations
GROUP BY program;
```

## User Experience Flow

1. **Registration Page**: User selects program from dropdown
2. **Form Validation**: Program is required before submission
3. **Database**: Program stored in registrations table
4. **Dashboard**: Admin/Staff can view program selected by each student
5. **Portfolio**: Program information visible in student portfolio

## Program Options

Current supported programs:

- **Kelas Siap Sekolah**: Preparation class for primary school
- **Kelas Bermain**: Play-based learning class

To add more programs in the future:

1. Update dropdown in `app/program/school/registration/page.tsx`
2. No database schema changes needed (VARCHAR allows flexibility)

## Rollback (If Needed)

```sql
-- Remove index
DROP INDEX IF EXISTS idx_registrations_program;

-- Remove column
ALTER TABLE registrations DROP COLUMN IF EXISTS program;
```

## Date

2025-12-02

## Related Files

- `db/migration/add-program-to-registrations.sql`
- `db/migration/QUICK-RUN-add-program.sql`
- `app/program/school/registration/page.tsx`
- `app/api/program/school/registration/route.ts`
- `app/api/dashboard/calon-murid/route.ts`
- `app/api/dashboard/student-portfolio/route.ts`
- `app/dashboard/(protected)/calon-murid/page.tsx`
