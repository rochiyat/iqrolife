'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'superadmin' | 'staff' | 'teacher' | 'parent';

export interface UserPermissions {
  menus: string[];
  canAccessAll: boolean;
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageStudents: boolean;
  canManageForms: boolean;
  canManageFormsList: boolean;
  canManageSettings: boolean;
  canManageMenu: boolean;
  canViewPortfolio: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions?: UserPermissions;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Cek cookie dulu di client-side
      const cookieUser = getCookieUser();
      if (cookieUser) {
        setUser(cookieUser);
        setIsLoading(false);
        return;
      }

      // Fallback: validasi ke server jika cookie tidak ada
      const response = await fetch('/api/dashboard/login');
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCookieUser = () => {
    try {
      const cookies = document.cookie.split(';');
      const authCookie = cookies.find((c) =>
        c.trim().startsWith('auth-token=')
      );
      if (authCookie) {
        const value = authCookie.split('=')[1];
        return JSON.parse(decodeURIComponent(value));
      }
    } catch (error) {
      console.error('Error parsing cookie:', error);
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login gagal');
    }

    setUser(data.user);

    // Save accessible menus to localStorage
    // Menus are already fetched by login API and included in response
    try {
      const MENU_VERSION = '1.2'; // Increment this when menu structure changes

      if (data.menus && Array.isArray(data.menus)) {
        console.log(
          '📋 Menus received from login API:',
          data.menus.length,
          'items'
        );

        // Save to localStorage with version
        localStorage.setItem('accessible-menus', JSON.stringify(data.menus));
        localStorage.setItem('menus-role', data.user.role);
        localStorage.setItem('menus-version', MENU_VERSION);

        console.log('✅ Menus saved to localStorage');
        console.log('   - accessible-menus:', data.menus.length, 'items');
        console.log('   - menus-role:', data.user.role);
        console.log('   - menus-version:', MENU_VERSION);

        // Log menu names for debugging
        const menuNames = data.menus.map((m: any) => m.name).join(', ');
        console.log('   - menu names:', menuNames);
      } else {
        console.warn(
          '⚠️ No menus in login response, fetching from menu API...'
        );

        // Fallback: fetch from menu API if not included in login response
        const menuResponse = await fetch(
          `/api/dashboard/menu?role=${data.user.role}`
        );

        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          localStorage.setItem(
            'accessible-menus',
            JSON.stringify(menuData.data)
          );
          localStorage.setItem('menus-role', data.user.role);
          localStorage.setItem('menus-version', MENU_VERSION);
          console.log('✅ Menus fetched and saved (fallback)');
        } else {
          console.error('❌ Menu API failed:', menuResponse.status);
        }
      }
    } catch (error) {
      console.error('❌ Error saving menus to localStorage:', error);
      // Continue even if menu save fails
    }

    return data;
  };

  const logout = async () => {
    try {
      // Hapus cookie di client-side dulu (instant feedback)
      document.cookie = 'auth-token=; Max-Age=0; path=/; SameSite=Lax';

      // Clear localStorage (all menu-related data)
      localStorage.removeItem('accessible-menus');
      localStorage.removeItem('menus-role');
      localStorage.removeItem('menus-version');

      setUser(null);

      // Panggil API logout untuk cleanup di server
      await fetch('/api/dashboard/logout', {
        method: 'POST',
      });

      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap redirect meskipun API error
      router.push('/dashboard/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function hasPermission(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole);
}

// Helper function to get accessible menus from localStorage or cookie
export function getAccessibleMenusFromStorage(
  userRole: UserRole | null
): string[] {
  if (typeof window === 'undefined' || !userRole) return [];

  try {
    const MENU_VERSION = '1.2'; // Must match version in login()

    // Priority 1: Try localStorage (new method)
    const storedVersion = localStorage.getItem('menus-version');
    const storedRole = localStorage.getItem('menus-role');
    const storedMenus = localStorage.getItem('accessible-menus');

    // Clear old menu data if version mismatch
    if (storedVersion && storedVersion !== MENU_VERSION) {
      console.log('🔄 Menu version mismatch, clearing old data');
      localStorage.removeItem('accessible-menus');
      localStorage.removeItem('menus-role');
      localStorage.removeItem('menus-version');
      // Continue to try cookie method below
    } else if (storedRole === userRole && storedMenus) {
      // Valid localStorage data found
      const menus = JSON.parse(storedMenus);
      return menus.map((menu: any) => menu.name);
    }

    // Priority 2: Try reading from cookie (fallback for existing sessions)
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((c) => c.trim().startsWith('auth-token='));

    if (authCookie) {
      const value = authCookie.split('=')[1];
      const userData = JSON.parse(decodeURIComponent(value));

      // Check if user has accessibleMenus in cookie
      if (userData.accessibleMenus && Array.isArray(userData.accessibleMenus)) {
        console.log('📋 Reading menus from cookie (fallback)');

        // Save to localStorage for next time
        localStorage.setItem(
          'accessible-menus',
          JSON.stringify(userData.accessibleMenus)
        );
        localStorage.setItem('menus-role', userData.role);
        localStorage.setItem('menus-version', MENU_VERSION);

        return userData.accessibleMenus.map((menu: any) => menu.name);
      }
    }
  } catch (error) {
    console.error('Error reading menus from storage:', error);
  }

  return [];
}

// Helper function to get user permissions (from database or fallback)
export function getUserPermissions(user: User | null): UserPermissions {
  if (!user) {
    return {
      menus: [],
      canAccessAll: false,
      canManageUsers: false,
      canManageRoles: false,
      canManageStudents: false,
      canManageForms: false,
      canManageFormsList: false,
      canManageSettings: false,
      canManageMenu: false,
      canViewPortfolio: false,
    };
  }

  // Fallback to hardcoded permissions (for backward compatibility)
  const fallbackPermissions: { [key in UserRole]: UserPermissions } = {
    superadmin: {
      menus: [
        'home',
        'calon-murid',
        'formulir-list',
        'users',
        'roles',
        'menu',
        'formulir',
        'portofolio',
        'settings',
      ],
      canAccessAll: true,
      canManageUsers: true,
      canManageRoles: true,
      canManageStudents: true,
      canManageForms: true,
      canManageFormsList: true,
      canManageSettings: true,
      canManageMenu: true,
      canViewPortfolio: true,
    },
    staff: {
      menus: ['home', 'calon-murid', 'formulir-list', 'formulir', 'portofolio'],
      canAccessAll: false,
      canManageUsers: false,
      canManageRoles: false,
      canManageStudents: true,
      canManageForms: true,
      canManageFormsList: true,
      canManageSettings: false,
      canManageMenu: false,
      canViewPortfolio: true,
    },
    teacher: {
      menus: ['home', 'calon-murid', 'formulir-list', 'portofolio'],
      canAccessAll: false,
      canManageUsers: false,
      canManageRoles: false,
      canManageStudents: true,
      canManageForms: false,
      canManageFormsList: true,
      canManageSettings: false,
      canManageMenu: false,
      canViewPortfolio: true,
    },
    parent: {
      menus: ['home', 'formulir', 'portofolio'],
      canAccessAll: false,
      canManageUsers: false,
      canManageRoles: false,
      canManageStudents: false,
      canManageForms: true,
      canManageFormsList: false,
      canManageSettings: false,
      canManageMenu: false,
      canViewPortfolio: true,
    },
  };

  // Use permissions from database if available
  if (user.permissions) {
    // If menus is missing in DB permissions (common in old seed data), use fallback
    if (!user.permissions.menus || !Array.isArray(user.permissions.menus)) {
      const fallback =
        fallbackPermissions[user.role] || fallbackPermissions.parent;
      return {
        ...user.permissions,
        menus: fallback.menus,
      };
    }
    return user.permissions;
  }

  return fallbackPermissions[user.role] || fallbackPermissions.parent;
}

// Deprecated: Use getUserPermissions instead
// Kept for backward compatibility
export const rolePermissions = {
  superadmin: {
    canAccessAll: true,
    canManageUsers: true,
    canManageRoles: true,
    canManageStudents: true,
    canManageForms: true,
    canManageFormsList: true,
    canManageSettings: true,
    canManageMenu: true,
    canViewPortfolio: true,
  },
  staff: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canManageStudents: true,
    canManageForms: true,
    canManageFormsList: true,
    canManageSettings: false,
    canManageMenu: false,
    canViewPortfolio: true,
  },
  teacher: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canManageStudents: true,
    canManageForms: false,
    canManageFormsList: true,
    canManageSettings: false,
    canManageMenu: false,
    canViewPortfolio: true,
  },
  parent: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canManageStudents: false,
    canManageForms: true,
    canManageFormsList: false,
    canManageSettings: false,
    canManageMenu: false,
    canViewPortfolio: true,
  },
};
