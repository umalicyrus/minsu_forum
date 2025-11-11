import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// POST /api/questions/[id]/vote
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { value } = await req.json();
    const { id } = params;
    const questionId = parseInt(id);

    if (![1, -1].includes(value))
      return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });

    // 🔍 Check if user already voted
    const existingVote = await prisma.questionvote.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId,
        },
      },
    });

    if (existingVote) {
      if (existingVote.value === value) {
        // 🟡 Toggle off
        await prisma.questionvote.delete({ where: { id: existingVote.id } });
      } else {
        // 🟢 Switch vote
        await prisma.questionvote.update({
          where: { id: existingVote.id },
          data: { value },
        });
      }
    } else {
      // 🆕 New vote
      await prisma.questionvote.create({
        data: { value, questionId, userId: user.id },
      });
    }

    // 🧮 Recalculate total upvotes/downvotes dynamically
    const [upvotes, downvotes] = await Promise.all([
      prisma.questionvote.count({ where: { questionId, value: 1 } }),
      prisma.questionvote.count({ where: { questionId, value: -1 } }),
    ]);

    // ✅ Return updated counts (no DB write)
    return NextResponse.json({ id: questionId, upvotes, downvotes });
  } catch (error) {
    console.error("Vote Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}