"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Utility to format date into "x time ago"
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
  }

  return "Just now";
}

type Comment = {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  anonymous: boolean;
  user: {
    id: number;
    name: string | null;
    email: string;
  } | null;
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
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Load comments
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

    if (!isAuthenticated) {
      toast({
        title: "🔒 Login Required",
        description: "Please log in to post a comment.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment, anonymous: isAnonymous }),
      });

      if (!res.ok) throw new Error(await res.text());

      const comment: Comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment("");
      if (onNewComment) onNewComment();

      toast({
        title: "✅ Comment Posted",
        description: "Your comment was added successfully!",
      });
    } catch (err: any) {
      toast({
        title: "⚠️ Error",
        description: err.message ?? "There was a problem posting your comment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        💬 Comments ({comments.length})
      </h2>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((c) => {
          const authorName = c.user?.name ?? c.user?.email ?? "Anonymous";
          const avatar = authorName.charAt(0).toUpperCase();

          return (
            <div
              key={c.id}
              className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border"
            >
              {/* Avatar */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                {c.anonymous ? "?" : avatar}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    {c.anonymous ? "Anonymous" : authorName}
                  </span>
                  <span className="text-xs text-gray-400">
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-gray-800 mt-1">{c.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-50 p-4 rounded-xl border shadow-sm"
        >
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Post anonymously
            </label>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mt-4">
          🔑 Please log in to post a comment.
        </p>
      )}
    </div>
  );
}
