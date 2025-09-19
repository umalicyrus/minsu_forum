import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        images: true,
        user: true,
        group: true,
        comments: true,
        votes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Add upvotes & downvotes to each post
    const postsWithCounts = posts.map((post) => {
      const upvotes = post.votes.filter((v) => v.value === 1).length;
      const downvotes = post.votes.filter((v) => v.value === -1).length;
      return {
        ...post,
        upvotes,
        downvotes,
      };
    });

    return NextResponse.json(postsWithCounts);
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
        uploadedUrls.push(`/uploads/${fileName}`);
      } else if (typeof image === "string" && image.length > 0) {
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
        images: {
          create: uploadedUrls.map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        user: true,
        group: true,
        comments: true,
        votes: true,
      },
    });

    // ✅ Add upvotes & downvotes to the newly created post
    const upvotes = newPost.votes.filter((v) => v.value === 1).length;
    const downvotes = newPost.votes.filter((v) => v.value === -1).length;

    return NextResponse.json({ ...newPost, upvotes, downvotes });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
