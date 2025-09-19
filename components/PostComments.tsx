"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast"; // 👈 toast hook

type Comment = {
  id: number;
  content: string;
  author?: { name?: string | null };
};

type PostCommentsProps = {
  postId: number;
  isAuthenticated: boolean;
  onNewComment?: () => void;
};

export default function PostComments({
  postId,
  isAuthenticated,
  onNewComment,
}: PostCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Load comments for everyone
  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [postId]);

  // Add comment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Direct login check instead of requireAuth
    if (!isAuthenticated) {
      toast({
        title: "🔒 Login Required",
        description: "Please log in to post a comment.",
        variant: "destructive",
        className:
          "border-l-4 border-red-500 bg-red-50 text-red-800 rounded-xl shadow-md p-4",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to post comment: ${errorText}`);
      }

      const comment: Comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
      if (onNewComment) onNewComment();

      toast({
        title: "✅ Comment Posted",
        description: "Your comment was added successfully!",
        className:
          "border-l-4 border-green-500 bg-green-50 text-green-800 rounded-xl shadow-md p-4",
      });
    } catch (err: any) {
      console.error("❌ Post comment error:", err);
      toast({
        title: "⚠️ Error",
        description:
          err.message ?? "There was a problem posting your comment.",
        variant: "destructive",
        className:
          "border-l-4 border-red-500 bg-red-50 text-red-800 rounded-xl shadow-md p-4",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">
        Comments ({comments.length})
      </h2>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div
            key={c.id ?? `${c.content}-${Math.random()}`}
            className="bg-gray-50 p-3 rounded-lg border text-sm"
          >
            <div className="text-gray-800">{c.content}</div>
            <div className="text-gray-500 text-xs mt-1">
              by {c.author?.name ?? "Anonymous"}
            </div>
          </div>
        ))}
      </div>

      {/* Only show the form if authenticated */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border rounded-lg p-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-3">
          Log in to post a comment.
        </p>
      )}
    </div>
  );
}
