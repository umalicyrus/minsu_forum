// app/posts/page.tsx
import CreatePostModal from "@/components/CreatePostModal";
import PostCard from "@/components/PostCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function PostsPage() {
  let posts = [];

  try {
    // Server-side fetch with absolute URL
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Posts</h1>
        <CreatePostModal userId={1} /> {/* Replace 1 with actual logged-in userId */}
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
