import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
  try {
    const authUser = await getUserFromRequest(req);
    const loggedInUserId = authUser?.id;

    const followerInclude = loggedInUserId
      ? {
          where: { followerId: loggedInUserId },
          select: { id: true },
        }
      : { select: { id: true }, where: { followerId: 0 } };

    const posts = await prisma.post.findMany({
      include: {
        postimage: true,
        group: true,
        postcomment: true,
        postvote: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            follow_follow_followingIdTouser: followerInclude,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const postsWithCounts = posts.map((post) => {
      const upvotes = post.postvote.filter((v) => v.value === 1).length;
      const downvotes = post.postvote.filter((v) => v.value === -1).length;

      const isFollowing =
        Array.isArray(post.user.follow_follow_followingIdTouser) &&
        post.user.follow_follow_followingIdTouser.length > 0;

      return {
        ...post,
        images: post.postimage.map((img) => ({ url: img.url })), // ✅ remap
        upvotes,
        downvotes,
        user: {
          ...post.user,
          isFollowing,
        },
      };
    });

    return NextResponse.json(postsWithCounts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, visibility, images = [], userId, groupId } = body;

    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

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
        postimage: {
          create: uploadedUrls.map((url) => ({ url })),
        },
      },
      include: {
        postimage: true,
        user: true,
        group: true,
        postcomment: true,
        postvote: true,
      },
    });

    const upvotes = newPost.postvote.filter((v) => v.value === 1).length;
    const downvotes = newPost.postvote.filter((v) => v.value === -1).length;

    return NextResponse.json({
      ...newPost,
      images: newPost.postimage.map((img) => ({ url: img.url })), // ✅ remap
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
