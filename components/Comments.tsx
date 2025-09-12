// components/Comments.tsx
"use client";

import { useState } from "react";

export default function Comments({
  postId,
  comments,
}: {
  postId: number;
  comments: any[];
}) {
  const [allComments, setAllComments] = useState(comments);
  const [text, setText] = useState("");

  async function addComment(e: any) {
    e.preventDefault();
    if (!text.trim()) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    const newComment = await res.json();

    if (!newComment.error) {
      setAllComments([...allComments, newComment]);
      setText("");
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">
        Comments ({allComments.length})
      </h2>

      {/* Comment List */}
      <div className="space-y-4">
        {allComments.map((c) => (
          <div
            key={c.id}
            className="bg-gray-50 p-3 rounded-lg border text-sm"
          >
            <div className="text-gray-800">{c.content}</div>
            <div className="text-gray-500 text-xs mt-1">
              by {c.user?.name ?? "Anonymous"}
            </div>
          </div>
        ))}
      </div>

      {/* Add Comment */}
      <form onSubmit={addComment} className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Post
        </button>
      </form>
    </div>
  );
}
