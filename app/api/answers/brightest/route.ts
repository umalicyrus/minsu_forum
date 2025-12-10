import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.category.findMany({
      include: {
        posts: false,
        questions: {
          include: {
            answer: {
              where: { authorId: user.id },
            },
          },
        },
      },
    });

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      imageUrl: cat.imageUrl,
      totalAnswers: cat.questions.reduce(
        (sum, q) => sum + q.answer.length,
        0
      ),
    }));

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("GET /api/answers/brightest error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch brightest" },
      { status: 500 }
    );
  }
}
