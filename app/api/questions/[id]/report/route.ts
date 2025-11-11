// app/api/questions/[id]/report/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reason, answerId } = await req.json();
  const questionId = Number(params.id);

  // ✅ Check if user already reported this question/answer
  const existingReport = await prisma.report.findFirst({
    where: {
      userId: user.id,
      questionId,
      answerId: answerId || null,
    },
  });

  if (existingReport) {
    return NextResponse.json(
      { error: "You have already reported this content." },
      { status: 400 }
    );
  }

  const report = await prisma.report.create({
    data: {
      reason,
      questionId,
      answerId: answerId || undefined,
      userId: user.id,
    },
  });

  return NextResponse.json(report);
}
