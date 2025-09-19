// app/posts/page.tsx
import Navbar from "@/components/navbar";
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";
import { cookies } from "next/headers"; // ✅ Next.js cookies API
import jwt, { JwtPayload } from "jsonwebtoken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PostsPage() {
  // ✅ Await cookies() here
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // ✅ Decode token
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

  // ✅ Everyone can see posts
  let posts: any[] = [];
  try {
    const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch posts:", res.statusText);
      return <div className="text-red-500">Failed to load posts.</div>;
    }
    posts = await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return <div className="text-red-500">Failed to load posts.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <Navbar />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Posts</h1>
        {/* ✅ Only logged-in users see CreatePostModal */}
        {isAuthenticated && <CreatePostModal userId={user!.id} />}
      </div>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <PostCard
            key={post.id}
            post={post}
            isAuthenticated={isAuthenticated} // pass down
          />
        ))}
      </div>
    </div>
  );
}
