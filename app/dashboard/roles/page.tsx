'use client';

import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Check,
  X,
} from 'lucide-react';

interface Permission {
  name: string;
  path: string;
  icon: any;
  admin: boolean;
  teacher: boolean;
  staff: boolean;
  parent: boolean;
}

export default function RolesPage() {
  const permissions: Permission[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      admin: true,
      teacher: true,
      staff: true,
      parent: true,
    },
    {
      name: 'Calon Murid',
      path: '/dashboard/calon-murid',
      icon: UserCheck,
      admin: true,
      teacher: false,
      staff: true,
      parent: false,
    },
    {
      name: 'Users Management',
      path: '/dashboard/users',
      icon: Users,
      admin: true,
      teacher: false,
      staff: false,
      parent: false,
    },
    {
      name: 'Roles Management',
      path: '/dashboard/roles',
      icon: Shield,
      admin: true,
      teacher: false,
      staff: false,
      parent: false,
    },
  ];

  const roles = [
    {
      name: 'Admin',
      key: 'admin',
      description: 'Full access ke seluruh sistem',
      color: 'bg-purple-500',
    },
    {
      name: 'Teacher',
      key: 'teacher',
      description: 'Akses terbatas ke data siswa',
      color: 'bg-blue-500',
    },
    {
      name: 'Staff',
      key: 'staff',
      description: 'Akses ke pendaftaran dan data siswa',
      color: 'bg-green-500',
    },
    {
      name: 'Parent',
      key: 'parent',
      description: 'Akses terbatas untuk orang tua siswa',
      color: 'bg-orange-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">
            Kelola hak akses berdasarkan role pengguna
          </p>
        </div>

        {/* Roles Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card key={role.key} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center`}>
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Matriks Hak Akses Menu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-700">Menu</th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      <Badge className="bg-purple-500">Admin</Badge>
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      <Badge className="bg-blue-500">Teacher</Badge>
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      <Badge className="bg-green-500">Staff</Badge>
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      <Badge className="bg-orange-500">Parent</Badge>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => {
                    const Icon = permission.icon;
                    return (
                      <tr key={permission.path} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">{permission.name}</div>
                              <div className="text-sm text-gray-500">{permission.path}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          {permission.admin ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {permission.teacher ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {permission.staff ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {permission.parent ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Role Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => {
            const rolePermissions = permissions.filter(
              (p) => p[role.key as keyof Permission] === true
            );

            return (
              <Card key={role.key}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center`}>
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>{role.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-gray-700">Menu yang dapat diakses:</h4>
                    <div className="space-y-2">
                      {rolePermissions.map((permission) => {
                        const Icon = permission.icon;
                        return (
                          <div
                            key={permission.path}
                            className="flex items-center gap-2 text-sm text-gray-700 p-2 rounded bg-gray-50"
                          >
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span>{permission.name}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Total akses: <span className="font-semibold">{rolePermissions.length} menu</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Informasi Roles</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Admin</strong>: Memiliki akses penuh ke seluruh sistem termasuk user management</li>
                  <li>• <strong>Teacher</strong>: Akses terbatas hanya ke dashboard dan data siswa</li>
                  <li>• <strong>Staff</strong>: Dapat mengelola pendaftaran siswa dan melihat data siswa</li>
                  <li>• <strong>Parent</strong>: Akses terbatas hanya ke dashboard untuk melihat informasi anaknya</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
