'use client';

import { useState } from 'react';
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
import { Plus, Search, Edit, Trash2, Menu as MenuIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  order: number;
  isActive: boolean;
  description?: string;
}

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [editFormData, setEditFormData] = useState<MenuItem | null>(null);
  const [newMenu, setNewMenu] = useState<Partial<MenuItem>>({
    label: '',
    icon: '',
    href: '',
    order: 0,
    isActive: true,
    description: '',
  });
  
  const [menus, setMenus] = useState<MenuItem[]>([
    {
      id: '1',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      href: '/dashboard/home',
      order: 1,
      isActive: true,
      description: 'Halaman utama dashboard',
    },
    {
      id: '2',
      label: 'Calon Murid',
      icon: 'GraduationCap',
      href: '/dashboard/calon-murid',
      order: 2,
      isActive: true,
      description: 'Manajemen data calon murid',
    },
    {
      id: '3',
      label: 'Users',
      icon: 'Users',
      href: '/dashboard/users',
      order: 3,
      isActive: true,
      description: 'Manajemen user sistem',
    },
    {
      id: '4',
      label: 'Roles',
      icon: 'UserCog',
      href: '/dashboard/roles',
      order: 4,
      isActive: true,
      description: 'Manajemen role dan permissions',
    },
    {
      id: '5',
      label: 'Menu',
      icon: 'Menu',
      href: '/dashboard/menu',
      order: 5,
      isActive: true,
      description: 'Manajemen menu dashboard',
    },
    {
      id: '6',
      label: 'Formulir',
      icon: 'FileText',
      href: '/dashboard/formulir',
      order: 6,
      isActive: true,
      description: 'Formulir pendaftaran murid',
    },
    {
      id: '7',
      label: 'Settings',
      icon: 'Settings',
      href: '/dashboard/settings',
      order: 7,
      isActive: true,
      description: 'Pengaturan sistem',
    },
  ]);

  const filteredMenus = menus
    .filter(menu =>
      menu.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.href.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  const handleAddMenu = () => {
    const id = (Math.max(...menus.map(m => parseInt(m.id)), 0) + 1).toString();
    const menuToAdd: MenuItem = {
      id,
      label: newMenu.label || '',
      icon: newMenu.icon || '',
      href: newMenu.href || '',
      order: newMenu.order || menus.length + 1,
      isActive: newMenu.isActive ?? true,
      description: newMenu.description || '',
    };
    setMenus([...menus, menuToAdd]);
    setNewMenu({
      label: '',
      icon: '',
      href: '',
      order: 0,
      isActive: true,
      description: '',
    });
    setIsAddDialogOpen(false);
    alert(`Menu "${menuToAdd.label}" berhasil ditambahkan!`);
  };

  const handleEdit = (menu: MenuItem) => {
    setEditFormData({ ...menu });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: keyof MenuItem, value: string | number | boolean) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const confirmEdit = () => {
    if (editFormData) {
      setMenus(menus.map(m => 
        m.id === editFormData.id ? editFormData : m
      ));
      alert(`Menu "${editFormData.label}" berhasil diupdate!`);
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const handleDelete = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMenu) {
      setMenus(menus.filter(m => m.id !== selectedMenu.id));
      alert(`Menu "${selectedMenu.label}" berhasil dihapus!`);
      setIsDeleteDialogOpen(false);
      setSelectedMenu(null);
    }
  };

  const toggleStatus = (id: string) => {
    setMenus(menus.map(menu =>
      menu.id === id ? { ...menu, isActive: !menu.isActive } : menu
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Menu Management</h2>
          <p className="text-gray-600 mt-1">
            Kelola menu navigasi dashboard
          </p>
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
              {menus.filter(m => m.isActive).length}
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
              {menus.filter(m => !m.isActive).length}
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
                      <span className="font-mono font-medium">{menu.order}</span>
                    </td>
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{menu.label}</div>
                        {menu.description && (
                          <div className="text-xs text-gray-500">{menu.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {menu.icon}
                      </code>
                    </td>
                    <td className="p-3">
                      <code className="text-xs text-gray-600">{menu.href}</code>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(menu.id)}
                        className={`${
                          menu.isActive
                            ? 'text-green-600 hover:text-green-700'
                            : 'text-red-600 hover:text-red-700'
                        }`}
                      >
                        {menu.isActive ? 'Aktif' : 'Nonaktif'}
                      </Button>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEdit(menu)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(menu)}
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
                <Label htmlFor="new-label">Label Menu *</Label>
                <Input
                  id="new-label"
                  placeholder="Dashboard"
                  value={newMenu.label}
                  onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-icon">Icon (Lucide) *</Label>
                <Input
                  id="new-icon"
                  placeholder="LayoutDashboard"
                  value={newMenu.icon}
                  onChange={(e) => setNewMenu({ ...newMenu, icon: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-href">Path *</Label>
                <Input
                  id="new-href"
                  placeholder="/dashboard/example"
                  value={newMenu.href}
                  onChange={(e) => setNewMenu({ ...newMenu, href: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-order">Order *</Label>
                <Input
                  id="new-order"
                  type="number"
                  placeholder="1"
                  value={newMenu.order}
                  onChange={(e) => setNewMenu({ ...newMenu, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="new-description">Deskripsi</Label>
                <textarea
                  id="new-description"
                  placeholder="Deskripsi menu..."
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-status">Status</Label>
                <select
                  id="new-status"
                  value={newMenu.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setNewMenu({ ...newMenu, isActive: e.target.value === 'active' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={handleAddMenu}
            >
              Tambah Menu
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
                  <Label htmlFor="edit-label">Label Menu *</Label>
                  <Input
                    id="edit-label"
                    value={editFormData.label}
                    onChange={(e) => handleEditInputChange('label', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-icon">Icon (Lucide) *</Label>
                  <Input
                    id="edit-icon"
                    value={editFormData.icon}
                    onChange={(e) => handleEditInputChange('icon', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-href">Path *</Label>
                  <Input
                    id="edit-href"
                    value={editFormData.href}
                    onChange={(e) => handleEditInputChange('href', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-order">Order *</Label>
                  <Input
                    id="edit-order"
                    type="number"
                    value={editFormData.order}
                    onChange={(e) => handleEditInputChange('order', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-description">Deskripsi</Label>
                  <textarea
                    id="edit-description"
                    value={editFormData.description}
                    onChange={(e) => handleEditInputChange('description', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => handleEditInputChange('isActive', e.target.value === 'active')}
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-brand-emerald hover:bg-brand-emerald/90"
              onClick={confirmEdit}
            >
              Simpan Perubahan
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
                  <strong>Perhatian:</strong> Menu yang dihapus akan hilang dari semua role.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
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
