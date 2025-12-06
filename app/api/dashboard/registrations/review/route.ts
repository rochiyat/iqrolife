import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/registrations/review', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Review registration error:', error);
    return NextResponse.json({ error: 'Gagal melakukan review' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/registrations/review', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Review registration error:', error);
    return NextResponse.json({ error: 'Gagal melakukan review' }, { status: 500 });
  }
}
