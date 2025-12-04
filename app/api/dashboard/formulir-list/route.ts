import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/formulir', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch formulir error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data formulir' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/formulir', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update formulir error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate status formulir' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/formulir', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete formulir error:', error);
    return NextResponse.json({ error: 'Gagal menghapus formulir' }, { status: 500 });
  }
}
