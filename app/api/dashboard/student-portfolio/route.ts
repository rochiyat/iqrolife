import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/student-portfolio', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching student portfolios:', error);
    return NextResponse.json({ error: 'Gagal mengambil data portfolio' }, { status: 500 });
  }
}
