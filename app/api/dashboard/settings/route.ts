import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/settings', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Gagal mengambil data settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/settings', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating setting:', error);
    return NextResponse.json({ error: 'Gagal menambahkan setting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/settings', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Gagal mengupdate setting' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/settings', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json({ error: 'Gagal menghapus setting' }, { status: 500 });
  }
}
