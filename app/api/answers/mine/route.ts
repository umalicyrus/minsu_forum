// app/api/answers/mine/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const answers = await prisma.answer.findMany({
      where: { authorId: user.id },
      include: {
        question: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      answers.map((a) => ({
        id: a.id,
        content: a.content,
        createdAt: a.createdAt,
        questionTitle: a.question?.title || "",
        category: a.question?.category?.name || "General",
      }))
    );
  } catch (e) {
    console.error("ANSWER FETCH ERROR", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
