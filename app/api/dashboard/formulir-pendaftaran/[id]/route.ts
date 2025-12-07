import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Get formulir pendaftaran by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID formulir diperlukan' },
        { status: 400 }
      );
    }

    // Proxy to backend API
    const data = await proxyToBackend(
      request,
      `/api/formulir-pendaftaran/${id}`,
      'GET'
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get formulir pendaftaran by ID error:', error);
    return NextResponse.json(
      {
        error: 'Gagal mengambil data formulir',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
