'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Role {
  id: string;
  name: string;
  displayName: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  roleId?: string;
  role?: Role;
  roleName?: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Fetch user data
    fetch('/api/dashboard/login')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/dashboard/login');
        }
      })
      .catch(() => {
        router.push('/dashboard/login');
      });
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/dashboard/logout', { method: 'POST' });
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Role-based menu access control
  const getRoleBasedNavigation = () => {
    const roleName = user?.role?.name || user?.roleName;
    
    const allNavigation = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        active: pathname === '/dashboard',
        roles: ['admin', 'teacher', 'staff', 'parent'], // All roles
      },
      {
        name: 'Calon Murid',
        href: '/dashboard/calon-murid',
        icon: UserCheck,
        active: pathname.startsWith('/dashboard/calon-murid'),
        roles: ['admin', 'staff'], // Admin and Staff only
      },
      {
        name: 'Users',
        href: '/dashboard/users',
        icon: Users,
        active: pathname.startsWith('/dashboard/users'),
        roles: ['admin'], // Admin only
      },
      {
        name: 'Roles',
        href: '/dashboard/roles',
        icon: Shield,
        active: pathname.startsWith('/dashboard/roles'),
        roles: ['admin'], // Admin only
      },
    ];

    // Filter navigation based on user role
    return allNavigation.filter(nav => nav.roles.includes(roleName || 'parent'));
  };

  const navigation = getRoleBasedNavigation();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-emerald"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-brand-emerald">
            <Link href="/dashboard" className="flex items-center gap-2">
              <img
                src="/iqrolife-logo.jpg"
                alt="Iqrolife"
                className="h-8 w-8 rounded"
              />
              <span className="text-white font-bold text-lg">Dashboard</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-emerald flex items-center justify-center text-white font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-lime/20 text-brand-dark-brown">
                  {user.role?.displayName || user.roleName || 'User'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-brand-emerald text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-900"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            Kembali ke Website →
          </Link>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
