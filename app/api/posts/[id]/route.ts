// app/api/posts/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

function removeFileIfUploadsUrl(url?: string) {
  if (!url) return;
  // Only delete files inside /uploads/
  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (e) {
      console.warn("Failed to remove file:", filePath, e);
    }
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: { images: true, user: true, group: true, comments: true, votes: true },
    });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  try {
    const body = await req.json();
    const { title, content, visibility, images = [] } = body;

    // Find existing images to remove files
    const existingImages = await prisma.postImage.findMany({ where: { postId: id } });
    for (const img of existingImages) removeFileIfUploadsUrl(img.url);

    // Remove DB image records for this post
    await prisma.postImage.deleteMany({ where: { postId: id } });

    // Ensure uploads dir exists
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
        uploadedUrls.push(image); // preserve URL
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        visibility,
        images: { create: uploadedUrls.map((url) => ({ url })) },
      },
      include: { images: true },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("PUT /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  try {
    // remove files for existing images
    const existingImages = await prisma.postImage.findMany({ where: { postId: id } });
    for (const img of existingImages) removeFileIfUploadsUrl(img.url);

    // delete the post (this will cascade if set in schema or delete images explicitly)
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
