'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Check, X } from 'lucide-react';

interface Permission {
  name: string;
  description: string;
  superadmin: boolean;
  staff: boolean;
  teacher: boolean;
  parent: boolean;
}

export default function RolesPage() {
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

  const roles = [
    {
      name: 'Super Admin',
      key: 'superadmin',
      description: 'Akses penuh ke semua fitur sistem',
      color: 'from-purple-500 to-purple-700',
      icon: '👑',
    },
    {
      name: 'Staff',
      key: 'staff',
      description: 'Mengelola operasional dan data siswa',
      color: 'from-blue-500 to-blue-700',
      icon: '💼',
    },
    {
      name: 'Teacher',
      key: 'teacher',
      description: 'Mengelola data siswa dan pembelajaran',
      color: 'from-green-500 to-green-700',
      icon: '📚',
    },
    {
      name: 'Parent',
      key: 'parent',
      description: 'Mengisi formulir dan melihat info anak',
      color: 'from-orange-500 to-orange-700',
      icon: '👨‍👩‍👧',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Roles & Permissions</h2>
        <p className="text-gray-600 mt-1">
          Kelola role pengguna dan hak aksesnya
        </p>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.key} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {role.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {role.name}
              </h3>
              <p className="text-sm text-gray-600">
                {role.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                    <th key={role.key} className="text-center py-4 px-4 font-semibold text-gray-700">
                      {role.icon} {role.name}
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
                    <td className="py-4 px-4 text-center">
                      {permission.superadmin ? (
                        <div className="flex justify-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {permission.staff ? (
                        <div className="flex justify-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {permission.teacher ? (
                        <div className="flex justify-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {permission.parent ? (
                        <div className="flex justify-center">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="w-5 h-5 text-green-600" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="bg-red-100 p-2 rounded-full">
                            <X className="w-5 h-5 text-red-600" />
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Role-based access control (RBAC) memastikan setiap pengguna hanya memiliki akses 
                ke fitur yang sesuai dengan tanggung jawab mereka. Super Admin memiliki kontrol penuh, 
                sementara role lain memiliki akses terbatas sesuai kebutuhan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
