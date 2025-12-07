import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Review or Edit Request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, notes, action } = body;

    if (!id || !notes || !action) {
      return NextResponse.json(
        { error: 'ID, notes, dan action diperlukan' },
        { status: 400 }
      );
    }

    // Map frontend format to backend format
    // Backend expects: formulirId, status, notes, sendEmailFlag
    // Frontend sends: id, status, notes, action
    // For 'edit' action, backend uses status 'edit_required'
    // For 'review' action, use the provided status or default to 'reviewed'
    const backendBody = {
      formulirId: id,
      status: action === 'edit' ? 'edit_required' : status || 'reviewed',
      notes: notes,
      sendEmailFlag: true,
    };

    // Proxy to backend API
    const data = await proxyToBackend(
      request,
      '/api/formulir-pendaftaran/review',
      'POST',
      backendBody
    );

    return NextResponse.json({
      success: true,
      message: `Formulir berhasil ${
        action === 'review' ? 'direview' : 'diminta edit'
      } dan email telah dikirim`,
      data: data.data,
    });
  } catch (error) {
    console.error('Review/Edit error:', error);
    return NextResponse.json(
      {
        error: 'Gagal memproses permintaan',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
