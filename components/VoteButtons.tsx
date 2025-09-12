// components/VoteButtons.tsx
"use client";

import { useState } from "react";

export default function VoteButtons({
  postId,
  votes,
}: {
  postId: number;
  votes: any[];
}) {
  // Calculate initial counts
  const upvotes = votes.filter((v) => v.type === "UP").length;
  const downvotes = votes.filter((v) => v.type === "DOWN").length;

  const [up, setUp] = useState(upvotes);
  const [down, setDown] = useState(downvotes);

  async function vote(type: "UP" | "DOWN") {
    const res = await fetch(`/api/posts/${postId}/votes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.ok) {
      if (type === "UP") setUp(up + 1);
      else setDown(down + 1);
    }
  }

  return (
    <div className="flex items-center gap-4 mt-4">
      <button
        onClick={() => vote("UP")}
        className="flex items-center gap-2 px-3 py-1 bg-green-100 hover:bg-green-200 rounded-lg"
      >
        👍 {up}
      </button>
      <button
        onClick={() => vote("DOWN")}
        className="flex items-center gap-2 px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg"
      >
        👎 {down}
      </button>
    </div>
  );
}
