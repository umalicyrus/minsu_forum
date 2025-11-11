// app/api/questions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import slugify from "slugify";

/**
 * CREATE QUESTION
 * - requires authenticated user (uses getUserFromRequest)
 * - validates title and optional categoryId
 * - returns the created question (includes category info)
 */
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, anonymous, categoryId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Optional: validate categoryId if provided
    if (categoryId) {
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
      }
    }

    // ✅ Generate a base slug
    let baseSlug = slugify(title, { lower: true, strict: true });
    if (!baseSlug) baseSlug = `question-${Date.now()}`;

    // ✅ Ensure uniqueness (e.g., if same title exists)
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.question.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // ✅ Create the question with guaranteed slug
    const question = await prisma.question.create({
      data: {
        title,
        content,
        slug,
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
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}

/**
 * GET QUESTIONS
 * - optional categoryId query param supported
 * - hides the current user's own questions by default (your original behavior)
 * - includes related user, category, answers, votes, and answers count
 * - computes upvotes and downvotes dynamically
 */
export async function GET(req: Request) {
  // getUserFromRequest may return null (unauthenticated)
  const user = await getUserFromRequest(req);

  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    // preserve your existing where logic and add category filtering if provided
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
        questionvote: { select: { value: true } }, // include all votes for computation
        _count: { select: { answer: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Compute upvotes/downvotes and shape answers exactly like your previous mapping
    const formatted = questions.map((q) => {
      const upvotes = q.questionvote.filter((v) => v.value === 1).length;
      const downvotes = q.questionvote.filter((v) => v.value === -1).length;

      return {
        id: q.id,
        title: q.title,
        content: q.content,
        slug: q.slug,
        anonymous: q.anonymous,
        author: q.user,
        category: q.category,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        upvotes,
        downvotes,
        answersCount: q._count.answer,
        answers: q.answer.map((a) => ({
          id: a.id,
          content: a.content,
          createdAt: a.createdAt,
          anonymous: a.anonymous,
          author: a.user,
        })),
      };
    });

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
