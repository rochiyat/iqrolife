import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendEmail, getResetPasswordEmailTemplate } from '@/lib/email';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// POST - Request reset password (kirim email)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email harus diisi' }, { status: 400 });
    }

    // Cek apakah user ada
    const userResult = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Untuk keamanan, tetap return success meskipun email tidak ditemukan
      return NextResponse.json({
        message: 'Jika email terdaftar, link reset password telah dikirim',
      });
    }

    const user = userResult.rows[0];

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 jam dari sekarang

    // Simpan token ke database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, token, expiresAt]
    );

    // Kirim email
    const emailHtml = getResetPasswordEmailTemplate(user.name, token);
    await sendEmail({
      to: user.email,
      subject: 'Reset Password - IqroLife',
      html: emailHtml,
    });

    return NextResponse.json({
      message: 'Link reset password telah dikirim ke email Anda',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}

// PUT - Reset password dengan token
export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token dan password baru harus diisi' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Cek token
    const tokenResult = await pool.query(
      `SELECT prt.*, u.id as user_id, u.email 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    const resetToken = tokenResult.rows[0];

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, resetToken.user_id]
    );

    // Tandai token sebagai sudah digunakan
    await pool.query(
      'UPDATE password_reset_tokens SET used = true, used_at = NOW() WHERE id = $1',
      [resetToken.id]
    );

    return NextResponse.json({
      message:
        'Password berhasil direset. Silakan login dengan password baru Anda',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mereset password' },
      { status: 500 }
    );
  }
}
