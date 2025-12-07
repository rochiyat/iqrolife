import { NextRequest } from 'next/server';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://iqrolife-backend.vercel.app';

export function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader) return authHeader.replace('Bearer ', '');
  return request.cookies.get('auth-token')?.value || null;
}

export async function proxyToBackend(
  request: NextRequest,
  endpoint: string,
  method: string,
  body?: any
) {
  const token = getToken(request);
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = new URL(request.url);
  const response = await fetch(`${API_URL}${endpoint}${url.search}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Check if response is OK
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        // If response is HTML (error page), get text instead
        const text = await response.text();
        console.error(
          'Backend returned HTML instead of JSON:',
          text.substring(0, 200)
        );
        errorMessage = `Backend returned error page (status ${response.status}). Endpoint may not exist.`;
      }
    } catch (e) {
      // If we can't parse the error, use default message
      console.error('Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }

  // Check content type before parsing JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error(
      'Backend returned non-JSON response:',
      contentType,
      text.substring(0, 200)
    );
    throw new Error(
      `Backend returned ${
        contentType || 'unknown content type'
      } instead of JSON`
    );
  }

  return response.json();
}
