import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { cookies } from 'next/headers';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Ambil profile user yang sedang login
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse session untuk mendapatkan user ID
    const session = JSON.parse(sessionCookie.value);
    const userId = session.userId;

    const result = await pool.query(
      `SELECT id, email, name, role, avatar, phone, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil profile' },
      { status: 500 }
    );
  }
}

// PUT - Update profile user
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = JSON.parse(sessionCookie.value);
    const userId = session.userId;

    const { name, email, phone } = await request.json();

    // Validasi input
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nama dan email harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah digunakan user lain
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah digunakan oleh user lain' },
        { status: 400 }
      );
    }

    // Update profile
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, email, name, role, phone, updated_at`,
      [name, email, phone || null, userId]
    );

    return NextResponse.json({
      message: 'Profile berhasil diupdate',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate profile' },
      { status: 500 }
    );
  }
}
