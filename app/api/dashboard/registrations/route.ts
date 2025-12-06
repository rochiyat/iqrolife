import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend, API_URL, getToken } from '@/lib/api-proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/registrations', 'GET');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data registrasi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const token = getToken(request);
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Handle FormData (multipart/form-data)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const body: Record<string, any> = {};

      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          body[key] = value;
        }
        // Skip file uploads for now - backend doesn't handle them yet
      }

      headers['Content-Type'] = 'application/json';
      const response = await fetch(`${API_URL}/api/registrations`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      // Forward the actual status code from backend
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }
      return NextResponse.json(data);
    }

    // Handle JSON
    headers['Content-Type'] = 'application/json';
    const body = await request.json();
    const response = await fetch(`${API_URL}/api/registrations`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    // Forward the actual status code from backend
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create registration error:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan data registrasi' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const token = getToken(request);
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    // Handle FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const body: Record<string, any> = {};

      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          body[key] = value;
        }
      }

      headers['Content-Type'] = 'application/json';
      const response = await fetch(`${API_URL}/api/registrations`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      // Forward the actual status code from backend
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }
      return NextResponse.json(data);
    }

    // Handle JSON
    headers['Content-Type'] = 'application/json';
    const body = await request.json();
    const response = await fetch(`${API_URL}/api/registrations`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    const data = await response.json();

    // Forward the actual status code from backend
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Update registration error:', error);
    return NextResponse.json(
      { error: 'Gagal mengupdate data registrasi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await proxyToBackend(request, '/api/registrations', 'DELETE');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete registration error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data registrasi' },
      { status: 500 }
    );
  }
}
