'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Role {
  id: string;
  name: string;
  displayName: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    roleId: '',
    password: '',
  });

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [roleFilter, search]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/dashboard/roles');
      const data = await response.json();
      if (data.roles) {
        setRoles(data.roles);
        if (!formData.roleId && data.roles.length > 0) {
          const staffRole = data.roles.find((r: Role) => r.name === 'staff');
          setFormData(prev => ({ ...prev, roleId: staffRole?.id || data.roles[0].id }));
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('roleId', roleFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/dashboard/users?${params}`);
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/dashboard/users';
      const method = editMode ? 'PUT' : 'POST';
      const body: any = {
        email: formData.email,
        name: formData.name,
        roleId: formData.roleId,
      };

      if (editMode && selectedUser) {
        body.userId = selectedUser.id;
      }

      if (formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message + (data.password ? `\n\nPassword: ${data.password}` : ''));
        if (data.password) {
          setGeneratedPassword(data.password);
        }
        fetchUsers();
        setDialogOpen(false);
        resetForm();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleEdit = (user: User) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      roleId: user.roleId,
      password: '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/users?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchUsers();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Terjadi kesalahan');
    }
  };

  const resetForm = () => {
    const staffRole = roles.find(r => r.name === 'staff');
    setFormData({ email: '', name: '', roleId: staffRole?.id || '', password: '' });
    setEditMode(false);
    setSelectedUser(null);
    setGeneratedPassword('');
  };

  const getRoleBadge = (user: User) => {
    const roleName = user.role?.name || 'unknown';
    const displayName = user.role?.displayName || 'Unknown';
    
    switch (roleName) {
      case 'admin':
        return <Badge className="bg-purple-500">{displayName}</Badge>;
      case 'teacher':
        return <Badge className="bg-blue-500">{displayName}</Badge>;
      case 'staff':
        return <Badge className="bg-green-500">{displayName}</Badge>;
      case 'parent':
        return <Badge className="bg-orange-500">{displayName}</Badge>;
      default:
        return <Badge>{displayName}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600 mt-1">Kelola user admin, staff, dan teacher</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
            className="bg-brand-emerald hover:bg-brand-emerald/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={roleFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setRoleFilter('all')}
                >
                  Semua
                </Button>
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    variant={roleFilter === role.id ? 'default' : 'outline'}
                    onClick={() => setRoleFilter(role.id)}
                  >
                    {role.displayName}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald mx-auto"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Tidak ada data user</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-semibold text-gray-700">Nama</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Email</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Role</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Dibuat</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium text-gray-900">{user.name}</td>
                        <td className="p-3 text-gray-600">{user.email}</td>
                        <td className="p-3">{getRoleBadge(user)}</td>
                        <td className="p-3 text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit User' : 'Tambah User'}</DialogTitle>
            <DialogDescription>
              {editMode
                ? 'Update informasi user. Kosongkan password jika tidak ingin mengubah.'
                : 'Buat user baru. Password akan di-generate otomatis jika tidak diisi.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="password">
                Password {editMode && '(kosongkan jika tidak diubah)'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={editMode ? 'Kosongkan jika tidak diubah' : 'Auto-generate jika kosong'}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button type="submit" className="bg-brand-emerald hover:bg-brand-emerald/90">
                {editMode ? 'Update' : 'Buat User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
