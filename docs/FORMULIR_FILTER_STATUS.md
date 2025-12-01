# ✅ Formulir - Filter & Status Badge

## Status
**COMPLETED** - 27 November 2025

## Fitur yang Ditambahkan

### 1. Status Badge di Card
✅ Menampilkan status calon murid dengan badge berwarna:
- 🟢 **Disetujui** (approved) - Green badge
- 🟡 **Menunggu** (pending) - Yellow badge
- 🔴 **Ditolak** (rejected) - Red badge
- 🔵 **Aktif** (active) - Blue badge

### 2. Filter Section
✅ Tiga jenis filter:

**a. Cari Nama**
- Input text untuk search
- Mencari berdasarkan nama murid atau nama orang tua
- Real-time filtering

**b. Filter Status**
- Dropdown dengan options:
  - Semua Status
  - Disetujui
  - Menunggu
  - Ditolak
  - Aktif

**c. Filter Jenis Kelamin**
- Dropdown dengan options:
  - Semua
  - Laki-laki
  - Perempuan

### 3. Results Counter
✅ Menampilkan jumlah hasil filter:
```
Menampilkan 3 dari 5 calon murid
```

### 4. Empty State untuk Filter
✅ Jika tidak ada hasil yang sesuai filter:
- Icon user check
- Pesan "Tidak Ada Hasil"
- Deskripsi
- Tombol "Reset Filter" untuk clear semua filter

## UI Layout

### Filter Section
```
┌─────────────────────────────────────────────────────────┐
│ Info: Pilih salah satu calon murid...                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│ │ Cari Nama    │ │ Status       │ │ Jenis Kelamin│   │
│ │ [Input...]   │ │ [Dropdown]   │ │ [Dropdown]   │   │
│ └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                         │
│ Menampilkan 3 dari 5 calon murid                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Card dengan Status Badge
```
┌─────────────────────────────────────┐
│ 👤  Ahmad Zaki        [Disetujui]   │
│     7 tahun • Laki-laki              │
│     Bapak Ahmad                      │
│     081234567890                     │
│                                      │
│     [Pilih & Isi Formulir]          │
└─────────────────────────────────────┘
```

## State Management

### New States
```typescript
const [filteredStudents, setFilteredStudents] = useState<CalonMurid[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState('all');
const [genderFilter, setGenderFilter] = useState('all');
```

### Filter Logic (useEffect)
```typescript
useEffect(() => {
  let filtered = students;

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Status filter
  if (statusFilter !== 'all') {
    filtered = filtered.filter((student) => student.status === statusFilter);
  }

  // Gender filter
  if (genderFilter !== 'all') {
    filtered = filtered.filter((student) => student.gender === genderFilter);
  }

  setFilteredStudents(filtered);
}, [students, searchTerm, statusFilter, genderFilter]);
```

## Status Badge Function

```typescript
const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
    approved: {
      label: 'Disetujui',
      className: 'bg-green-100 text-green-800',
    },
    pending: {
      label: 'Menunggu',
      className: 'bg-yellow-100 text-yellow-800',
    },
    rejected: { 
      label: 'Ditolak', 
      className: 'bg-red-100 text-red-800' 
    },
    active: { 
      label: 'Aktif', 
      className: 'bg-blue-100 text-blue-800' 
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
```

## User Experience

### Filter Behavior
1. **Real-time**: Filter langsung bekerja saat user mengetik atau memilih
2. **Kombinasi**: Semua filter bisa dikombinasikan
3. **Counter**: Selalu menampilkan jumlah hasil vs total
4. **Reset**: Tombol reset untuk clear semua filter sekaligus

### Card Interaction
1. Status badge ditampilkan di pojok kanan atas nama
2. Card tetap clickable untuk select student
3. Hover effect untuk visual feedback

## Testing Scenarios

### Test Filter Search
1. Ketik nama murid → Harus filter by nama
2. Ketik nama orang tua → Harus filter by parent name
3. Ketik partial name → Harus tetap match

### Test Filter Status
1. Pilih "Disetujui" → Hanya tampil yang approved
2. Pilih "Menunggu" → Hanya tampil yang pending
3. Pilih "Semua Status" → Tampil semua

### Test Filter Gender
1. Pilih "Laki-laki" → Hanya tampil laki-laki
2. Pilih "Perempuan" → Hanya tampil perempuan
3. Pilih "Semua" → Tampil semua

### Test Kombinasi Filter
1. Search "Ahmad" + Status "Disetujui" → Harus match keduanya
2. Gender "Laki-laki" + Status "Pending" → Harus match keduanya
3. Semua filter aktif → Harus match semua kondisi

### Test Empty State
1. Filter dengan kriteria yang tidak ada → Tampil empty state
2. Klik "Reset Filter" → Semua filter clear, tampil semua data

## Data Flow

```
User Input (Search/Filter)
    ↓
useEffect triggered
    ↓
Filter students array
    ↓
Update filteredStudents
    ↓
Re-render cards
```

## Responsive Design

- **Mobile**: Filter stack vertical (1 column)
- **Tablet**: Filter 2 columns
- **Desktop**: Filter 3 columns
- Cards: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

## Performance

- ✅ Filter menggunakan client-side filtering (fast)
- ✅ useEffect dengan dependencies yang tepat
- ✅ Tidak ada unnecessary re-renders
- ✅ Efficient array filtering

## Future Enhancements (Optional)

1. **Sort Options**: Sort by name, age, date
2. **Age Range Filter**: Filter by age range (5-7 tahun, 8-10 tahun)
3. **Date Filter**: Filter by registration date
4. **Export Filtered**: Export hasil filter ke Excel/PDF
5. **Save Filter**: Save filter preferences
6. **Advanced Search**: Search by multiple fields
7. **Filter Presets**: Quick filter buttons (e.g., "Pending Only")

## File Modified

```
app/dashboard/(protected)/formulir/page.tsx
- Added filter states
- Added filter UI
- Added status badge function
- Added empty state for no results
- Updated card to show status badge
```

## Catatan

- ✅ Filter bekerja real-time tanpa perlu klik button
- ✅ Status badge dengan warna yang konsisten dengan design system
- ✅ Empty state dengan option reset filter
- ✅ Counter menampilkan hasil filter vs total
- ✅ Responsive untuk semua device
- ✅ Kombinasi filter bekerja dengan baik
