import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken'; // Make sure this is imported

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const url = req.nextUrl;

  const user = token ? verifyToken(token) : null;

  // Protect admin routes
  if (url.pathname.startsWith('/dashboard/admin')) {
    if (
      !user ||
      typeof user === 'string' || 
      (user as JwtPayload).role !== 'ADMIN'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect user routes
  if (url.pathname.startsWith('/dashboard/user')) {
    if (!user || typeof user === 'string') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
