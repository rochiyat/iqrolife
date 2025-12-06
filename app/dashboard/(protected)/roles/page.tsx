'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Check, X, Menu as MenuIcon, Loader } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
  permissions: any;
  is_active: boolean;
}

interface Permission {
  name: string;
  description: string;
  superadmin: boolean;
  staff: boolean;
  teacher: boolean;
  parent: boolean;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [menuAccess, setMenuAccess] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/dashboard/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.data || []);
        // Initialize menu access from roles
        const access: { [key: string]: string[] } = {};
        data.data.forEach((role: Role) => {
          access[role.name] = role.permissions?.menus || [];
        });
        setMenuAccess(access);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      alert('Gagal mengambil data roles');
    } finally {
      setIsLoading(false);
    }
  };

  const availableMenus = [
    { id: 'home', label: 'Dashboard', icon: '🏠' },
    { id: 'registrations', label: 'Registrasi', icon: '🎓' },
    { id: 'formulir-list', label: 'Formulir Review', icon: '📋' },
    { id: 'formulir', label: 'Formulir', icon: '📝' },
    { id: 'portofolio', label: 'Portofolio', icon: '🎨' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'roles', label: 'Roles', icon: '🛡️' },
    { id: 'menu', label: 'Menu', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const toggleMenuAccess = (roleName: string, menuId: string) => {
    console.log('roleName:', roleName);

    setMenuAccess((prev) => {
      const currentAccess = prev[roleName] || [];
      const hasAccess = currentAccess.includes(menuId);

      return {
        ...prev,
        [roleName]: hasAccess
          ? currentAccess.filter((id) => id !== menuId)
          : [...currentAccess, menuId],
      };
    });
  };

  const hasMenuAccess = (roleName: string, menuId: string): boolean => {
    return (menuAccess[roleName] || []).includes(menuId);
  };

  const handleSaveMenuAccess = async () => {
    try {
      setIsSaving(true);

      // Prepare batch update data
      const rolesToUpdate = roles.map((role) => ({
        id: role.id,
        permissions: {
          ...role.permissions,
          menus: menuAccess[role.name] || [],
        },
      }));

      // Send single batch request
      const response = await fetch('/api/dashboard/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rolesToUpdate), // Send as array
      });

      const result = await response.json();

      if (response.ok) {
        alert('Menu access berhasil disimpan!');
        await fetchRoles(); // Refresh data
      } else {
        alert(result.error || 'Gagal menyimpan menu access');
      }
    } catch (error) {
      console.error('Error saving menu access:', error);
      alert('Gagal menyimpan menu access');
    } finally {
      setIsSaving(false);
    }
  };

  const permissions: Permission[] = [
    {
      name: 'Akses Dashboard',
      description: 'Dapat mengakses dashboard utama',
      superadmin: true,
      staff: true,
      teacher: true,
      parent: true,
    },
    {
      name: 'Kelola Calon Murid',
      description: 'Dapat melihat, menambah, edit, dan hapus data calon murid',
      superadmin: true,
      staff: true,
      teacher: true,
      parent: false,
    },
    {
      name: 'Kelola Users',
      description: 'Dapat mengelola user sistem',
      superadmin: true,
      staff: false,
      teacher: false,
      parent: false,
    },
    {
      name: 'Kelola Roles',
      description: 'Dapat melihat dan mengatur role & permissions',
      superadmin: true,
      staff: false,
      teacher: false,
      parent: false,
    },
    {
      name: 'Kelola Menu',
      description: 'Dapat mengelola menu navigasi dashboard',
      superadmin: true,
      staff: false,
      teacher: false,
      parent: false,
    },
    {
      name: 'Kelola Formulir',
      description: 'Dapat mengakses dan mengelola formulir pendaftaran',
      superadmin: true,
      staff: true,
      teacher: false,
      parent: true,
    },
    {
      name: 'Kelola Settings',
      description: 'Dapat mengubah pengaturan sistem',
      superadmin: true,
      staff: false,
      teacher: false,
      parent: false,
    },
  ];

  const roleColors: { [key: string]: { color: string; icon: string } } = {
    superadmin: { color: 'from-purple-500 to-purple-700', icon: '👑' },
    staff: { color: 'from-blue-500 to-blue-700', icon: '💼' },
    teacher: { color: 'from-green-500 to-green-700', icon: '📚' },
    parent: { color: 'from-orange-500 to-orange-700', icon: '👨‍👩‍👧' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Roles & Permissions
        </h2>
        <p className="text-gray-600 mt-1">
          Kelola role pengguna dan hak aksesnya
        </p>
      </div>

      {/* Roles Overview */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-brand-emerald" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => {
            const colorConfig = roleColors[role.name.toLowerCase()] || {
              color: 'from-gray-500 to-gray-700',
              icon: '🔒',
            };
            return (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${colorConfig.color} rounded-lg flex items-center justify-center text-2xl mb-4`}
                  >
                    {colorConfig.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {role.display_name}
                  </h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        role.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {role.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Permissions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-emerald" />
            Matrix Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Permission
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role.id}
                      className="text-center py-4 px-4 font-semibold text-gray-700"
                    >
                      {role.display_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {permission.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {permission.description}
                        </div>
                      </div>
                    </td>
                    {roles.map((role) => {
                      let hasPermission = false;
                      if (role.name === 'superadmin')
                        hasPermission = permission.superadmin;
                      else if (role.name === 'staff')
                        hasPermission = permission.staff;
                      else if (role.name === 'teacher')
                        hasPermission = permission.teacher;
                      else if (role.name === 'parent')
                        hasPermission = permission.parent;

                      return (
                        <td key={role.id} className="py-4 px-4 text-center">
                          <div className="flex justify-center">
                            <div
                              className={`${
                                hasPermission
                                  ? 'bg-green-100 p-2 rounded-full'
                                  : 'bg-red-100 p-2 rounded-full'
                              }`}
                            >
                              {hasPermission ? (
                                <Check className="w-5 h-5 text-green-600" />
                              ) : (
                                <X className="w-5 h-5 text-red-600" />
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Menu Access Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MenuIcon className="w-5 h-5 text-brand-emerald" />
              Menu Access per Role
            </CardTitle>
            <Button
              size="sm"
              onClick={handleSaveMenuAccess}
              disabled={isSaving}
              className="bg-brand-emerald hover:bg-brand-emerald/90"
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700">
                    Menu
                  </th>
                  {roles.map((role) => (
                    <th
                      key={role.id}
                      className="text-center py-4 px-4 font-semibold text-gray-700"
                    >
                      {role.display_name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {availableMenus.map((menu) => (
                  <tr key={menu.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{menu.icon}</span>
                        <div className="font-medium text-gray-900">
                          {menu.label}
                        </div>
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="py-4 px-4 text-center">
                        <div className="flex justify-center">
                          <button
                            onClick={() => toggleMenuAccess(role.name, menu.id)}
                            className={`p-2 rounded-full transition-colors ${
                              hasMenuAccess(role.name, menu.id)
                                ? 'bg-green-100 hover:bg-green-200'
                                : 'bg-red-100 hover:bg-red-200'
                            }`}
                          >
                            {hasMenuAccess(role.name, menu.id) ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Info:</strong> Klik icon ✓ atau ✗ untuk mengubah akses
              menu untuk role tertentu. Jangan lupa klik "Simpan Perubahan"
              setelah melakukan modifikasi.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-brand-emerald/10 to-brand-cyan/10 border-brand-emerald/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-brand-emerald mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tentang Role Management
              </h3>
              <p className="text-sm text-gray-600">
                Role-based access control (RBAC) memastikan setiap pengguna
                hanya memiliki akses ke fitur yang sesuai dengan tanggung jawab
                mereka. Super Admin memiliki kontrol penuh, sementara role lain
                memiliki akses terbatas sesuai kebutuhan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
