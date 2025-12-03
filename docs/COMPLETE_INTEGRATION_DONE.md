# Complete Frontend Integration - Summary

## 🎉 Status: READY FOR INTEGRATION

Semua API sudah siap dan tested. Berikut panduan lengkap untuk mengintegrasikan setiap halaman.

---

## 📋 Integration Checklist

### ✅ Already Integrated (Reference)
- `app/dashboard/(protected)/calon-murid/page.tsx`
- `app/dashboard/(protected)/users/page.tsx`
- `app/dashboard/(protected)/formulir-list/page.tsx`

### 🔄 Need Integration (Simple - Copy Pattern)
1. **Roles Page** - Display only (read from API)
2. **Menu Page** - CRUD operations
3. **Settings Page** - Update operations
4. **Portofolio Page** - Display only (complex UI)
5. **Formulir Page** - Submit form only

---

## 🚀 Quick Integration Guide

### Pattern untuk Setiap Halaman:

```typescript
// 1. Add imports
import { useState, useEffect } from 'react';

// 2. Add state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

// 3. Fetch on mount
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/endpoint');
    const result = await response.json();
    if (response.ok && result.success) {
      setData(result.data);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

// 4. Add loading UI
if (loading) {
  return <div>Loading...</div>;
}
```

---

## 📝 Specific Integration Instructions

### 1. Roles Page (`app/dashboard/(protected)/roles/page.tsx`)

**Current:** Static data display
**Target:** Fetch from `/api/dashboard/roles`

**Changes:**
```typescript
// Add at top
const [roles, setRoles] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchRoles();
}, []);

const fetchRoles = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/roles');
    const result = await response.json();
    if (response.ok && result.success) {
      // Transform data to match UI format
      const transformedRoles = result.data.map(role => ({
        name: role.display_name,
        key: role.name,
        description: role.description,
        permissions: role.permissions,
        // ... map other fields
      }));
      setRoles(transformedRoles);
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  } finally {
    setLoading(false);
  }
};
```

**Note:** Roles page is mostly display-only. Just fetch and show data.

---

### 2. Menu Page (`app/dashboard/(protected)/menu/page.tsx`)

**Current:** Local state with dummy data
**Target:** Full CRUD with `/api/dashboard/menu`

**Changes:**
```typescript
// Replace dummy data with API
useEffect(() => {
  fetchMenus();
}, []);

const fetchMenus = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/menu');
    const result = await response.json();
    if (response.ok && result.success) {
      // Transform to match UI format
      const transformed = result.data.map(m => ({
        id: m.id.toString(),
        label: m.label,
        icon: m.icon,
        href: m.href,
        order: m.order_index,
        isActive: m.is_active,
        description: m.label
      }));
      setMenus(transformed);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

const handleAddMenu = async () => {
  try {
    const response = await fetch('/api/dashboard/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMenu.label.toLowerCase().replace(/\s+/g, '-'),
        label: newMenu.label,
        icon: newMenu.icon,
        href: newMenu.href,
        order_index: newMenu.order,
        roles: ['superadmin'] // default
      })
    });
    
    if (response.ok) {
      fetchMenus();
      setIsAddDialogOpen(false);
      alert('Menu berhasil ditambahkan!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menambahkan menu');
  }
};

const confirmEdit = async () => {
  if (!editFormData) return;
  
  try {
    const response = await fetch('/api/dashboard/menu', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editFormData.id,
        label: editFormData.label,
        icon: editFormData.icon,
        href: editFormData.href,
        order_index: editFormData.order,
        is_active: editFormData.isActive
      })
    });
    
    if (response.ok) {
      fetchMenus();
      setIsEditDialogOpen(false);
      alert('Menu berhasil diupdate!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal mengupdate menu');
  }
};

const confirmDelete = async () => {
  if (!selectedMenu) return;
  
  try {
    const response = await fetch(`/api/dashboard/menu?id=${selectedMenu.id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      fetchMenus();
      setIsDeleteDialogOpen(false);
      alert('Menu berhasil dihapus!');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menghapus menu');
  }
};
```

---

### 3. Settings Page (`app/dashboard/(protected)/settings/page.tsx`)

**Current:** Static form
**Target:** Fetch and update via `/api/dashboard/settings`

**Changes:**
```typescript
const [settings, setSettings] = useState<any>({});
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/settings');
    const result = await response.json();
    
    if (response.ok && result.success) {
      // Convert array to object for easier access
      const settingsObj = {};
      result.data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      setSettings(settingsObj);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

const handleSave = async () => {
  try {
    setIsSaving(true);
    
    // Update each setting
    const updates = Object.keys(settings).map(key =>
      fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: settings[key] })
      })
    );
    
    await Promise.all(updates);
    
    alert('Settings berhasil disimpan!');
  } catch (error) {
    console.error('Error:', error);
    alert('Gagal menyimpan settings');
  } finally {
    setIsSaving(false);
  }
};

// Update input handlers to use settings state
<Input
  value={settings['site_name'] || ''}
  onChange={(e) => setSettings({...settings, site_name: e.target.value})}
/>
```

---

### 4. Portofolio Page (`app/dashboard/(protected)/portofolio/page.tsx`)

**Current:** Complex UI with dummy data
**Target:** Fetch from `/api/dashboard/portofolio`

**Changes:**
```typescript
const [portfolios, setPortfolios] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchPortfolios();
}, []);

const fetchPortfolios = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/portofolio');
    const result = await response.json();
    
    if (response.ok && result.success) {
      setPortfolios(result.data);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

**Note:** Portofolio page is complex. Just fetch and display. The UI structure can remain the same.

---

### 5. Formulir Page (`app/dashboard/(protected)/formulir/page.tsx`)

**Current:** Multi-step form with local state
**Target:** Submit to `/api/dashboard/formulir`

**Changes:**
```typescript
const handleSubmit = async () => {
  if (!formData.pernyataanSetuju) {
    alert('Anda harus menyetujui pernyataan terlebih dahulu');
    return;
  }
  
  try {
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('studentName', formData.namaLengkap);
    formDataToSend.append('birthDate', formData.tanggalLahir);
    formDataToSend.append('gender', formData.jenisKelamin);
    formDataToSend.append('parentName', formData.namaAyah);
    formDataToSend.append('phone', formData.teleponAyah);
    formDataToSend.append('email', formData.teleponAyah); // or parent email
    formDataToSend.append('address', formData.alamatLengkap);
    formDataToSend.append('previousSchool', formData.bahasaSehariHari || '');
    formDataToSend.append('notes', formData.informasiTambahan);
    
    // Add payment proof if exists
    if (paymentProofFile) {
      formDataToSend.append('paymentProof', paymentProofFile);
    }
    
    const response = await fetch('/api/dashboard/formulir', {
      method: 'POST',
      body: formDataToSend
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      alert('Formulir berhasil dikirim!');
      // Reset form or redirect
      window.location.href = '/dashboard/formulir-list';
    } else {
      alert(result.error || 'Gagal mengirim formulir');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Terjadi kesalahan saat mengirim formulir');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🎯 Priority Order

Berdasarkan kompleksitas dan kebutuhan:

1. **Settings** (Easiest) - Just fetch and update
2. **Menu** (Medium) - Full CRUD but simple data
3. **Roles** (Easy) - Display only
4. **Formulir** (Medium) - Submit only
5. **Portofolio** (Complex) - Just fetch, UI stays same

---

## ✅ Testing After Integration

Untuk setiap halaman:

1. **Check loading state** - Spinner muncul saat fetch
2. **Check data display** - Data dari database muncul
3. **Test CRUD** - Create, update, delete berfungsi
4. **Check refresh** - Data refresh setelah operasi
5. **Check error handling** - Error ditangani dengan baik

---

## 📚 Reference Files

Copy pattern dari:
- `app/dashboard/(protected)/calon-murid/page.tsx` - Full CRUD example
- `app/dashboard/(protected)/users/page.tsx` - CRUD with email
- `app/dashboard/(protected)/formulir-list/page.tsx` - Display with pagination

---

## 🚀 Quick Start

Untuk mengintegrasikan semua halaman dengan cepat:

1. Buka file halaman
2. Add `useEffect` dan `fetchData()`
3. Replace dummy data dengan API call
4. Update CRUD functions untuk call API
5. Add loading states
6. Test!

---

**All APIs are ready and tested. Just copy the pattern!** 🎉
