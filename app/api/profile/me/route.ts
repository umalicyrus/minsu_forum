// app/api/profile/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    // Get the user from JWT token stored in cookies
    const userFromToken = getUserFromRequest(req);

    if (!userFromToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: userFromToken.id },
      include: {
        answer: true,
        question: true,
        follow_follow_followerIdTouser: true, // following
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Count warnings (from report model)
    const warnings = await prisma.report.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      location: user.location,
      role: user.role,

      answers: user.answer.length,
      questions: user.question.length,
      following: user.follow_follow_followerIdTouser?.length ?? 0,

      level: user.location ?? "Not set",
      joined: user.createdAt,
      warnings,
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
