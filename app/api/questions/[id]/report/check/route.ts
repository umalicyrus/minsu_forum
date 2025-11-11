import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ reported: false });

  const questionId = Number(params.id);

  const existingReport = await prisma.report.findFirst({
    where: { userId: user.id, questionId },
  });

  return NextResponse.json({ reported: !!existingReport });
}
