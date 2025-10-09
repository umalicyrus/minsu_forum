import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // adjust path if needed

// ─────────────────────── POST COMMENT ───────────────────────
export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> } // because of Next.js 15
) {
  const { id } = await context.params; // await because it's a promise
  const postId = parseInt(id, 10);
  const { content, anonymous } = await req.json();

  // ✅ Use your own JWT-based auth
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // create the comment
  const comment = await prisma.postcomment.create({
    data: {
      content,
      authorId: user.id, // comes from your JWT
      postId,
      anonymous: anonymous ?? false,
      updatedAt: new Date(),
    },
    include: { user: true },
  });

  // ✅ Hide user info if anonymous
  const safeComment = {
    ...comment,
    user: comment.anonymous ? null : comment.user,
  };

  return NextResponse.json(safeComment);
}

// ─────────────────────── GET COMMENTS ───────────────────────
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = parseInt(id, 10);

  const comments = await prisma.postcomment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Hide user info if anonymous
  const safeComments = comments.map((c) => ({
    ...c,
    user: c.anonymous ? null : c.user,
  }));

  return NextResponse.json(safeComments);
}
