import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

// ✅ Helper: Extract numeric ID from slug (e.g. "1234567890-34567890" → 1234567890)
function extractIdFromSlug(slug: string) {
  const idPart = slug.split("-")[0]; // Take everything before the first dash
  const num = Number(idPart);
  if (isNaN(num)) throw new Error("Invalid question ID");
  return num;
}

// ✅ GET one question (public)
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const isNumeric = !isNaN(Number(id));

    const question = await prisma.question.findUnique({
      where: isNumeric ? { id: Number(id) } : { slug: id },
      include: {
        user: true,
        answer: {
          include: { user: true },
        },
        qcomment: true,
        category: true,
      },
    });

    if (!question)
      return NextResponse.json({ error: "Question not found" }, { status: 404 });

    return NextResponse.json(question);
  } catch (err: any) {
    console.error("❌ GET /api/questions/[id] error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// ✅ PUT (update question)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = extractIdFromSlug(params.id);
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
    return NextResponse.json(
      { error: err.message || "Failed to update question" },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const id = extractIdFromSlug(params.id);

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing || existing.authorId !== user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ message: "Question deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to delete question" },
      { status: 500 }
    );
  }
}
