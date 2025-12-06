import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(
      request,
      '/api/registrations-list',
      'GET'
    );
    console.log('Registrations list:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch registrations list error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data registrasi' },
      { status: 500 }
    );
  }
}
