# Frontend Integration Guide

## 🎯 Integrasi API ke Frontend Pages

Untuk mengintegrasikan API yang sudah dibuat ke halaman frontend, ikuti pola berikut:

### Pattern Integrasi

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
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

  // CRUD operations
  const handleCreate = async (formData) => {
    const response = await fetch('/api/dashboard/endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      fetchData(); // Refresh data
    }
  };

  const handleUpdate = async (id, formData) => {
    const response = await fetch('/api/dashboard/endpoint', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...formData })
    });
    
    if (response.ok) {
      fetchData(); // Refresh data
    }
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/dashboard/endpoint?id=${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      fetchData(); // Refresh data
    }
  };

  return (
    // Your JSX here
  );
}
```

---

## 📋 Halaman yang Perlu Diintegrasikan

### 1. Roles Page
**File:** `app/dashboard/(protected)/roles/page.tsx`

**Changes Needed:**
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
      setRoles(result.data);
    }
  } catch (error) {
    console.error('Error fetching roles:', error);
  } finally {
    setLoading(false);
  }
};
```

---

### 2. Menu Page
**File:** `app/dashboard/(protected)/menu/page.tsx`

**Changes Needed:**
```typescript
// Replace dummy data with API calls
useEffect(() => {
  fetchMenus();
}, []);

const fetchMenus = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/menu');
    const result = await response.json();
    if (response.ok && result.success) {
      setMenus(result.data);
    }
  } catch (error) {
    console.error('Error fetching menus:', error);
  } finally {
    setLoading(false);
  }
};

const handleAddMenu = async () => {
  const response = await fetch('/api/dashboard/menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newMenu)
  });
  
  if (response.ok) {
    fetchMenus();
    setIsAddDialogOpen(false);
  }
};
```

---

### 3. Settings Page
**File:** `app/dashboard/(protected)/settings/page.tsx`

**Changes Needed:**
```typescript
useEffect(() => {
  fetchSettings();
}, []);

const fetchSettings = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/settings');
    const result = await response.json();
    if (response.ok && result.success) {
      setSettings(result.data);
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  } finally {
    setLoading(false);
  }
};

const handleUpdateSetting = async (key, value) => {
  const response = await fetch('/api/dashboard/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value })
  });
  
  if (response.ok) {
    fetchSettings();
  }
};
```

---

### 4. Portofolio Page
**File:** `app/dashboard/(protected)/portofolio/page.tsx`

**Changes Needed:**
```typescript
useEffect(() => {
  fetchPortofolio();
}, []);

const fetchPortofolio = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/portofolio');
    const result = await response.json();
    if (response.ok && result.success) {
      setPortofolio(result.data);
    }
  } catch (error) {
    console.error('Error fetching portofolio:', error);
  } finally {
    setLoading(false);
  }
};
```

---

### 5. Formulir Page
**File:** `app/dashboard/(protected)/formulir/page.tsx`

**Changes Needed:**
```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  formData.append('studentName', data.studentName);
  formData.append('birthDate', data.birthDate);
  // ... append all fields
  
  if (paymentProofFile) {
    formData.append('paymentProof', paymentProofFile);
  }
  
  const response = await fetch('/api/dashboard/formulir', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    alert('Formulir berhasil dikirim!');
    // Reset form or redirect
  }
};
```

---

## 🔄 Complete Integration Example

Berikut contoh lengkap untuk halaman Settings:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/settings');
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSettings(result.data);
      } else {
        console.error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key, value) => {
    try {
      setSaving(true);
      const response = await fetch('/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      
      if (response.ok) {
        alert('Setting berhasil diupdate!');
        fetchSettings();
      } else {
        alert('Gagal mengupdate setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      alert('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      
      {settings.map((setting) => (
        <Card key={setting.id}>
          <CardHeader>
            <CardTitle>{setting.key}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>{setting.description}</Label>
                <Input
                  value={setting.value}
                  onChange={(e) => {
                    const newSettings = settings.map(s =>
                      s.id === setting.id ? { ...s, value: e.target.value } : s
                    );
                    setSettings(newSettings);
                  }}
                />
              </div>
              <Button
                onClick={() => handleUpdateSetting(setting.key, setting.value)}
                disabled={saving}
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

---

## ✅ Checklist Integrasi

Untuk setiap halaman, pastikan:

- [ ] Import `useEffect` dari React
- [ ] Tambahkan state untuk data dan loading
- [ ] Buat fungsi `fetchData()` yang memanggil API
- [ ] Panggil `fetchData()` di `useEffect`
- [ ] Tambahkan loading state di UI
- [ ] Update CRUD operations untuk memanggil API
- [ ] Refresh data setelah create/update/delete
- [ ] Tambahkan error handling
- [ ] Test semua operasi

---

## 🚀 Quick Start

Untuk mengintegrasikan halaman dengan cepat:

1. **Copy pattern dari halaman yang sudah terintegrasi:**
   - `app/dashboard/(protected)/calon-murid/page.tsx`
   - `app/dashboard/(protected)/users/page.tsx`

2. **Replace dummy data dengan API calls**

3. **Test dengan:**
   ```bash
   npm run dev
   ```

4. **Verify:**
   - Data muncul dari database
   - Create/Update/Delete berfungsi
   - Loading states muncul
   - Error handling works

---

**Note:** Semua API sudah siap dan tested. Tinggal integrasikan ke frontend!
