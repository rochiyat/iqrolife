'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Mail, Phone, X as XIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[]; // Multiple roles support
  status: 'active' | 'inactive';
  createdAt: string;
}

const availableRoles = [
  { value: 'superadmin', label: 'Super Admin', color: 'bg-purple-100 text-purple-800' },
  { value: 'staff', label: 'Staff', color: 'bg-blue-100 text-blue-800' },
  { value: 'teacher', label: 'Teacher', color: 'bg-green-100 text-green-800' },
  { value: 'parent', label: 'Parent', color: 'bg-orange-100 text-orange-800' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'superadmin@iqrolife.com',
      phone: '081234567890',
      roles: ['superadmin'],
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Staff Iqrolife',
      email: 'staff@iqrolife.com',
      phone: '081234567891',
      roles: ['staff'],
      status: 'active',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Ustadz Ahmad',
      email: 'teacher@iqrolife.com',
      phone: '081234567892',
      roles: ['teacher', 'staff'],
      status: 'active',
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Ibu Siti',
      email: 'parent@iqrolife.com',
      phone: '081234567893',
      roles: ['parent'],
      status: 'active',
      createdAt: '2024-04-05',
    },
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    const roleConfig = availableRoles.find(r => r.value === role);
    return roleConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = availableRoles.find(r => r.value === role);
    return roleConfig?.label || role;
  };

  const handleEdit = (user: User) => {
    setEditFormData({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: keyof User, value: any) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const toggleRole = (role: string) => {
    if (!editFormData) return;
    
    const currentRoles = editFormData.roles;
    const hasRole = currentRoles.includes(role);
    
    const newRoles = hasRole
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    
    handleEditInputChange('roles', newRoles);
  };

  const confirmEdit = () => {
    if (editFormData) {
      if (editFormData.roles.length === 0) {
        alert('User harus memiliki minimal 1 role!');
        return;
      }
      
      setUsers(users.map(u => 
        u.id === editFormData.id ? editFormData : u
      ));
      alert(`Data ${editFormData.name} berhasil diupdate!`);
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      alert(`User ${selectedUser.name} berhasil dihapus!`);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const getUserRoleCount = (role: string) => {
    return users.filter(u => u.roles.includes(role)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600 mt-1">
            Kelola akses dan informasi pengguna sistem
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
              <Plus className="w-4 h-4 mr-2" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Masukkan email" />
              </div>
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input placeholder="Masukkan no. telepon" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="staff">Staff</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" placeholder="Masukkan password" />
              </div>
              <div className="space-y-2">
                <Label>Konfirmasi Password</Label>
                <Input type="password" placeholder="Konfirmasi password" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-brand-emerald hover:bg-brand-emerald/90">
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Daftar Users</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari user..."
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
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Telepon
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Roles
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-emerald to-brand-cyan rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role, index) => (
                          <span 
                            key={index} 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                          >
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(user)}
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-emerald">{users.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
            </div>
          </CardContent>
        </Card>
        {availableRoles.map((role) => (
          <Card key={role.value}>
            <CardContent className="p-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  role.value === 'superadmin' ? 'text-purple-600' :
                  role.value === 'staff' ? 'text-blue-600' :
                  role.value === 'teacher' ? 'text-green-600' :
                  'text-orange-600'
                }`}>
                  {getUserRoleCount(role.value)}
                </div>
                <div className="text-sm text-gray-600 mt-1">{role.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editFormData && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nama Lengkap</Label>
                  <Input
                    id="edit-name"
                    value={editFormData.name}
                    onChange={(e) => handleEditInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleEditInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">No. Telepon</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) => handleEditInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.status}
                    onChange={(e) => handleEditInputChange('status', e.target.value as 'active' | 'inactive')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Roles (bisa lebih dari 1)</Label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-3">
                      {availableRoles.map((role) => (
                        <div key={role.value} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`role-${role.value}`}
                            checked={editFormData.roles.includes(role.value)}
                            onChange={() => toggleRole(role.value)}
                            className="w-4 h-4 rounded border-gray-300 text-brand-emerald focus:ring-brand-emerald"
                          />
                          <label 
                            htmlFor={`role-${role.value}`}
                            className="flex-1 cursor-pointer"
                          >
                            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${role.color} inline-block`}>
                              {role.label}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    {editFormData.roles.length === 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        * Minimal pilih 1 role
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Role yang dipilih:</span>
                    {editFormData.roles.map((role, index) => (
                      <span 
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(role)}`}
                      >
                        {getRoleLabel(role)}
                        <button
                          onClick={() => toggleRole(role)}
                          className="hover:bg-black/10 rounded-full p-0.5"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
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
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 mb-3">
                  Apakah Anda yakin ingin menghapus user berikut?
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama:</span>
                    <span className="font-medium">{selectedUser.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Roles:</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {selectedUser.roles.map((role, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(role)}`}
                        >
                          {getRoleLabel(role)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Perhatian:</strong> User yang dihapus tidak dapat dikembalikan dan akan kehilangan akses ke sistem.
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
              Hapus User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
