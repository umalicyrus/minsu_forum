import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ destructure params here
) {
  // 🔹 Authenticate user
  const user = getUserFromRequest(req as any);
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const postId = Number(params.id); // ✅ use params.id directly
  const { value } = await req.json(); // value = 1 or -1

  if (![1, -1].includes(value)) {
    return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
  }

  // 🔹 Check existing vote
  const existingVote = await prisma.postvote.findUnique({
    where: { userId_postId: { userId: user.id, postId } },
  });

  if (existingVote) {
    // Toggle: if same vote exists, remove it
    if (existingVote.value === value) {
      await prisma.postvote.delete({
        where: { userId_postId: { userId: user.id, postId } },
      });

      // recompute counts
      const votes = await prisma.postvote.findMany({ where: { postId } });
      const upvotes = votes.filter((v) => v.value === 1).length;
      const downvotes = votes.filter((v) => v.value === -1).length;

      return NextResponse.json({ upvotes, downvotes });
    }

    // Otherwise update
    await prisma.postvote.update({
      where: { userId_postId: { userId: user.id, postId } },
      data: { value },
    });

    const votes = await prisma.postvote.findMany({ where: { postId } });
    const upvotes = votes.filter((v) => v.value === 1).length;
    const downvotes = votes.filter((v) => v.value === -1).length;

    return NextResponse.json({ upvotes, downvotes });
  }

  // 🔹 Create new vote
  await prisma.postvote.create({
    data: { userId: user.id, postId, value },
  });

  const votes = await prisma.postvote.findMany({ where: { postId } });
  const upvotes = votes.filter((v) => v.value === 1).length;
  const downvotes = votes.filter((v) => v.value === -1).length;

  return NextResponse.json({ upvotes, downvotes });
}
