// app/api/posts/[id]/share/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // increment a share count field in Post if you add one
  const postId = parseInt(params.id);

  const updated = await prisma.post.update({
    where: { id: postId },
    data: { /* add logic or increment shareCount */ },
  });

  return NextResponse.json(updated);
}
