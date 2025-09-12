import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req); // ✅ await added
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(questions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch user questions" }, { status: 500 });
  }
}
