'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Menu as MenuIcon,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { rolePermissions, type UserRole } from '@/lib/auth-context';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/dashboard/login');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          router.push('/dashboard/login');
        }
      } else {
        router.push('/dashboard/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/dashboard/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/dashboard/logout', {
        method: 'POST',
      });
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    const permissions = rolePermissions[user.role];
    const items = [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard/home',
        show: true,
      },
      {
        label: 'Calon Murid',
        icon: GraduationCap,
        href: '/dashboard/calon-murid',
        show: permissions.canManageStudents,
      },
      {
        label: 'Users',
        icon: Users,
        href: '/dashboard/users',
        show: permissions.canManageUsers,
      },
      {
        label: 'Roles',
        icon: UserCog,
        href: '/dashboard/roles',
        show: permissions.canManageRoles,
      },
      {
        label: 'Menu',
        icon: MenuIcon,
        href: '/dashboard/menu',
        show: permissions.canManageMenu,
      },
      {
        label: 'Formulir',
        icon: FileText,
        href: '/dashboard/formulir',
        show: permissions.canManageForms,
      },
      {
        label: 'Portofolio',
        icon: Briefcase,
        href: '/dashboard/portofolio',
        show: permissions.canViewPortfolio,
      },
      {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        show: permissions.canManageSettings,
      },
    ];

    return items.filter((item) => item.show);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-sky/30 via-brand-lime/20 to-brand-emerald/30">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-gray font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-brand-sky/10 to-brand-lime/10">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-brand-emerald to-brand-cyan border-b-4 border-brand-lime sticky top-0 z-30 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:bg-white/20"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Dashboard Iqrolife
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-brand-lime capitalize font-semibold">
                {user.role}
              </p>
            </div>
            <Avatar className="ring-2 ring-brand-lime">
              <AvatarFallback className="bg-gradient-to-br from-brand-lime to-brand-coral text-brand-warm-brown font-bold">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] 
            bg-gradient-to-b from-white to-brand-sky/20 border-r-4 border-brand-lime/30 transition-transform duration-300 z-20 shadow-xl
            ${
              isSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'
            }
            w-64
          `}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-emerald to-brand-cyan text-white shadow-lg scale-105 font-bold'
                        : 'text-brand-gray hover:bg-gradient-to-r hover:from-brand-lime/20 hover:to-brand-sky/20 hover:scale-102 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-brand-coral hover:bg-brand-coral/10 hover:scale-102 transition-all duration-300 font-medium border-2 border-transparent hover:border-brand-coral/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
