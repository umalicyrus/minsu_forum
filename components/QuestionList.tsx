"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
} from "lucide-react";
import AnswerForm from "./AnswerForm";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast"; // ✅ keep your toast hook

type Question = {
  id: number;
  title: string;
  content?: string;
  answersCount?: number;
  anonymous?: boolean;
  author?: {
    name: string | null;
    image?: string | null;
    isAnonymous?: boolean;
  };
  answers?: {
    id: number;
    content: string;
    createdAt: string;
    anonymous?: boolean;
    author?: {
      name: string | null;
      image?: string | null;
      isAnonymous?: boolean;
    };
  }[];
};

export default function QuestionList({
  refreshKey = 0,
  categoryId = null, // 🟢 ADDED: optional category filter prop
}: {
  refreshKey?: number;
  categoryId?: number | null;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchQuestions = async () => {
      try {
        // 🟢 Use categoryId to filter server-side if provided
        const url = categoryId ? `/api/questions?categoryId=${categoryId}` : "/api/questions";
        const res = await fetch(url);

        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        } else {
          console.error("Failed to fetch questions", await res.text());
        }
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    };

    fetchQuestions();

    return () => {
      mounted = false;
    };
  }, [refreshKey, categoryId]); // 🟢 include categoryId so it refetches when selection changes

  return (
    <div className="space-y-6">
      {/* 🟢 Display message if no questions */}
      {questions.length === 0 ? (
        <p className="text-center text-gray-500 italic mt-10">
          No questions yet in this category.
        </p>
      ) : (
        questions.map((q) => (
          <Card
            key={q.id}
            className="p-6 shadow-md bg-gradient-to-r from-white to-green-50 rounded-2xl border border-green-200"
          >
            {/* ✅ User Avatar + Name */}
            <div className="flex items-center gap-3 mb-2">
              {q.anonymous ? (
                // Anonymous avatar
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                  ?
                </div>
              ) : q.author?.image ? (
                // User image
                <img
                  src={q.author.image}
                  alt={q.author.name || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                // Letter avatar fallback
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                  {q.author?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              <span className="font-medium text-gray-800">
                {q.anonymous ? "Anonymous" : q.author?.name || "Unknown User"}
              </span>
            </div>

            {/* Title */}
            <Link href={`/questions/${q.id}`}>
              <h2 className="text-lg font-semibold text-gray-800 hover:underline">
                {q.title}
              </h2>
            </Link>

            {/* Content */}
            {q.content && <p className="text-sm text-gray-600 mt-2">{q.content}</p>}

            {/* Button row */}
            <div className="flex justify-between items-center mt-4">
              {/* Left section with Answer count + icons */}
              <div className="flex flex-col items-start gap-2">
                {/* Total answers */}
                <button
                  onClick={() =>
                    setExpandedAnswers(expandedAnswers === q.id ? null : q.id)
                  }
                  className="font-bold text-green-700 hover:underline cursor-pointer"
                >
                  {q.answersCount || 0} Answers
                </button>

                {/* Icons row */}
                <div className="flex items-center gap-6">
                  {/* Answer */}
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Answer"
                    onClick={() =>
                      setAnsweringId(answeringId === q.id ? null : q.id)
                    }
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>

                  {/* Upvote */}
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Upvote"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>

                  {/* Downvote */}
                  <button
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                    title="Downvote"
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 3-dot menu */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === q.id ? null : q.id)}
                  className="p-1 hover:bg-gray-200 rounded-full transition"
                  title="More options"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {openMenuId === q.id && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                    <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                      <li>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/questions/${q.id}`);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 12h6m-3-3v6m4.5-6.5l3.5 3.5-3.5 3.5m-9-7l-3.5 3.5 3.5 3.5" />
                          </svg>
                          Copy link
                        </button>
                      </li>

                      <li>
                        <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                          <MessageCircle className="w-4 h-4 mr-2 text-gray-500" />
                          Request answers
                        </button>
                      </li>

                      <li>
                        <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Pass question
                        </button>
                      </li>

                      <li>
                        <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 8v4l3 3m6 2A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
                          </svg>
                          Answer later
                        </button>
                      </li>

                      <li>
                        <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14m7-7H5" />
                          </svg>
                          Merge questions
                        </button>
                      </li>

                      <li>
                        <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" />
                          </svg>
                          Report
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Inline Answer Form (shows only if Answer icon is clicked) */}
            {answeringId === q.id && (
              <AnswerForm
                questionId={q.id}
                onSuccess={(newAnswer) => {
                  setAnsweringId(null); // hide form after submit
                  setQuestions((prev) =>
                    prev.map((qq) =>
                      qq.id === q.id
                        ? {
                            ...qq,
                            answersCount: (qq.answersCount || 0) + 1,
                            answers: [...(qq.answers || []), newAnswer],
                          }
                        : qq
                    )
                  );
                  setExpandedAnswers(q.id); // auto expand after submit

                  // Toast notification here
                  toast({
                    title: "Answer submitted",
                    description: "Your answer was posted successfully!",
                  });
                }}
              />
            )}

            {/* Show answers list if expanded */}
            {expandedAnswers === q.id && q.answers && q.answers.length > 0 && (
              <div className="mt-4 space-y-3 pl-4 border-l-2 border-green-300">
                {q.answers.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-white rounded-xl shadow-sm border border-green-200 text-sm text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {a.anonymous ? (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold">
                          ?
                        </div>
                      ) : a.author?.image ? (
                        <img
                          src={a.author.image}
                          alt={a.author.name || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 text-sm font-bold">
                          {a.author?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <span className="font-medium text-green-800">
                        {a.anonymous
                          ? "Anonymous"
                          : a.author?.name || "Unknown User"}
                      </span>
                      {a.createdAt && (
                        <span className="text-xs text-gray-500">
                          {new Date(a.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1">{a.content}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
