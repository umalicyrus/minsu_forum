"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface AnswerFormProps {
  questionId: number;
  existingAnswer?: Answer;
  onSuccess: (newAnswer: Answer) => void;
}

interface Answer {
  id: number;
  content: string;
  anonymous?: boolean;
}

export default function AnswerForm({
  questionId,
  existingAnswer,
  onSuccess,
}: AnswerFormProps) {
  const [content, setContent] = useState(existingAnswer?.content || "");
  const [anonymous, setAnonymous] = useState(existingAnswer?.anonymous || false);
  const [loading, setLoading] = useState(false);

  const isEditing = !!existingAnswer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast("⚠️ Content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        isEditing ? `/api/answers/${existingAnswer?.id}` : "/api/answers",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId,
            content,
            anonymous,
          }),
        }
      );

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      onSuccess(data);
    } catch (err) {
      console.error(err);
      toast("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={4}
        placeholder="Write your answer..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          disabled={loading}
        />
        Post anonymously
      </label>

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
        disabled={loading}
      >
        {loading ? "Saving..." : isEditing ? "Update Answer" : "Post Answer"}
      </button>
    </form>
  );
}
