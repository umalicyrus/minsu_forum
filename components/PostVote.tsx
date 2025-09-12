// components/PostVote.tsx
'use client';
import { useState } from 'react';

export default function PostVote({ postId, initialUpvotes, initialDownvotes }: any) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);

  const handleVote = async (value: number) => {
    const res = await fetch(`/api/posts/${postId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    const data = await res.json();
    setUpvotes(data.upvotes);
    setDownvotes(data.downvotes);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleVote(1)}>⬆ Upvote ({upvotes})</button>
      <button onClick={() => handleVote(-1)}>⬇ Downvote ({downvotes})</button>
    </div>
  );
}
