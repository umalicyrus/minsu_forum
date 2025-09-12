import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // adjust based on your auth setup

// POST /api/answers
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, content } = await req.json();

    if (!questionId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: user.id,
      },
      include: {
        author: { select: { id: true, name: true } },
        question: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(answer, { status: 201 });
  } catch (err: any) {
    console.error("Answer POST error:", err);
    return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });
  }
}
