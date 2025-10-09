"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";
import CreatePostModal from "@/components/CreatePostModal";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, PenLine, Pencil } from "lucide-react";
import PostCard from "@/components/PostCard";

interface Props {
  posts: any[];
  categories: any[];
  tags: string[];
  leaderboard: { name: string; points: number }[];
  isAuthenticated: boolean;
  userId?: number;
}

export default function PostsPageClient({
  posts,
  categories,
  tags,
  leaderboard,
  isAuthenticated,
  userId,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  async function handleSubmit() {
    if (!title) return;
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content, anonymous }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "Unauthorized") {
          setLoginOpen(true);
        }
        throw new Error(data.error || "Failed to post question");
      }

      setTitle("");
      setContent("");
      setOpen(false);
    } catch (err: any) {
      console.error("handleSubmit error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-green-700">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="relative group flex items-center gap-3 p-2 rounded-lg hover:bg-green-50 cursor-pointer transition-colors"
                >
                  <img
                    src={cat.imageUrl || "/placeholder.png"}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  <span className="text-gray-800 font-medium text-base capitalize">
                    {cat.name}
                  </span>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block z-20">
                    <div className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs break-words animate-fade-in">
                      {cat.description || "No description available"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all">
              + New Topic
            </button>
          </div>

          {/* Tags */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow p-4 border border-green-200">
            <h2 className="text-lg font-bold mb-4 text-green-800">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg cursor-pointer hover:bg-green-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow p-4 border border-green-200">
            <h2 className="text-lg font-bold mb-4 text-green-800">Top Contributors</h2>
            <ul className="space-y-2">
              {leaderboard.map((user, idx) => (
                <li key={idx} className="flex justify-between text-sm text-green-700">
                  <span>{user.name}</span>
                  <span className="font-semibold text-green-800">{user.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-800">All Posts</h1>
            {isAuthenticated && <CreatePostModal userId={userId!} />}
          </div>

          {/* Ask/Share Card */}
          {isAuthenticated && (
            <Card className="p-6 shadow-md bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
              <Dialog open={open} onOpenChange={setOpen}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white shadow">
                    U
                  </div>
                  <DialogTrigger asChild>
                    <div className="flex-1">
                      <Input
                        placeholder="What do you want to ask or share?"
                        readOnly
                        onClick={() => setOpen(true)}
                      />
                    </div>
                  </DialogTrigger>
                </div>

                <div className="flex justify-around mt-4 border-t border-green-200 pt-3">
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 text-green-700 hover:bg-green-100 rounded-full px-4 py-2"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Ask
                    </Button>
                  </DialogTrigger>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <PenLine className="w-5 h-5" /> Answer
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Pencil className="w-5 h-5" /> Post
                  </Button>
                </div>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white shadow">
                      U
                    </div>
                    <Input
                      placeholder='Start your question with "What", "How", "Why", etc'
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    <label>Post anonymously</label>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={() => setOpen(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !title}>
                      {loading ? "Posting..." : "Post Question"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="bg-green-50 p-6 rounded-xl text-center">
              No posts yet. Be the first!
              {isAuthenticated && <CreatePostModal userId={userId!} />}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUserId={userId?.toString()}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
