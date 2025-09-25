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
import { toast } from "@/hooks/use-toast"; // ✅ add this


type Question = {
  id: number;
  title: string;
  content?: string;
  answersCount?: number;
  anonymous?: boolean; // 👈 added anonymous for question
  author?: {
    name: string | null;
    image?: string | null;
    isAnonymous?: boolean;
  };
  answers?: {
    id: number;
    content: string;
    createdAt: string;
    anonymous?: boolean; // 👈 added anonymous for answer
    author?: {
      name: string | null;
      image?: string | null;
      isAnonymous?: boolean;
    };
  }[];
};

export default function QuestionList({ refreshKey = 0 }: { refreshKey?: number }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answeringId, setAnsweringId] = useState<number | null>(null);
  const [expandedAnswers, setExpandedAnswers] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions");
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (error) {
        console.error("Failed to fetch questions", error);
      }
    };
    fetchQuestions();
  }, [refreshKey]);

  return (
    <div className="space-y-6">
      {questions.map((q) => (
        <Card
          key={q.id}
          className="p-6 shadow-md bg-gradient-to-r from-white to-green-50 rounded-2xl border border-green-200"
        >
          {/* ✅ User Avatar + Name */}
          <div className="flex items-center gap-3 mb-2">
            {q.anonymous ? ( // 👈 changed here
              // Anonymous icon
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                ?
              </div>
            ) : q.author?.image ? (
              // User has image
              <img
                src={q.author.image}
                alt={q.author.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              // No image → first letter of name
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {q.author?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <span className="font-medium text-gray-800">
              {q.anonymous
                ? "Anonymous"
                : q.author?.name || "Unknown User"} {/* 👈 changed here */}
            </span>
          </div>

          {/* Title */}
          <Link href={`/questions/${q.id}`}>
            <h2 className="text-lg font-semibold text-gray-800 hover:underline">
              {q.title}
            </h2>
          </Link>

          {/* Content */}
          {q.content && (
            <p className="text-sm text-gray-600 mt-2">{q.content}</p>
          )}

          {/* Button row */}
          <div className="flex justify-between items-center mt-4">
            {/* Left section with Answer count + icons below */}
            <div className="flex flex-col items-start gap-2">
              {/* ✅ Total answers as bold text link */}
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
                onClick={() =>
                  setOpenMenuId(openMenuId === q.id ? null : q.id)
                }
                className="p-1 hover:bg-gray-200 rounded-full transition"
                title="More options"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {openMenuId === q.id && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-10 animate-fadeIn">
                  {/* keep your existing dropdown menu items here */}
                  <p className="px-4 py-2 text-sm text-gray-600">
                    Menu items here
                  </p>
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
                setExpandedAnswers(q.id); // ✅ auto expand after submit

                // ✅ Toast notification here
                toast({
                  title: "Answer submitted",
                  description: "Your answer was posted successfully!",
                });
              }}
            />
          )}

          {/* ✅ Show answers list if expanded */}
          {expandedAnswers === q.id && q.answers && q.answers.length > 0 && (
            <div className="mt-4 space-y-3 pl-4 border-l-2 border-green-300">
              {q.answers.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-white rounded-xl shadow-sm border border-green-200 text-sm text-gray-800"
                >
                  <div className="flex items-center gap-2">
                    {a.anonymous ? ( // 👈 changed here
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
                        : a.author?.name || "Unknown User"} {/* 👈 changed here */}
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
      ))}
    </div>
  );
}
