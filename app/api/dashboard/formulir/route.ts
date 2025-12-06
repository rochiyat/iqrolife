import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, API_URL, getToken } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/formulir', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching formulir:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data formulir' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);
    // Handle multipart form data (with file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const token = getToken(request);

      // Extract form fields
      const body: any = {};
      for (const [key, value] of formData.entries()) {
        if (key !== 'paymentProof') {
          body[key] = value;
        }
      }

      // TODO: Handle file upload to Cloudinary if needed
      // For now, just pass the form data without file

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/formulir-pendaftaran`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return NextResponse.json(data);
    }

    // Handle JSON body
    const body = await request.json();
    const data = await proxyToBackend(
      request,
      '/api/formulir-pendaftaran',
      'POST',
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting formulir:', error);
    return NextResponse.json(
      { error: 'Gagal mengirim formulir pendaftaran' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await proxyToBackend(request, '/api/formulir', 'PUT', body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating formulir:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate formulir' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/formulir', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting formulir:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus formulir' },
      { status: 500 }
    );
  }
}
