import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail, getWelcomeEmailTemplate } from '@/lib/email';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Ambil semua users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');

    let query = `
      SELECT id, email, name, role, avatar, phone, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;

    const params: any[] = [];

    if (role) {
      query = `
        SELECT id, email, name, role, avatar, phone, is_active, created_at, updated_at
        FROM users
        WHERE role = $1
        ORDER BY created_at DESC
      `;
      params.push(role);
    }

    const result = await pool.query(query, params);

    return NextResponse.json({
      users: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data users' },
      { status: 500 }
    );
  }
}

// POST - Create user baru dengan email notification
export async function POST(request: NextRequest) {
  try {
    const { email, name, role, phone } = await request.json();

    // Validasi input
    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, nama, dan role harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Generate password sementara (8 karakter random)
    const tempPassword = crypto.randomBytes(4).toString('hex');

    // Hash password
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Insert user baru
    const result = await pool.query(
      `INSERT INTO users (email, password, name, role, phone, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
       RETURNING id, email, name, role, phone, is_active, created_at`,
      [email, hashedPassword, name, role, phone || null]
    );

    const newUser = result.rows[0];

    // Kirim email welcome dengan password sementara
    try {
      const emailHtml = getWelcomeEmailTemplate(name, email, tempPassword);
      await sendEmail({
        to: email,
        subject: 'Selamat Datang di IqroLife - Informasi Akun Anda',
        html: emailHtml,
      });

      // Log activity
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [
          newUser.id,
          'CREATE_USER',
          'users',
          newUser.id,
          `User baru dibuat: ${name} (${email})`,
        ]
      );

      return NextResponse.json(
        {
          message: 'User berhasil dibuat dan email verifikasi telah dikirim',
          user: newUser,
          emailSent: true,
        },
        { status: 201 }
      );
    } catch (emailError) {
      console.error('Error sending email:', emailError);

      // User tetap dibuat meskipun email gagal dikirim
      return NextResponse.json(
        {
          message: 'User berhasil dibuat, tetapi email gagal dikirim',
          user: newUser,
          emailSent: false,
          tempPassword, // Return password jika email gagal
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat user' },
      { status: 500 }
    );
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const { id, email, name, role, phone, is_active } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID user harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update user
    const result = await pool.query(
      `UPDATE users 
       SET email = COALESCE($1, email),
           name = COALESCE($2, name),
           role = COALESCE($3, role),
           phone = COALESCE($4, phone),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, email, name, role, phone, is_active, updated_at`,
      [email, name, role, phone, is_active, id]
    );

    return NextResponse.json({
      message: 'User berhasil diupdate',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate user' },
      { status: 500 }
    );
  }
}

// DELETE - Hapus user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID user harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah user ada
    const existingUser = await pool.query(
      'SELECT id, name FROM users WHERE id = $1',
      [id]
    );

    if (existingUser.rows.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus user
    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    return NextResponse.json({
      message: 'User berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menghapus user' },
      { status: 500 }
    );
  }
}
