import { NextResponse } from "next/server"; 
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { error } from "console";

export async function GET(req: Request) {
    try {
        const user = getUserFromRequest(req);
        if (!user) return NextResponse.json({ error:"Unauthorized" }, { status: 401 });

        const questions = await prisma.question.findMany({
            where: { authorId: user.id },
            include: {
                category: true,
                questiontopic: {
                    include: {topic: true},
                },
                answer: true,
                user: true,                
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(questions);
    }
    catch (error) {
        console.error("Error fetching user questions:", error);
        return NextResponse.json(
            {
                error: "Server error"
            },
            {
                status: 500
            }
        )
    }
}