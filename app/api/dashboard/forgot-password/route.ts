import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import crypto from 'crypto';
import { sendEmail, getResetPasswordEmailTemplate } from '@/lib/email';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // Check if user exists in database
    const userResult = await pool.query(
      'SELECT id, name, email FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (userResult.rows.length === 0) {
      // For security, return success even if email not found (prevent email enumeration)
      return NextResponse.json({
        success: true,
        message:
          'Jika email terdaftar, link reset password akan dikirim ke email Anda',
      });
    }

    const user = userResult.rows[0];

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Store token in database
    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Send reset email
    const emailHtml = getResetPasswordEmailTemplate(user.name, resetToken);
    await sendEmail({
      to: user.email,
      subject: 'Reset Password - IqroLife',
      html: emailHtml,
    });

    console.log('Password reset email sent to:', email);

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        'Jika email terdaftar, link reset password akan dikirim ke email Anda',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      {
        error:
          'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}

// GET method to verify reset token
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 400 }
      );
    }

    // Query database for token
    const tokenResult = await pool.query(
      `SELECT prt.*, u.email, u.name 
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json({
        valid: false,
        message: 'Token tidak valid atau sudah kadaluarsa',
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Token valid',
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat validasi token' },
      { status: 500 }
    );
  }
}
