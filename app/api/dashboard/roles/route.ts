import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/roles', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Gagal mengambil data roles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/roles', 'POST', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Gagal menambahkan role' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/roles', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Gagal mengupdate role' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/roles', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Gagal menghapus role' }, { status: 500 });
  }
}
