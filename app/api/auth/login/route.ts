import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user.id, role: user.role });

  const response = NextResponse.json({ message: 'Login successful' });

  // ✅ Set cookie
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
