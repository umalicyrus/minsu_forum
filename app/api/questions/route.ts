import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// ✅ CREATE QUESTION
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, content, anonymous, categoryId } = await req.json();

    if (!title)
      return NextResponse.json({ error: "Title is required" }, { status: 400 });

    // ✅ Optional validation if categoryId is provided
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return NextResponse.json(
          { error: "Invalid category ID" },
          { status: 400 }
        );
      }
    }

    const question = await prisma.question.create({
      data: {
        title,
        content,
        authorId: user.id,
        anonymous: !!anonymous,
        categoryId: categoryId ?? null,
      },
      include: {
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}

// ✅ GET QUESTIONS (with optional category filtering)
export async function GET(req: Request) {
  const user = await getUserFromRequest(req);

  try {
    // ✅ Get categoryId from query string
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    // ✅ Apply category filter if present
    const where: any = {
      authorId: user ? { not: user.id } : undefined,
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
    };

    const questions = await prisma.question.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true } },
        answer: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { answer: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      questions.map((q) => ({
        id: q.id,
        title: q.title,
        content: q.content,
        anonymous: q.anonymous,
        author: q.user,
        category: q.category,
        answers: q.answer.map((a) => ({
          id: a.id,
          content: a.content,
          createdAt: a.createdAt,
          anonymous: a.anonymous,
          author: a.user,
        })),
        answersCount: q._count.answer,
      }))
    );
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
