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
  const { content } = await req.json();

  // ✅ Use your own JWT-based auth
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // create the comment
  const comment = await prisma.postComment.create({
    data: {
      content,
      authorId: user.id, // comes from your JWT
      postId,
    },
    include: { author: true },
  });

  return NextResponse.json(comment);
}

// ─────────────────────── GET COMMENTS ───────────────────────
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const postId = parseInt(id, 10);

  const comments = await prisma.postComment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(comments);
}
