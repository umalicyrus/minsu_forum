import { NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { followingId } = await req.json();
  const followerId = user.id;

  if (followerId === followingId) {
    return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
  }

  try {
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
    return NextResponse.json(follow);
  } catch (err: any) {
    // Prisma unique constraint P2002
    if (err.code === 'P2002') {
      return NextResponse.json({ message: 'Already following' }, { status: 200 });
    }
    console.error('POST /api/follow error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { followingId } = await req.json();
  const followerId = user.id;

  await prisma.follow.deleteMany({
    where: {
      followerId,
      followingId,
    },
  });

  return NextResponse.json({ success: true });
}
