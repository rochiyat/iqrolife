'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  Settings,
  Menu,
  X,
  GraduationCap,
  Menu as MenuIcon,
  Briefcase,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getUserPermissions,
  getAccessibleMenusFromStorage,
  useAuth,
} from '@/lib/auth-context';
import { ProfileDropdown } from '@/components/dashboard/ProfileDropdown';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/dashboard/login');
    }
  }, [isLoading, user, router]);

  const getNavItems = () => {
    if (!user) return [];

    // Priority 1: Try to get menus from localStorage (fastest)
    let accessibleMenus = getAccessibleMenusFromStorage(user.role);
    console.log('accessibleMenus', accessibleMenus);

    // Priority 2: Fallback to permissions from user object (from database)
    if (accessibleMenus.length === 0) {
      const permissions = getUserPermissions(user);
      accessibleMenus = permissions.menus || [];
    }

    // Main menu items (without group)
    const mainItems = [
      {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard/home',
        menuId: 'home',
        show: accessibleMenus.includes('home'),
      },
      {
        label: 'Registrasi',
        icon: GraduationCap,
        href: '/dashboard/registrations',
        menuId: 'registrations',
        show:
          accessibleMenus.includes('registrations') ||
          accessibleMenus.includes('calon-murid'),
      },
      {
        label: 'Formulir Review',
        icon: FileText,
        href: '/dashboard/formulir-list',
        menuId: 'formulir-list',
        show: accessibleMenus.includes('formulir-list'),
      },
      {
        label: 'Formulir',
        icon: FileText,
        href: '/dashboard/formulir',
        menuId: 'formulir',
        show: accessibleMenus.includes('formulir'),
      },
      {
        label: 'Portofolio',
        icon: Briefcase,
        href: '/dashboard/portofolio',
        menuId: 'portofolio',
        show: accessibleMenus.includes('portofolio'),
      },
    ];

    // Settings group items
    const settingsItems = [
      {
        label: 'Users',
        icon: Users,
        href: '/dashboard/users',
        menuId: 'users',
        show: accessibleMenus.includes('users'),
      },
      {
        label: 'Roles',
        icon: UserCog,
        href: '/dashboard/roles',
        menuId: 'roles',
        show: accessibleMenus.includes('roles'),
      },
      {
        label: 'Coupons',
        icon: Ticket,
        href: '/dashboard/coupons',
        menuId: 'coupons',
        show:
          accessibleMenus.includes('coupons') || user?.role === 'superadmin',
      },
      {
        label: 'Menu',
        icon: MenuIcon,
        href: '/dashboard/menu',
        menuId: 'menu',
        show: accessibleMenus.includes('menu'),
      },
      {
        label: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        menuId: 'settings',
        show: accessibleMenus.includes('settings'),
      },
    ];

    return {
      main: mainItems.filter((item) => item.show),
      settings: settingsItems.filter((item) => item.show),
    };
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

  const navItems = getNavItems() as {
    main: Array<{
      label: string;
      icon: any;
      href: string;
      show: boolean;
    }>;
    settings: Array<{
      label: string;
      icon: any;
      href: string;
      show: boolean;
    }>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-off-white via-brand-sky/10 to-brand-lime/10">
      {/* Top Navigation */}
      <header className="bg-gradient-to-r from-brand-emerald to-brand-cyan border-b-4 border-brand-lime sticky top-0 z-40 shadow-lg">
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

          <ProfileDropdown
            user={{
              name: user.name,
              email: user.email,
              role: user.role,
              avatar: user.avatar,
            }}
          />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] 
            bg-gradient-to-b from-white to-brand-sky/20 border-r-4 border-brand-lime/30 transition-transform duration-300 z-20 shadow-xl overflow-y-auto
            ${
              isSidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'
            }
            w-64
          `}
        >
          <nav className="p-4 space-y-6">
            {/* Main Menu Items */}
            <div className="space-y-1">
              {navItems.main.map((item) => {
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
            </div>

            {/* Settings Group */}
            {navItems.settings.length > 0 && (
              <div className="space-y-1">
                <div className="px-4 py-2">
                  <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-wider">
                    Settings
                  </h3>
                </div>
                {navItems.settings.map((item) => {
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
              </div>
            )}
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
