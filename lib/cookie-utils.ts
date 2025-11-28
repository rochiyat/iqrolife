/**
 * Utility functions untuk handle cookies di client-side
 */

export interface CookieUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'staff' | 'teacher' | 'parent';
  avatar?: string;
  phone?: string;
  is_active: boolean;
}

/**
 * Get user data dari cookie 'auth-token'
 */
export function getCookieUser(): CookieUser | null {
  try {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((c) => c.trim().startsWith('auth-token='));

    if (authCookie) {
      const value = authCookie.split('=')[1];
      const decoded = decodeURIComponent(value);
      return JSON.parse(decoded);
    }
  } catch (error) {
    console.error('Error parsing auth cookie:', error);
  }
  return null;
}

/**
 * Check apakah user sudah login (cookie exists)
 */
export function isAuthenticated(): boolean {
  return getCookieUser() !== null;
}

/**
 * Hapus cookie auth-token (logout)
 */
export function clearAuthCookie(): void {
  document.cookie = 'auth-token=; Max-Age=0; path=/; SameSite=Lax';
}

/**
 * Get user role dari cookie
 */
export function getUserRole(): CookieUser['role'] | null {
  const user = getCookieUser();
  return user?.role || null;
}

/**
 * Check apakah user punya role tertentu
 */
export function hasRole(roles: CookieUser['role'][]): boolean {
  const userRole = getUserRole();
  return userRole ? roles.includes(userRole) : false;
}
