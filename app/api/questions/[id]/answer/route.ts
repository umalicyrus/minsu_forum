import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const answers = await prisma.answer.findMany({
      where: { questionId: Number(params.id) },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(answers);
  } catch (err) {
    console.error("Error fetching answers:", err);
    return NextResponse.json({ error: "Failed to fetch answers" }, { status: 500 });
  }
}
