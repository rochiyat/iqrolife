import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/registrations/create-user', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Gagal membuat user' }, { status: 500 });
  }
}
