import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// Helper to validate numeric ID
function getNumericId(id: string) {
  const num = Number(id);
  if (isNaN(num)) throw new Error("Invalid question ID");
  return num;
}

// Get One Question (public)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = getNumericId(params.id);

    const question = await prisma.question.findUnique({
      where: { id },
      include: { author: true, answers: true, comments: true },
    });

    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    return NextResponse.json(question);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch question" }, { status: 500 });
  }
}

// Update Question (requires login + owner)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req); // ✅ await added
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = getNumericId(params.id);
    const { title, content } = await req.json();

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing || existing.authorId !== user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const updated = await prisma.question.update({
      where: { id },
      data: { title, content },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update question" }, { status: 500 });
  }
}

// Delete Question (requires login + owner)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(_); // ✅ await added
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = getNumericId(params.id);

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing || existing.authorId !== user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ message: "Question deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete question" }, { status: 500 });
  }
}
