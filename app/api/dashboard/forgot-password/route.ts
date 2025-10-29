import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';

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

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // For security: Always return success even if email doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      // Simulate delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json({
        success: true,
        message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda',
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/reset-password?token=${resetToken}`;

    console.log('Password reset requested for:', email);
    console.log('Reset token generated and stored in database');
    console.log('Reset URL:', resetUrl);

    // TODO: In production, send email here
    // await sendResetEmail(email, resetUrl);
    // Example with SendGrid or Nodemailer

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

    // Find user with this reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: 'Token tidak valid atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: 'Token valid',
      email: user.email,
    });

  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat validasi token' },
      { status: 500 }
    );
  }
}
