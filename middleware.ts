import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && 
      !pathname.startsWith('/dashboard/login') && 
      !pathname.startsWith('/dashboard/forgot-password') &&
      !pathname.startsWith('/dashboard/reset-password')) {
    
    const token = request.cookies.get('auth-token');

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }

    try {
      // Verify JWT token
      jwt.verify(token.value, process.env.JWT_SECRET || 'your-jwt-secret-change-this');
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
