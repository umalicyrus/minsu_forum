// app/posts/page.tsx
import Navbar from "@/components/navbar";
import CreatePostModal from "@/components/CreatePostModal";
import PostsPageClient from "./PostsPageClient";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PostsPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  // 🟩 static data for sidebar
  const categories = [
    { id: 1, name: "General Discussion" },
    { id: 2, name: "Announcements" },
    { id: 3, name: "Help & Support" },
    { id: 4, name: "Off Topic" },
  ];
  const tags = ["Next.js", "Tailwind", "React", "Prisma", "Deployment"];
  const leaderboard = [
    { name: "Admin", points: 1200 },
    { name: "Jane Doe", points: 980 },
    { name: "Cyrus Umali", points: 870 },
  ];

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* container */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 🟩 Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              + New Topic
            </button>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Top Contributors</h2>
            <ul className="space-y-2">
              {leaderboard.map((user, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{user.name}</span>
                  <span className="font-semibold text-blue-600">
                    {user.points}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

<main className="md:col-span-3 space-y-6">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold">All Posts</h1>
    {isAuthenticated && <CreatePostModal userId={user!.id} />}
  </div>

  {posts.length === 0 ? (
    <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
      No posts yet. Be the first to create one!
      {/* 🔹 Add CreatePostModal here too */}
      {isAuthenticated && (
        <div className="mt-4">
          <CreatePostModal userId={user!.id} />
        </div>
      )}
    </div>
  ) : (
    <PostsPageClient
      posts={posts}
      currentUserId={user?.id.toString()}
      isAuthenticated={isAuthenticated}
    />
  )}
</main>
      </div>
    </div>
  );
}
