// ✅ app/api/posts/[id]/vote/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { value } = await req.json(); // value = 1 (upvote) or -1 (downvote)
  const postId = parseInt(params.id, 10);

  // ✅ get logged in user session
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // ✅ Find the logged in user in the DB to get their ID
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userId = dbUser.id;

  // ✅ Upsert: if already voted, update; else create
  const vote = await prisma.postVote.upsert({
    where: { userId_postId: { userId, postId } }, // make sure composite key exists in Prisma schema
    update: { value },
    create: { userId, postId, value },
  });

  // ✅ Count total upvotes & downvotes for display
  const upvotes = await prisma.postVote.count({
    where: { postId, value: 1 },
  });
  const downvotes = await prisma.postVote.count({
    where: { postId, value: -1 },
  });

  return NextResponse.json({ vote, upvotes, downvotes });
}
