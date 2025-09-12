// app/posts/page.tsx
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";

// use a server-side env var; add BASE_URL to your .env
const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PostsPage() {
  let posts: any[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/posts`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }
    posts = await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <div className="max-w-3xl mx-auto mt-8 text-red-500">
        Failed to load posts.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <CreatePostModal userId={1} />
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts found.</p>
        ) : (
          posts.map((post: any) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
