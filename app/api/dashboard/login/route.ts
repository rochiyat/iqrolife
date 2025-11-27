import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

    // Get user from database
    const userResult = await pool.query(
      'SELECT id, email, password, name, role, avatar, phone, is_active FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Akun Anda tidak aktif. Silakan hubungi administrator.' },
        { status: 403 }
      );
    }

    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user.id, 'LOGIN', 'user', user.id, `User ${user.name} logged in`]
    );

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
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
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
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memeriksa autentikasi' },
      { status: 500 }
    );
  }
}
