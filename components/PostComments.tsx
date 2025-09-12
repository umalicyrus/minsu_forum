"use client";
import { useState, useEffect } from "react";

type Comment = {
  id: number;
  content: string;
  author?: { name?: string | null };
};

export default function PostComments({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch(() => setComments([]));
  }, [postId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    const comment: Comment = await res.json();
    setComments([comment, ...comments]);
    setNewComment("");
  }

  return (
    <div className="px-4 pb-3 text-sm">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 rounded">
          Post
        </button>
      </form>
        <ul className="space-y-1">
        {comments.map((c) => (
            <li key={c.id ?? `${c.content}-${Math.random()}`}>
            <span className="font-semibold">{c.author?.name ?? "Anon"}:</span>{" "}
            {c.content}
            </li>
        ))}
        </ul>
    </div>
  );
}
