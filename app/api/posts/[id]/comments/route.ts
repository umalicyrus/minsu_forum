// ✅ app/api/posts/[id]/comments/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// ───────────── POST COMMENT ─────────────
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // ✅ FIXED
  const postId = parseInt(id, 10);

  const { content } = await req.json();

  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // find user
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // create comment + include author for frontend
  const comment = await prisma.postComment.create({
    data: {
      content,
      authorId: dbUser.id,
      postId,
    },
    include: { author: true }, // ✅ include author for display
  });

  return NextResponse.json(comment);
}

// ───────────── GET COMMENTS ─────────────
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // ✅ FIXED
  const postId = parseInt(id, 10);

  const comments = await prisma.postComment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}
