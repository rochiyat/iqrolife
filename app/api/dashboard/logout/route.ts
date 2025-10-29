import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    });

    // Clear auth token cookie
    response.cookies.delete('auth-token');

    console.log('User logged out successfully');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}

// Also support GET method for logout links
export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.redirect(
      new URL('/dashboard/login', request.url)
    );
    response.cookies.delete('auth-token');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}
