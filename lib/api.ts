const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://iqrolife-backend.vercel.app';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  }

  // Auth - menggunakan proxy routes untuk menghindari CORS
  async login(email: string, password: string) {
    // Gunakan proxy route Next.js untuk menghindari CORS
    const response = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    // Konversi format response dari proxy route ke format yang diharapkan
    return {
      success: true,
      message: data.message || 'Login berhasil',
      data: {
        user: data.user,
        menus: data.menus,
        token: data.token,
      },
    };
  }

  async register(name: string, email: string, password: string, role?: string) {
    return this.request<any>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async getMe() {
    // Gunakan proxy route Next.js untuk menghindari CORS
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('/api/dashboard/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include', // Pastikan cookie juga dikirim sebagai fallback
    });

    const data = await response.json();

    if (!response.ok || !data.authenticated) {
      throw new Error(data.error || 'Authentication failed');
    }

    // Format response sesuai dengan yang diharapkan
    return {
      success: true,
      data: data.user,
    };
  }

  // Users
  async getUsers(params?: { role?: string; search?: string }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any>(`/api/users${query}`);
  }

  async createUser(data: {
    email: string;
    name: string;
    role: string;
    phone?: string;
  }) {
    return this.request<any>('/api/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(data: {
    id: number;
    email?: string;
    name?: string;
    role?: string;
    phone?: string;
    is_active?: boolean;
  }) {
    return this.request<any>('/api/users', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: number) {
    return this.request<any>(`/api/users?id=${id}`, { method: 'DELETE' });
  }

  // Roles
  async getRoles() {
    return this.request<any>('/api/roles');
  }

  async createRole(data: any) {
    return this.request<any>('/api/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRole(data: any) {
    return this.request<any>('/api/roles', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: number) {
    return this.request<any>(`/api/roles?id=${id}`, { method: 'DELETE' });
  }

  // Menu
  async getMenu(role?: string) {
    const query = role ? `?role=${role}` : '';
    return this.request<any>(`/api/menu${query}`);
  }

  async createMenu(data: any) {
    return this.request<any>('/api/menu', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenu(data: any) {
    return this.request<any>('/api/menu', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenu(id: number) {
    return this.request<any>(`/api/menu?id=${id}`, { method: 'DELETE' });
  }

  // Settings
  async getSettings(params?: { category?: string; key?: string }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any>(`/api/settings${query}`);
  }

  async createSetting(data: any) {
    return this.request<any>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSettings(data: any) {
    return this.request<any>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSetting(id?: number, key?: string) {
    const query = id ? `?id=${id}` : key ? `?key=${key}` : '';
    return this.request<any>(`/api/settings${query}`, { method: 'DELETE' });
  }

  // Calon Murid
  async getCalonMurid(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<any>(`/api/registrations${query}`);
  }

  async createCalonMurid(data: any) {
    return this.request<any>('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCalonMurid(data: any) {
    return this.request<any>('/api/registrations', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async reviewCalonMurid(data: {
    id: number;
    status: string;
    reviewNotes?: string;
  }) {
    return this.request<any>('/api/registrations/review', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCalonMurid(id: number) {
    return this.request<any>(`/api/registrations?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Portofolio
  async getPortofolio(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any>(`/api/portofolio${query}`);
  }

  async createPortofolio(data: any) {
    return this.request<any>('/api/portofolio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePortofolio(data: any) {
    return this.request<any>('/api/portofolio', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePortofolio(id: number) {
    return this.request<any>(`/api/portofolio?id=${id}`, { method: 'DELETE' });
  }

  // Formulir
  async getFormulir(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<any>(`/api/formulir${query}`);
  }

  async submitFormulir(data: any) {
    return this.request<any>('/api/formulir', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Stats
  async getStats() {
    return this.request<any>('/api/stats');
  }

  // Profile
  async getProfile() {
    return this.request<any>('/api/profile');
  }

  async updateProfile(data: {
    name?: string;
    phone?: string;
    avatar?: string;
  }) {
    return this.request<any>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/api/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const api = new ApiClient(BACKEND_URL);
export default api;
