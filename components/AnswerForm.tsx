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

  // ✅ new state for anonymous checkbox
  const [anonymous, setAnonymous] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ include anonymous in body
        body: JSON.stringify({ questionId, content, anonymous }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      const newAnswer: Answer = await res.json(); // ✅ expect full answer from API

      setContent(""); 
      setAnonymous(false); // ✅ reset checkbox after submit
      onSuccess?.(newAnswer); // ✅ send to parent
    } catch (err) {
      console.error(err);
      alert("Error posting answer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
      <div className="flex gap-2">
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
      </div>

      {/* ✅ checkbox for anonymous answers */}
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        Post as Anonymous
      </label>
    </form>
  );
}
