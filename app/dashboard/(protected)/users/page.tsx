'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  X as XIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

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
  {
    value: 'superadmin',
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-800',
  },
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Form data untuk add user
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'parent',
  });

  // Fetch users dari API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/users');
      const data = await response.json();

      if (response.ok && data.users) {
        // Transform data untuk match dengan interface User
        const transformedUsers = data.users.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          roles: [user.role], // Single role dari backend
          status: (user.isActive ?? user.is_active) ? 'active' : 'inactive',
          createdAt: new Date(user.createdAt || user.created_at).toISOString().split('T')[0],
        }));
        setUsers(transformedUsers);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Gagal memuat data users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages =
    itemsPerPage === -1 ? 1 : Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = itemsPerPage === -1 ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex =
    itemsPerPage === -1 ? filteredUsers.length : startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search term or items per page changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value === 'all' ? -1 : parseInt(value));
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role: string) => {
    const roleConfig = availableRoles.find((r) => r.value === role);
    return roleConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = availableRoles.find((r) => r.value === role);
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
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];

    handleEditInputChange('roles', newRoles);
  };

  const confirmEdit = () => {
    if (editFormData) {
      if (editFormData.roles.length === 0) {
        alert('User harus memiliki minimal 1 role!');
        return;
      }

      setUsers(users.map((u) => (u.id === editFormData.id ? editFormData : u)));
      alert(`Data ${editFormData.name} berhasil diupdate!`);
      setIsEditDialogOpen(false);
      setEditFormData(null);
    }
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      const response = await fetch(
        `/api/dashboard/users?id=${selectedUser.id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(`User ${selectedUser.name} berhasil dihapus!`);
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh data
      } else {
        setError(data.error || 'Gagal menghapus user');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menghapus user');
    } finally {
      setSubmitting(false);
    }
  };

  const getUserRoleCount = (role: string) => {
    return users.filter((u) => u.roles.includes(role)).length;
  };

  // Handle add user dengan email notification
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newUserData.name || !newUserData.email || !newUserData.role) {
      setError('Semua field harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/dashboard/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.emailSent) {
          setMessage(
            `User berhasil dibuat! Email verifikasi telah dikirim ke ${newUserData.email}`
          );
        } else {
          setMessage(
            `User berhasil dibuat, tetapi email gagal dikirim. Password sementara: ${data.tempPassword}`
          );
        }

        setIsAddDialogOpen(false);
        setNewUserData({ name: '', email: '', phone: '', role: 'parent' });
        fetchUsers(); // Refresh data
      } else {
        setError(data.error || 'Gagal membuat user');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat membuat user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

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
              <p className="text-sm text-gray-600 mt-2">
                Password sementara akan digenerate otomatis dan dikirim ke email
                user
              </p>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap *</Label>
                  <Input
                    placeholder="Masukkan nama lengkap"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, name: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="Masukkan email"
                    value={newUserData.email}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, email: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label>No. Telepon</Label>
                  <Input
                    placeholder="Masukkan no. telepon"
                    value={newUserData.phone}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, phone: e.target.value })
                    }
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={newUserData.role}
                    onChange={(e) =>
                      setNewUserData({ ...newUserData, role: e.target.value })
                    }
                    required
                    disabled={submitting}
                  >
                    <option value="parent">Parent</option>
                    <option value="teacher">Teacher</option>
                    <option value="staff">Staff</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
              </div>
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <Mail className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 text-sm">
                  Email berisi informasi login dan password sementara akan
                  dikirim ke alamat email yang didaftarkan.
                </AlertDescription>
              </Alert>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-emerald hover:bg-brand-emerald/90"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Buat & Kirim Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-emerald">
                {users.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Users</div>
            </div>
          </CardContent>
        </Card>
        {availableRoles.map((role) => (
          <Card key={role.value}>
            <CardContent className="p-6">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${
                    role.value === 'superadmin'
                      ? 'text-purple-600'
                      : role.value === 'staff'
                      ? 'text-blue-600'
                      : role.value === 'teacher'
                      ? 'text-green-600'
                      : 'text-orange-600'
                  }`}
                >
                  {getUserRoleCount(role.value)}
                </div>
                <div className="text-sm text-gray-600 mt-1">{role.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <h3 className="text-lg font-semibold">Daftar Users</h3>
            <div className="flex-1"></div>
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-gray-600 whitespace-nowrap">
                Show:
              </Label>
              <select
                value={itemsPerPage === -1 ? 'all' : itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-emerald" />
              <span className="ml-2 text-gray-600">Memuat data users...</span>
            </div>
          ) : (
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        Tidak ada data user
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#4caade] to-[#3a8fc7] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
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
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                  role
                                )}`}
                              >
                                {getRoleLabel(role)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {!loading && itemsPerPage !== -1 && filteredUsers.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {startIndex + 1} -{' '}
                {Math.min(endIndex, filteredUsers.length)} dari{' '}
                {filteredUsers.length} data
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer ${
                          currentPage === page
                            ? 'bg-brand-emerald hover:bg-emerald-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="cursor-pointer hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
                    onChange={(e) =>
                      handleEditInputChange('name', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      handleEditInputChange('email', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">No. Telepon</Label>
                  <Input
                    id="edit-phone"
                    value={editFormData.phone}
                    onChange={(e) =>
                      handleEditInputChange('phone', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <select
                    id="edit-status"
                    value={editFormData.status}
                    onChange={(e) =>
                      handleEditInputChange(
                        'status',
                        e.target.value as 'active' | 'inactive'
                      )
                    }
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
                        <div
                          key={role.value}
                          className="flex items-center gap-3"
                        >
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
                            <span
                              className={`px-3 py-1.5 rounded-full text-sm font-medium ${role.color} inline-block`}
                            >
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
                    <span className="text-sm text-gray-600">
                      Role yang dipilih:
                    </span>
                    {editFormData.roles.map((role, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleBadgeColor(
                          role
                        )}`}
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
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
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
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            role
                          )}`}
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
                  <strong>Perhatian:</strong> User yang dihapus tidak dapat
                  dikembalikan dan akan kehilangan akses ke sistem.
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
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
