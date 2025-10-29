import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: In production, you should:
    // 1. Check credentials against database
    // 2. Use proper password hashing (bcrypt, argon2, etc.)
    // 3. Generate JWT token or session
    // 4. Set secure HTTP-only cookies
    // 5. Implement rate limiting
    // 6. Add 2FA if needed

    // For now, this is a mock authentication
    // Replace with your actual authentication logic
    const validCredentials = {
      email: 'admin@iqrolife.com',
      password: 'admin123', // In production, this should be a hashed password
    };

    if (email === validCredentials.email && password === validCredentials.password) {
      // Successful login
      // In production, generate a proper JWT token or session
      const response = NextResponse.json(
        {
          success: true,
          message: 'Login berhasil',
          user: {
            email: email,
            name: 'Admin Iqrolife',
            role: 'admin',
          },
        },
        { status: 200 }
      );

      // Set a session cookie (in production, use proper session management)
      response.cookies.set('auth-token', 'mock-token-' + Date.now(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } else {
      // Invalid credentials
      return NextResponse.json(
        { error: 'Email atau password salah' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat login. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to check authentication status
export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token');

    if (authToken && authToken.value) {
      // In production, validate the token properly
      return NextResponse.json({
        authenticated: true,
        user: {
          email: 'admin@iqrolife.com',
          name: 'Admin Iqrolife',
          role: 'admin',
        },
      });
    }

    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memeriksa autentikasi' },
      { status: 500 }
    );
  }
}
