import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

/**
 * Endpoint untuk validasi session dan refresh user data dari database
 * Gunakan ini hanya jika perlu memastikan data user masih valid/aktif
 */
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');

    if (!authToken || !authToken.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      const user = JSON.parse(authToken.value);

      // Validasi ke database untuk memastikan user masih aktif
      const userResult = await pool.query(
        'SELECT id, email, name, role, avatar, phone, is_active FROM users WHERE id = $1',
        [user.id]
      );

      if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
        // User tidak ditemukan atau tidak aktif, hapus cookie
        const response = NextResponse.json(
          { authenticated: false, reason: 'User not found or inactive' },
          { status: 401 }
        );
        response.cookies.delete('auth-token');
        return response;
      }

      const freshUser = userResult.rows[0];

      // Update cookie dengan data terbaru
      const response = NextResponse.json({
        authenticated: true,
        user: freshUser,
      });

      response.cookies.set('auth-token', JSON.stringify(freshUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } catch (parseError) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat validasi session' },
      { status: 500 }
    );
  }
}
