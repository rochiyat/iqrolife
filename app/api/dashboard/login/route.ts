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

    // Get user from database with role permissions
    const userResult = await pool.query(
      `SELECT 
        u.id, 
        u.email, 
        u.password, 
        u.name, 
        u.role, 
        u.avatar, 
        u.phone, 
        u.is_active,
        r.permissions
      FROM users u
      LEFT JOIN roles r ON LOWER(u.role) = LOWER(r.name)
      WHERE u.email = $1`,
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

    // Remove password from user object and include permissions
    const { password: _, ...userWithoutPassword } = user;

    // Ensure permissions exist (fallback to empty object if role not found)
    if (!userWithoutPassword.permissions) {
      userWithoutPassword.permissions = {
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

    // Log activity
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [user.id, 'LOGIN', 'user', user.id, `User ${user.name} logged in`]
    );

    // Get accessible menus for user's role from database
    const menusResult = await pool.query(
      `SELECT id, name, label, icon, href, parent_id, order_index, is_active, roles
       FROM menu
       WHERE is_active = true
       AND roles @> $1::jsonb
       ORDER BY order_index, name`,
      [JSON.stringify([user.role])]
    );
    console.log('menusResult', menusResult.rows);
    console.log('user.role', user.role);

    const accessibleMenus = menusResult.rows;

    // Add menus to user object (will be sent to client)
    // Client-side (auth-context.tsx) will save to localStorage
    userWithoutPassword.accessibleMenus = accessibleMenus;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: userWithoutPassword,
        menus: accessibleMenus, // Send menus separately for clarity
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
