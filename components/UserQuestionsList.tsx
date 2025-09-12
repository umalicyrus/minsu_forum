"use client";

import { useEffect, useState } from "react";

type Question = {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function UserQuestionsList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserQuestions() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/question/user", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch your questions");
        const data = await res.json();
        setQuestions(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserQuestions();
  }, []);

  if (loading) return <p className="text-gray-500">Loading your questions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold text-green-800">Your Questions</h2>
      {questions.length === 0 ? (
        <p className="text-gray-500">You haven’t posted any questions yet.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            className="p-4 border border-green-200 rounded-xl bg-green-50 shadow-sm"
          >
            <p className="font-medium text-green-900">{q.title}</p>
            {q.content && <p className="text-sm text-gray-700 mt-1">{q.content}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Created at: {new Date(q.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
