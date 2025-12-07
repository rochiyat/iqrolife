import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/portofolio', 'GET');
    // Return data in the expected format for the frontend
    return NextResponse.json({
      success: true,
      data: data.data || data, // Handle both wrapped and unwrapped responses
    });
  } catch (error) {
    console.error('Error fetching student portfolios:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil data portfolio',
      },
      { status: 500 }
    );
  }
}
