import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// Create Question
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, content, anonymous } = await req.json();

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const question = await prisma.question.create({
      data: {
        title,
        content,
        authorId: user.id,
        anonymous: !!anonymous, // force boolean
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}

// Get all questions except current user's
export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  try {
    const questions = await prisma.question.findMany({
      where: {
        authorId: user ? { not: user.id } : undefined, // exclude current user's questions
      },
      include: {
        author: { select: { id: true, name: true } },
        answers: {
          include: {
            author: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { answers: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      questions.map((q) => ({
        ...q,
        answersCount: q._count.answers, // add answers count
      }))
    );
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
