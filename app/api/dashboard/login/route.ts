import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
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

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
    });
    console.log('user', user);
    if (!user) {
      // User not found - return generic error for security
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      // Invalid password
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.roleId,
      },
      process.env.JWT_SECRET || 'your-jwt-secret-change-this',
      { expiresIn: '7d' }
    );

    // Successful login
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roleId: user.roleId,
          role: user.role,
          roleName: user.roleName,
        },
      },
      { status: 200 }
    );

    // Set auth token cookie
    response.cookies.set('auth-token', token, {
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

// GET method to check authentication status
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');

    if (!authToken || !authToken.value) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(
        authToken.value,
        process.env.JWT_SECRET || 'your-jwt-secret-change-this'
      ) as { userId: string; email: string; role: string };

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          roleId: true,
          roleName: true,
          role: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user,
      });
    } catch (error) {
      // Token invalid or expired
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memeriksa autentikasi' },
      { status: 500 }
    );
  }
}
