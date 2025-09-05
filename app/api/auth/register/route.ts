import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  const { email, name, password, role } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, password: hashed, role: role || 'USER', updatedAt: new Date }
  });

  return NextResponse.json({ message: 'User registered', user });
}
