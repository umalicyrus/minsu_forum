import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // adjust path if needed

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { questionId, content, anonymous } = await req.json();

    if (!questionId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId,
        authorId: user.id,
        anonymous: !!anonymous,
        updatedAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        question: { select: { id: true, title: true } },
      },
    });

    const answerWithAuthor = {
      ...answer,
      author: answer.user,
    };

    return NextResponse.json(answerWithAuthor, { status: 201 });
  } catch (err: any) {
    console.error("Answer POST error:", err);
    return NextResponse.json({ error: "Failed to post answer" }, { status: 500 });
  }
}
