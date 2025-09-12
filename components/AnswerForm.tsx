"use client";

import { useState } from "react";

type Answer = {
  id: number;
  content: string;
  createdAt: string;
  author?: { name: string | null };
};

export default function AnswerForm({
  questionId,
  onSuccess,
}: {
  questionId: number;
  onSuccess?: (newAnswer: Answer) => void;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, content }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      const newAnswer: Answer = await res.json(); // ✅ expect full answer from API

      setContent(""); 
      onSuccess?.(newAnswer); // ✅ send to parent
    } catch (err) {
      console.error(err);
      alert("Error posting answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        className="flex-1 border rounded-lg p-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Answer"}
      </button>
    </form>
  );
}
