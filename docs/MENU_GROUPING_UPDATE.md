# ✅ Menu Sidebar - Grouping Update

## Status
**COMPLETED** - 27 November 2025

## Perubahan yang Dilakukan

### Struktur Menu Baru

#### Menu Inti (Tanpa Group)
1. **Dashboard** - Halaman utama
2. **Calon Murid** - Manajemen calon murid
3. **Formulir List** - Daftar formulir yang sudah disubmit
4. **Formulir** - Form pengisian pendaftaran
5. **Portofolio** - Portfolio/galeri

#### Group: Settings
1. **Users** - Manajemen user
2. **Roles** - Manajemen role & permissions
3. **Menu** - Manajemen menu
4. **Settings** - Pengaturan sistem

## UI Layout

### Before (Flat Menu)
```
┌─────────────────────┐
│ Dashboard           │
│ Calon Murid         │
│ Formulir List       │
│ Users               │
│ Roles               │
│ Menu                │
│ Formulir            │
│ Portofolio          │
│ Settings            │
└─────────────────────┘
```

### After (Grouped Menu)
```
┌─────────────────────┐
│ Dashboard           │
│ Calon Murid         │
│ Formulir List       │
│ Formulir            │
│ Portofolio          │
│                     │
│ SETTINGS            │
│ Users               │
│ Roles               │
│ Menu                │
│ Settings            │
└─────────────────────┘
```

## Code Changes

### 1. Update getNavItems() Function

**Before**: Return flat array
```typescript
return items.filter((item) => item.show);
```

**After**: Return grouped object
```typescript
return {
  main: mainItems.filter((item) => item.show),
  settings: settingsItems.filter((item) => item.show),
};
```

### 2. Update Sidebar Render

**Before**: Single loop
```typescript
{navItems.map((item) => (
  <Link>...</Link>
))}
```

**After**: Two sections with group header
```typescript
{/* Main Menu Items */}
<div className="space-y-1">
  {navItems.main.map((item) => (
    <Link>...</Link>
  ))}
</div>

{/* Settings Group */}
{navItems.settings.length > 0 && (
  <div className="space-y-1">
    <div className="px-4 py-2">
      <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-wider">
        Settings
      </h3>
    </div>
    {navItems.settings.map((item) => (
      <Link>...</Link>
    ))}
  </div>
)}
```

## Visual Design

### Group Header Style
- Text: Uppercase, small (text-xs)
- Color: Gray with 60% opacity
- Font: Semibold
- Spacing: Letter spacing wider
- Padding: px-4 py-2

### Spacing
- Between main and settings group: `space-y-6`
- Between menu items: `space-y-1`
- Sidebar padding: `p-4`

### Sidebar Enhancements
- Added `overflow-y-auto` for scrollable sidebar
- Maintains fixed width of 64 (w-64)
- Responsive behavior unchanged

## Permission-Based Display

### Main Menu
- **Dashboard**: Always visible
- **Calon Murid**: `canManageStudents`
- **Formulir List**: `canManageFormsList`
- **Formulir**: `canManageForms`
- **Portofolio**: `canViewPortfolio`

### Settings Group
- **Users**: `canManageUsers`
- **Roles**: `canManageRoles`
- **Menu**: `canManageMenu`
- **Settings**: `canManageSettings`

**Note**: Settings group only shows if at least one item is visible

## Benefits

### 1. Better Organization
- Clear separation between operational and administrative functions
- Easier to find settings-related features

### 2. Scalability
- Easy to add more groups in the future
- Can add more items without cluttering

### 3. User Experience
- Cleaner visual hierarchy
- Reduced cognitive load
- Professional appearance

### 4. Flexibility
- Settings group only appears if user has permission
- Can easily add more groups (e.g., "Reports", "Analytics")

## Future Enhancements (Optional)

### 1. Collapsible Groups
```typescript
const [isSettingsOpen, setIsSettingsOpen] = useState(true);

<div onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
  <h3>Settings {isSettingsOpen ? '▼' : '▶'}</h3>
</div>
{isSettingsOpen && (
  <div>{/* Settings items */}</div>
)}
```

### 2. More Groups
- **Reports** group: Analytics, Logs, Activity
- **Content** group: Pages, Posts, Media
- **Communication** group: Messages, Notifications, Email

### 3. Icons for Groups
```typescript
<h3>
  <Settings className="w-4 h-4" />
  Settings
</h3>
```

### 4. Badge/Counter
```typescript
<h3>
  Settings
  <span className="badge">3</span>
</h3>
```

### 5. Drag & Drop Reordering
- Allow users to customize menu order
- Save preferences to database

## Testing Scenarios

### Test as Different Roles

**Superadmin**:
- Should see all main menu items
- Should see all settings items

**Staff**:
- Should see main menu items (based on permissions)
- May see some settings items

**Guru**:
- Should see limited main menu items
- Should NOT see settings group

**Parent**:
- Should see Dashboard, Formulir, Portofolio
- Should NOT see settings group

### Test Responsive
1. Desktop: Sidebar always visible
2. Tablet: Sidebar toggleable
3. Mobile: Sidebar overlay with backdrop

### Test Navigation
1. Click main menu item → Navigate correctly
2. Click settings item → Navigate correctly
3. Active state shows correctly in both groups

## File Modified

```
app/dashboard/(protected)/layout.tsx
- Updated getNavItems() to return grouped object
- Updated sidebar render to show groups
- Added group header styling
- Added overflow-y-auto for scrolling
```

## Catatan

- ✅ Menu inti tanpa group header (langsung list)
- ✅ Settings dengan group header "SETTINGS"
- ✅ Settings group hanya muncul jika ada minimal 1 item
- ✅ Spacing yang jelas antara main dan settings
- ✅ Styling konsisten untuk semua menu items
- ✅ Permission-based visibility tetap berfungsi
- ✅ Responsive behavior tidak berubah
