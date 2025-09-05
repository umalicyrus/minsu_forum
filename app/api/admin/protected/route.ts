import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken'; // <- Make sure this is imported

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token) : null;

  if (!user || typeof user === 'string' || !(user as JwtPayload).role || (user as JwtPayload).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  return NextResponse.json({ message: 'Welcome admin!' });
}
