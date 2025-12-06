'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Menu as MenuIcon,
  Loader,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  label: string;
  icon: string;
  href: string;
  order_index: number;
  is_active: boolean;
  description?: string;
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [editFormData, setEditFormData] = useState<MenuItem | null>(null);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newMenu, setNewMenu] = useState<Partial<MenuItem>>({
    name: '',
    label: '',
    icon: '',
    href: '',
    order_index: 0,
    is_active: true,
    description: '',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/menu');
      if (response.ok) {
        const data = await response.json();
        // Transform camelCase to snake_case for frontend compatibility
        const transformedMenus = (data.data || []).map((menu: any) => ({
          id: menu.id?.toString() || menu.id,
          name: menu.name,
          label: menu.label,
          icon: menu.icon,
          href: menu.href,
          order_index: menu.orderIndex ?? menu.order_index ?? 0,
          is_active: menu.isActive ?? menu.is_active ?? true,
          description: menu.description,
        }));
        setMenus(transformedMenus);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      alert('Gagal mengambil data menu');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMenus = menus
    .filter(
      (menu) =>
        menu.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.href.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order_index - b.order_index);

  const handleAddMenu = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/dashboard/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMenu.name,
          label: newMenu.label,
          icon: newMenu.icon,
          href: newMenu.href,
          order_index: newMenu.order_index,
          roles: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMenus([...menus, data.data]);
        setNewMenu({
          name: '',
          label: '',
          icon: '',
          href: '',
          order_index: 0,
          is_active: true,
          description: '',
        });
        setIsAddDialogOpen(false);
        alert(`Menu "${data.data.label}" berhasil ditambahkan!`);
      } else {
        alert('Gagal menambahkan menu');
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      alert('Gagal menambahkan menu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (menu: MenuItem) => {
    setEditFormData({ ...menu });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (
    field: keyof MenuItem,
    value: string | number | boolean
  ) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const confirmEdit = async () => {
    if (editFormData) {
      try {
        setIsSaving(true);
        const response = await fetch('/api/dashboard/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        });

        if (response.ok) {
          setMenus(
            menus.map((m) => (m.id === editFormData.id ? editFormData : m))
          );
          alert(`Menu "${editFormData.label}" berhasil diupdate!`);
          setIsEditDialogOpen(false);
          setEditFormData(null);
        } else {
          alert('Gagal mengupdate menu');
        }
      } catch (error) {
        console.error('Error updating menu:', error);
        alert('Gagal mengupdate menu');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDelete = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedMenu) {
      try {
        setIsSaving(true);
        const response = await fetch(
          `/api/dashboard/menu?id=${selectedMenu.id}`,
          { method: 'DELETE' }
        );

        if (response.ok) {
          setMenus(menus.filter((m) => m.id !== selectedMenu.id));
          alert(`Menu "${selectedMenu.label}" berhasil dihapus!`);
          setIsDeleteDialogOpen(false);
          setSelectedMenu(null);
        } else {
          alert('Gagal menghapus menu');
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
        alert('Gagal menghapus menu');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const toggleStatus = async (id: string) => {
    const menu = menus.find((m) => m.id === id);
    if (menu) {
      try {
        setIsSaving(true);
        const response = await fetch('/api/dashboard/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            is_active: !menu.is_active,
          }),
        });

        if (response.ok) {
          setMenus(
            menus.map((m) =>
              m.id === id ? { ...m, is_active: !m.is_active } : m
            )
          );
        }
      } catch (error) {
        console.error('Error toggling menu status:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-600 mt-1">Kelola menu navigasi dashboard</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-brand-emerald hover:bg-brand-emerald/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Menu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-emerald">
              {menus.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menu Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {menus.filter((m) => m.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Menu Nonaktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {menus.filter((m) => !m.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Menu</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-brand-emerald" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Order
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Label
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Icon
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Path
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMenus.map((menu) => (
                    <tr key={menu.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-mono font-medium">
                          {menu.order_index}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{menu.label}</div>
                          {menu.description && (
                            <div className="text-xs text-gray-500">
                              {menu.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {menu.icon}
                        </code>
                      </td>
                      <td className="p-3">
                        <code className="text-xs text-gray-600">
                          {menu.href}
                        </code>
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleStatus(menu.id)}
                          disabled={isSaving}
                          className={`${
                            menu.is_active
                              ? 'text-green-600 hover:text-green-700'
                              : 'text-red-600 hover:text-red-700'
                          }`}
                        >
                          {menu.is_active ? 'Aktif' : 'Nonaktif'}
                        </Button>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => handleEdit(menu)}
                            disabled={isSaving}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(menu)}
                            disabled={isSaving}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Menu Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tambah Menu Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Name (ID) *</Label>
                <Input
                  id="new-name"
                  placeholder="dashboard"
                  value={newMenu.name}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-label">Label Menu *</Label>
                <Input
                  id="new-label"
                  placeholder="Dashboard"
                  value={newMenu.label}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, label: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon (Lucide) *</Label>
                <Input
                  id="new-icon"
                  placeholder="LayoutDashboard"
                  value={newMenu.icon}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, icon: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-href">Path *</Label>
                <Input
                  id="new-href"
                  placeholder="/dashboard/example"
                  value={newMenu.href}
                  onChange={(e) =>
                    setNewMenu({ ...newMenu, href: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-order">Order *</Label>
                <Input
                  id="new-order"
                  type="number"
                  placeholder="1"
                  value={newMenu.order_index}
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      order_index: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <select
                  id="new-status"
                  value={newMenu.is_active ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      is_active: e.target.value === 'active',
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={handleAddMenu}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Menambah...
                </>
              ) : (
                'Tambah Menu'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name (ID) *</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      handleEditInputChange('name', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-label">Label Menu *</Label>
                  <Input
                    id="edit-label"
                    value={editFormData.label}
                    onChange={(e) =>
                      handleEditInputChange('label', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon (Lucide) *</Label>
                  <Input
                    id="edit-icon"
                    value={editFormData.icon}
                    onChange={(e) =>
                      handleEditInputChange('icon', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-href">Path *</Label>
                  <Input
                    id="edit-href"
                    value={editFormData.href}
                    onChange={(e) =>
                      handleEditInputChange('href', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Order *</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={editFormData.order_index}
                    onChange={(e) =>
                      handleEditInputChange(
                        'order_index',
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.is_active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      handleEditInputChange(
                        'is_active',
                        e.target.value === 'active'
                      )
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={confirmEdit}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          {selectedMenu && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-3">
                  Apakah Anda yakin ingin menghapus menu berikut?
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Label:</span>
                    <span className="font-medium">{selectedMenu.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Path:</span>
                    <span className="font-medium">{selectedMenu.href}</span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Perhatian:</strong> Menu yang dihapus akan hilang dari
                  semua role.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
              disabled={isSaving}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Menu
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
