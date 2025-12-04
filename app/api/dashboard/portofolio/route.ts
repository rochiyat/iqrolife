import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/portofolio', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching portofolio:', error);
    return NextResponse.json({ error: 'Gagal mengambil data portofolio' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/portofolio', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating portofolio:', error);
    return NextResponse.json({ error: 'Gagal menambahkan portofolio' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/portofolio', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating portofolio:', error);
    return NextResponse.json({ error: 'Gagal mengupdate portofolio' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/portofolio', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting portofolio:', error);
    return NextResponse.json({ error: 'Gagal menghapus portofolio' }, { status: 500 });
  }
}
