import { NextRequest, NextResponse } from 'next/server';

// Dummy users for testing with 4 different roles
const dummyUsers = [
  {
    id: '1',
    email: 'superadmin@iqrolife.com',
    password: 'superadmin123',
    name: 'Super Admin',
    role: 'superadmin',
    avatar: '/avatars/superadmin.jpg',
  },
  {
    id: '2',
    email: 'staff@iqrolife.com',
    password: 'staff123',
    name: 'Staff Iqrolife',
    role: 'staff',
    avatar: '/avatars/staff.jpg',
  },
  {
    id: '3',
    email: 'teacher@iqrolife.com',
    password: 'teacher123',
    name: 'Ustadz Ahmad',
    role: 'teacher',
    avatar: '/avatars/teacher.jpg',
  },
  {
    id: '4',
    email: 'parent@iqrolife.com',
    password: 'parent123',
    name: 'Ibu Siti',
    role: 'parent',
    avatar: '/avatars/parent.jpg',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    const user = dummyUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      
      const response = NextResponse.json(
        {
          success: true,
          message: 'Login berhasil',
          user: userWithoutPassword,
        },
        { status: 200 }
      );

      response.cookies.set('auth-token', JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');

    if (authToken && authToken.value) {
      try {
        const user = JSON.parse(authToken.value);
        return NextResponse.json({
          authenticated: true,
          user: user,
        });
      } catch {
        return NextResponse.json(
          { authenticated: false },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memeriksa autentikasi' },
      { status: 500 }
    );
  }
}
