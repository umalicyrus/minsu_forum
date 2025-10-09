// app/posts/page.tsx
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma";
import Navbar from "@/components/navbar";
import PostsPageClient from "./PostsPageClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PostsPage() {
  // Get cookies
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  let user: { id: number; role?: string } | null = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      user = { id: decoded.id as number, role: decoded.role as string };
    } catch {
      user = null;
    }
  }
  const isAuthenticated = !!user;

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, imageUrl: true, description: true },
  });

  // Fetch posts from API
  let posts: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
    if (res.ok) {
      posts = await res.json();
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  const tags = ["Next.js", "Tailwind", "React", "Prisma", "Deployment"];
  const leaderboard = [
    { name: "Admin", points: 1200 },
    { name: "Jane Doe", points: 980 },
    { name: "Cyrus Umali", points: 870 },
  ];

  // ✅ Render Client Component for UI logic
  return (
    <PostsPageClient
      posts={posts}
      categories={categories}
      tags={tags}
      leaderboard={leaderboard}
      isAuthenticated={isAuthenticated}
      userId={user?.id}
    />
  );
}
