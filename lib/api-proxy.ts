import { NextRequest } from 'next/server';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://iqrolife-backend.vercel.app';

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

  return response.json();
}
