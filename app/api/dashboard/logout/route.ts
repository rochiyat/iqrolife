import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Hapus session cookie
    cookieStore.delete('session');

    return NextResponse.json({
      message: 'Logout berhasil',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat logout' },
      { status: 500 }
    );
  }
}
