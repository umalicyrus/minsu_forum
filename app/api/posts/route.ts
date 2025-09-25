import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth"; // 👈 added
import fs from "fs";
import path from "path";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

export async function GET(req: Request) {
  try {
    // ✅ get logged in user ID from your JWT cookie
    const authUser = await getUserFromRequest(req);
    const loggedInUserId = authUser?.id;

    // ✅ build follower include dynamically
    const followerInclude = loggedInUserId
      ? {
          where: { followerId: loggedInUserId },
          select: { id: true },
        }
      : { select: { id: true }, where: { followerId: 0 } }; // always empty if not logged in

    // ✅ fetch posts with filtered followers
    const posts = await prisma.post.findMany({
      include: {
        // 🔹 fixed names to match your Prisma schema
        postimage: true, // instead of images
        group: true,
        postcomment: true, // instead of comments
        postvote: true, // instead of votes
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            // 🔹 instead of followers use actual relation name
            follow_follow_followingIdTouser: followerInclude,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ Add upvotes & downvotes & isFollowing to each post
    const postsWithCounts = posts.map((post) => {
      const upvotes = post.postvote.filter((v) => v.value === 1).length;
      const downvotes = post.postvote.filter((v) => v.value === -1).length;

      // ✅ Check if logged-in user follows this post’s author
      const isFollowing =
        Array.isArray(post.user.follow_follow_followingIdTouser) &&
        post.user.follow_follow_followingIdTouser.length > 0;

      return {
        ...post,
        upvotes,
        downvotes,
        user: {
          ...post.user,
          isFollowing, // 👈 add a boolean flag for frontend
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

    // Ensure uploads folder exists
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
        // 🔹 use postimage instead of images
        postimage: {
          create: uploadedUrls.map((url) => ({ url })),
        },
      },
      include: {
        postimage: true,
        user: true,
        group: true,
        postcomment: true,
        postvote: true, // 🔹 votes → postvote
      },
    });

    // ✅ Add upvotes & downvotes to the newly created post
    const upvotes = newPost.postvote.filter((v) => v.value === 1).length;
    const downvotes = newPost.postvote.filter((v) => v.value === -1).length;

    return NextResponse.json({ ...newPost, upvotes, downvotes });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
