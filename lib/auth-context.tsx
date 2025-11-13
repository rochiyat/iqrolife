'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'superadmin' | 'staff' | 'teacher' | 'parent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
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
    return data;
  };

  const logout = async () => {
    try {
      await fetch('/api/dashboard/logout', {
        method: 'POST',
      });
      setUser(null);
      router.push('/dashboard/login');
    } catch (error) {
      console.error('Logout error:', error);
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

export const roleMenuAccess = {
  superadmin: [
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
  staff: ['home', 'calon-murid', 'formulir-list', 'formulir', 'portofolio'],
  teacher: ['home', 'calon-murid', 'formulir-list', 'portofolio'],
  parent: ['home', 'formulir', 'portofolio'],
};
