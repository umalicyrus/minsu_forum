// app/api/posts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: { images: true, user: true, group: true, comments: true, votes: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, visibility, images = [], userId, groupId } = body;

    // Ensure uploads folder exists
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (let i = 0; i < (images?.length || 0); i++) {
      const image = images[i];
      if (typeof image === "string" && image.startsWith("data:image")) {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        const fileName = `post_${Date.now()}_${i}.png`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        // Use relative URL — Next serves /public automatically
        uploadedUrls.push(`/uploads/${fileName}`);
      } else if (typeof image === "string" && image.length > 0) {
        // Already a URL (keep as-is)
        uploadedUrls.push(image);
      }
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        visibility,
        userId,
        groupId,
        images: { create: uploadedUrls.map((url) => ({ url })) },
      },
      include: { images: true, user: true, group: true, comments: true, votes: true },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
