import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/menu', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Gagal mengambil data menu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/menu', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Gagal menambahkan menu' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/menu', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json({ error: 'Gagal mengupdate menu' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/menu', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Gagal menghapus menu' }, { status: 500 });
  }
}
