# Implementation Plan: Registrations Dashboard Menu

## Overview

This document outlines the implementation plan for adding a **Registrations** menu to the dashboard. This feature will allow superadmin, staff, and teacher roles to view and manage registration submissions.

## Database Schema

The registrations feature will use the existing `formulir_pendaftaran` table. Here's the schema reference:

```sql
-- Table: formulir_pendaftaran
-- Contains all registration form submissions
-- Fields include: student data, parent data, health data, etc.
-- Status field: 'pending', 'reviewed', 'approved', 'rejected'
```

## Implementation Steps

### 1. Database Seed ✅

**File**: `db/seed-registrations-menu.sql`
**Status**: Already created

```sql
INSERT INTO menu (name, label, icon, href, parent_id, order_index, roles, is_active)
VALUES (
  'registrations',
  'Registrations',
  'ClipboardList',
  '/dashboard/registrations',
  NULL,
  4,
  '["superadmin", "staff", "teacher"]'::jsonb,
  true
);
```

**Action Required**: Run this seed file to add the menu entry to the database.

### 2. API Routes

**File**: `app/api/dashboard/registrations/route.ts`
**Status**: To be created

**Endpoints**:

- `GET /api/dashboard/registrations` - Fetch all registrations with optional filters
  - Query params: `?status=pending&page=1&limit=10&search=name`
- `GET /api/dashboard/registrations?id=123` - Fetch single registration
- `POST /api/dashboard/registrations` - Create new registration (if needed)
- `PUT /api/dashboard/registrations` - Update registration status/data
- `DELETE /api/dashboard/registrations?id=123` - Delete registration

**Features**:

- Pagination support
- Search functionality (by student name, parent name)
- Status filtering (pending, reviewed, approved, rejected)
- Role-based access control

### 3. Dashboard Page

**File**: `app/dashboard/(protected)/registrations/page.tsx`
**Status**: To be created

**Components**:

- **Header Section**

  - Page title: "Registrations"
  - Description: "Manage student registration submissions"
  - Action button: "Add New Registration" (optional)

- **Summary Cards**

  - Total Registrations
  - Pending Reviews
  - Approved This Month
  - Rejected Count

- **Data Table**
  - Columns:
    - Student Name
    - Age
    - Parent Names (Father/Mother)
    - Contact (Phone)
    - Program
    - Status Badge
    - Submission Date
    - Actions (View, Edit, Delete)
- **Filters & Search**

  - Search bar (by name, parent name)
  - Status filter dropdown
  - Date range filter
  - Items per page selector (5, 10, 15, 20, All)

- **Pagination**
  - Previous/Next buttons
  - Page numbers
  - Results counter

### 4. Modal Components

#### a. View Modal

**Purpose**: Display full registration details in read-only mode

**Sections**:

1. Student Personal Data
2. Address Information
3. Parent/Guardian Data
4. Health Information
5. Additional Information
6. Status History

#### b. Edit Modal

**Purpose**: Update registration status and add review notes

**Fields**:

- Status dropdown (Pending, Reviewed, Approved, Rejected)
- Review notes textarea
- Reviewer name (auto-filled from current user)
- Action buttons: Save, Cancel

#### c. Delete Modal

**Purpose**: Confirm deletion with warning

**Content**:

- Warning message
- Student name display
- Confirmation text
- Action buttons: Delete, Cancel

### 5. Navigation Updates

**File**: `app/dashboard/(protected)/layout.tsx`
**Status**: To be updated

The navigation menu is dynamically loaded from the database, so no code changes needed. The menu will appear automatically after running the seed file.

### 6. Permission Updates

**File**: `lib/auth-context.tsx`
**Status**: To be updated

**Changes Required**:

1. Add `canManageRegistrations` permission to `UserPermissions` interface
2. Update `fallbackPermissions` object:

   - **superadmin**: Add 'registrations' to menus array, set `canManageRegistrations: true`
   - **staff**: Add 'registrations' to menus array, set `canManageRegistrations: true`
   - **teacher**: Add 'registrations' to menus array, set `canManageRegistrations: true`
   - **parent**: Keep `canManageRegistrations: false`

3. Update deprecated `rolePermissions` object for backward compatibility

## File Structure

```
iqrolife/
├── app/
│   ├── api/
│   │   └── dashboard/
│   │       └── registrations/
│   │           └── route.ts (NEW)
│   └── dashboard/
│       └── (protected)/
│           └── registrations/
│               └── page.tsx (NEW)
├── db/
│   └── seed-registrations-menu.sql (EXISTS)
└── lib/
    └── auth-context.tsx (UPDATE)
```

## Design Patterns to Follow

Based on existing code (`formulir-list/page.tsx`):

1. **State Management**:

   - Use React hooks (useState, useEffect)
   - Separate state for: data, loading, modals, pagination, filters

2. **Data Fetching**:

   - Fetch on component mount
   - Refresh after mutations (create, update, delete)
   - Handle loading and error states

3. **UI Components**:

   - Use shadcn/ui components (Card, Button, Dialog, Input, etc.)
   - Consistent styling with existing pages
   - Responsive design (mobile-friendly)

4. **Icons**:

   - Use lucide-react icons
   - ClipboardList for registrations menu
   - Eye for view, Edit for edit, Trash for delete

5. **Color Scheme**:
   - Primary: `brand-emerald` (green)
   - Status badges:
     - Pending: Yellow/Orange
     - Reviewed: Blue
     - Approved: Green
     - Rejected: Red

## API Response Format

```typescript
// GET /api/dashboard/registrations
{
  success: true,
  data: FormSubmission[],
  total: number,
  page: number,
  limit: number
}

// POST/PUT/DELETE
{
  success: true,
  message: string,
  data?: any
}

// Error
{
  success: false,
  error: string
}
```

## Testing Checklist

- [ ] Database seed runs successfully
- [ ] Menu appears for superadmin, staff, teacher
- [ ] Menu does NOT appear for parent role
- [ ] API endpoints return correct data
- [ ] Pagination works correctly
- [ ] Search filters data properly
- [ ] Status filter works
- [ ] View modal displays all data
- [ ] Edit modal updates status
- [ ] Delete modal removes record
- [ ] Permissions are enforced
- [ ] Responsive design on mobile
- [ ] Loading states display correctly
- [ ] Error handling works

## Migration Steps

1. **Run Database Seed**:

   ```bash
   psql -U postgres -d iqrolife -f db/seed-registrations-menu.sql
   ```

2. **Create API Route**:

   - Copy pattern from `formulir-pendaftaran/route.ts`
   - Implement GET, POST, PUT, DELETE handlers
   - Add pagination and filtering

3. **Create Dashboard Page**:

   - Copy structure from `formulir-list/page.tsx`
   - Customize for registrations context
   - Implement modals

4. **Update Permissions**:

   - Edit `lib/auth-context.tsx`
   - Add registrations to role permissions
   - Test with different roles

5. **Test & Verify**:
   - Test all CRUD operations
   - Verify role-based access
   - Check responsive design
   - Test error scenarios

## Notes

- The registrations feature reuses the `formulir_pendaftaran` table
- This is essentially a different view/interface for the same data as `formulir-list`
- Consider if you want different permissions or workflows for "registrations" vs "formulir-list"
- The menu seed uses `order_index: 4` - verify this doesn't conflict with existing menus

## Next Steps

Would you like me to:

1. ✅ Run the database seed file
2. ✅ Create the API route
3. ✅ Create the dashboard page with modals
4. ✅ Update the auth-context permissions

Or would you prefer to review this plan first and make any adjustments?
