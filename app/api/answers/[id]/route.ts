// app/api/answers/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

type Params = { id: string };

export async function PATCH(req: Request, context: { params: Promise<Params> }) {
  try {
    const { params } = context;
    const { id } = await params;
    const answerId = parseInt(id, 10);

    const user = getUserFromRequest(req);  // No need for await (sync)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, anonymous } = body;

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { authorId: true },
    });

    if (!existingAnswer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Safely check author
    if (existingAnswer.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.answer.update({
      where: { id: answerId },
      data: {
        content,
        anonymous: Boolean(anonymous),
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: updated.id,
        content: updated.content,
        anonymous: updated.anonymous,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        author: updated.user
          ? { id: updated.user.id, name: updated.user.name, image: updated.user.image }
          : null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/answers/[id] error:", err);
    return NextResponse.json({ error: "Failed to update answer" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: Promise<Params> }) {
  try {
    const { params } = context;
    const { id } = await params;
    const answerId = parseInt(id, 10);

    const user = getUserFromRequest(req);  // Still sync
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: { id: answerId },
      select: { authorId: true },
    });

    if (!existingAnswer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    if (existingAnswer.authorId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.answer.delete({ where: { id: answerId } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/answers/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete answer" }, { status: 500 });
  }
}
