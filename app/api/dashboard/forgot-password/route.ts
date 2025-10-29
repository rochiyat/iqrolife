import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email wajib diisi' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format email tidak valid' },
        { status: 400 }
      );
    }

    // TODO: In production, you should:
    // 1. Check if email exists in database
    // 2. Generate a secure reset token
    // 3. Store token in database with expiration (1 hour)
    // 4. Send email with reset link
    // 5. Implement rate limiting to prevent abuse

    // For now, this is a mock implementation
    // In production, replace with actual email service (SendGrid, AWS SES, etc.)

    // Generate a mock reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard/reset-password?token=${resetToken}`;

    // Mock email check (in production, query from database)
    const validEmails = ['admin@iqrolife.com', 'test@iqrolife.com'];
    
    // Simulate email verification
    // In production, you would:
    // - Check database for email
    // - If not found, return generic success message (security best practice)
    // - If found, send email and store token
    
    // For security reasons, always return success even if email doesn't exist
    // This prevents email enumeration attacks
    
    console.log('Password reset requested for:', email);
    console.log('Reset token generated:', resetToken);
    console.log('Reset URL:', resetUrl);

    // In production, send email here
    // await sendResetEmail(email, resetUrl);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

// Optional: GET method to verify reset token
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

    // TODO: In production:
    // 1. Query database for token
    // 2. Check if token is expired
    // 3. Return valid/invalid status

    // Mock token validation
    console.log('Validating reset token:', token);

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
