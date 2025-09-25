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
        // ✅ FIX: use `user` instead of `author`
        user: { select: { id: true, name: true, image: true } },

        // ✅ FIX: your relation is `answer` not `answers`
        answer: {
          include: {
            // ✅ FIX: answers have a `user` relation not `author`
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },

        // ✅ FIX: count the right relation name
        _count: { select: { answer: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      questions.map((q) => ({
        ...q,
        answersCount: q._count.answer, // ✅ match relation name
      }))
    );
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
