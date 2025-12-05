'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './api';

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

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: any;
    menus: any[];
    token: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MENU_VERSION = '2.0';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Validate token with backend
      const response = await api.getMe();
      if (response.success && response.data) {
        const userData = response.data;
        setUser({
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name,
          role: userData.role,
          avatar: userData.avatar,
          permissions: userData.permissions,
        });

        // Update menus in localStorage
        if (userData.accessibleMenus) {
          localStorage.setItem(
            'accessible-menus',
            JSON.stringify(userData.accessibleMenus)
          );
          localStorage.setItem('menus-role', userData.role);
          localStorage.setItem('menus-version', MENU_VERSION);
        }
      } else {
        // Invalid token, clear it
        localStorage.removeItem('auth-token');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth-token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);

    if (!response.success) {
      throw new Error(response.message || 'Login gagal');
    }

    const { user: userData, menus, token } = response.data;

    // Save token to localStorage and cookie (for API routes)
    localStorage.setItem('auth-token', token);
    document.cookie = `auth-token=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }; SameSite=Lax`;

    // Set user state
    setUser({
      id: userData.id.toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      avatar: userData.avatar,
      permissions: userData.permissions,
    });

    // Save menus to localStorage
    if (menus && Array.isArray(menus)) {
      localStorage.setItem('accessible-menus', JSON.stringify(menus));
      localStorage.setItem('menus-role', userData.role);
      localStorage.setItem('menus-version', MENU_VERSION);
    }

    return response;
  };

  const logout = async () => {
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('accessible-menus');
    localStorage.removeItem('menus-role');
    localStorage.removeItem('menus-version');

    // Clear old cookie if exists
    document.cookie = 'auth-token=; Max-Age=0; path=/; SameSite=Lax';

    setUser(null);
    router.push('/dashboard/login');
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

export function getAccessibleMenusFromStorage(
  userRole: UserRole | null
): string[] {
  if (typeof window === 'undefined' || !userRole) return [];

  try {
    const storedVersion = localStorage.getItem('menus-version');
    const storedRole = localStorage.getItem('menus-role');
    const storedMenus = localStorage.getItem('accessible-menus');

    if (storedVersion !== MENU_VERSION) {
      localStorage.removeItem('accessible-menus');
      localStorage.removeItem('menus-role');
      localStorage.removeItem('menus-version');
      return [];
    }

    if (storedRole === userRole && storedMenus) {
      const menus = JSON.parse(storedMenus);
      return menus.map((menu: any) => menu.name);
    }
  } catch (error) {
    console.error('Error reading menus from storage:', error);
  }

  return [];
}

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

  const fallbackPermissions: { [key in UserRole]: UserPermissions } = {
    superadmin: {
      menus: [
        'home',
        'registrations',
        'formulir-list',
        'users',
        'roles',
        'coupons',
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
      menus: [
        'home',
        'registrations',
        'formulir-list',
        'formulir',
        'portofolio',
      ],
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
      menus: ['home', 'registrations', 'formulir-list', 'portofolio'],
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

  if (user.permissions) {
    if (!user.permissions.menus || !Array.isArray(user.permissions.menus)) {
      const fallback =
        fallbackPermissions[user.role] || fallbackPermissions.parent;
      return { ...user.permissions, menus: fallback.menus };
    }
    return user.permissions;
  }

  return fallbackPermissions[user.role] || fallbackPermissions.parent;
}

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
