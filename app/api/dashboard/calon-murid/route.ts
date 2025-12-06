import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/calon-murid', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data calon murid' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/calon-murid', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create student error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan data calon murid' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/calon-murid', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Gagal mengupdate data calon murid' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/calon-murid', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Gagal menghapus data calon murid' }, { status: 500 });
  }
}
