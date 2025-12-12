"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { timeAgo } from "@/lib/timeAgo";

type Tab = "answers" | "questions" | "achievements" | "friends";

interface AnswerItem {
  id: number;
  content: string;
  questionId?: number;
  questionTitle: string | { [key: string]: any };
  category?: string | { [key: string]: any };
  createdAt: string;
  anonymous?: boolean;
}

interface QuestionItem {
  id: number;
  title: string | { [key: string]: any };
  slug?: string;
  createdAt: string;
  category?: Category;
}

interface Props {
  profile: {
    name: string;
    image: string | null;
    answers: number;
    questions: number;
    following: number;
  };
}

interface Category {
  id: number;
  name: string;
}

export default function ProfileRight({ profile }: Props) {
  const router = useRouter();

  const [active, setActive] = useState<Tab>("answers");
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<number[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  const toggleExpandAnswer = (id: number) => {
    setExpandedAnswers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleExpandQuestion = (id: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (active === "answers") {
          const res = await fetch("/api/answers/mine", {
            credentials: "include",
            cache: "no-store",
          });
          const data = res.ok ? await res.json() : [];

          const safeData = data.map((a: AnswerItem) => ({
            ...a,
            questionTitle:
              typeof a.questionTitle === "string" ? a.questionTitle : "Untitled",
            category: typeof a.category === "string" ? a.category : "General",
          }));

          setAnswers(safeData);
        } else if (active === "questions") {
          const res = await fetch("/api/questions/mine", {
            credentials: "include",
            cache: "no-store",
          });
          const data = res.ok ? await res.json() : [];

          const safeQuestions = data.map((q: QuestionItem) => ({
            ...q,
            title: typeof q.title === "string" ? q.title : q.title?.name || "Untitled",
          }));

          setQuestions(safeQuestions);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [active]);

  return (
    <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
      {/* Stats Navbar */}
      <div className="bg-white rounded-lg p-2 flex justify-around">
        {[
          { label: "Answers", value: profile.answers, tab: "answers" as Tab },
          { label: "Questions", value: profile.questions, tab: "questions" as Tab },
          { label: "Achievements", value: 1, tab: "achievements" as Tab },
          { label: "Friends", value: profile.following, tab: "friends" as Tab },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setActive(item.tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
              active === item.tab ? "bg-emerald-50" : "hover:bg-emerald-50"
            }`}
          >
            <p className="text-gray-500 text-sm">{item.label}</p>
            <p className="font-bold text-xl text-emerald-600">{item.value}</p>
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div className="bg-white rounded-lg p-6 flex flex-col gap-4 min-h-[400px]">
        {/* Tab Title */}
        <h2 className="text-lg font-semibold mb-2">
          {active === "answers" && "Answers"}
          {active === "questions" && "Questions"}
          {active === "achievements" && "Achievements"}
          {active === "friends" && "Friends"}
        </h2>

        <div className="flex flex-col gap-3">
          {loading && <div className="text-center text-gray-500">Loading...</div>}

          {/* ANSWERS TAB */}
          {!loading && active === "answers" && (
            <>
              {answers.length === 0 && (
                <div className="text-gray-500">No answers yet.</div>
              )}

              {answers.map((a) => {
                const isExpanded = expandedAnswers.includes(a.id);
                const titleStr =
                  typeof a.questionTitle === "string" ? a.questionTitle : "Untitled";
                const shortTitle =
                  titleStr.length > 160 ? titleStr.slice(0, 160) + "…" : titleStr;
                const categoryStr =
                  typeof a.category === "string" ? a.category : "General";
                const shortAnswer =
                  a.content.length > 160 && !isExpanded
                    ? a.content.slice(0, 160) + "…"
                    : a.content;

                return (
                  <div
                    key={a.id}
                    onClick={() => router.push(`/question/${a.questionId}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:shadow transition flex flex-col gap-2 cursor-pointer w-full"
                  >
                    {/* Top Row */}
                    <div className="flex items-start gap-3">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                          {profile.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="flex flex-col leading-tight w-full max-w-full break-words">
                        <div className="flex items-center flex-wrap gap-1 text-sm max-w-full">
                          <span className="font-semibold">{profile.name}</span>
                          <span className="text-gray-600">answered</span>
                          <span className="font-medium text-emerald-600 truncate max-w-[500px] md:max-w-[650px]">
                            {shortTitle}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{timeAgo(a.createdAt)}</span>
                          <span>•</span>
                          <span>{categoryStr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Answer:</p>
                      <ReactMarkdown>{shortAnswer}</ReactMarkdown>

                      {a.content.length > 160 && !isExpanded && (
                        <span
                          className="text-emerald-600 text-xs cursor-pointer ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandAnswer(a.id);
                          }}
                        >
                          ...more
                        </span>
                      )}

                      {isExpanded && a.content.length > 160 && (
                        <span
                          className="text-emerald-600 text-xs cursor-pointer ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandAnswer(a.id);
                          }}
                        >
                          show less
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* QUESTIONS TAB */}
          {!loading && active === "questions" && (
            <>
              {questions.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No questions posted yet.
                </div>
              )}

              {questions.map((q) => {
                const isExpanded = expandedQuestions.includes(q.id);
                const fullTitle =
                  typeof q.title === "string" ? q.title : q.title?.name || "Untitled";
                const shortTitle =
                  fullTitle.length > 160 && !isExpanded
                    ? fullTitle.slice(0, 160) + "…"
                    : fullTitle;
                const categoryStr = q.category?.name || "General";

                return (
                  <div
                    key={q.id}
                    onClick={() => router.push(`/question/${q.slug || q.id}`)}
                    className="flex flex-col border border-gray-200 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                  >
                    {/* Top Row */}
                    <div className="flex items-start gap-3">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                          {profile.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="flex flex-col leading-tight w-full max-w-full break-words">
                        <div className="flex items-center flex-wrap gap-1 text-sm max-w-full">
                          <span className="font-semibold">{profile.name}</span>
                          <span className="text-gray-600">posted</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{timeAgo(q.createdAt)}</span>
                          <span>•</span>
                          <span>{categoryStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Question Title */}
                    <div className="mt-2 text-sm">
                      <ReactMarkdown>{shortTitle}</ReactMarkdown>

                      {fullTitle.length > 160 && !isExpanded && (
                        <span
                          className="text-emerald-600 text-xs cursor-pointer ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandQuestion(q.id);
                          }}
                        >
                          ...more
                        </span>
                      )}

                      {isExpanded && fullTitle.length > 160 && (
                        <span
                          className="text-emerald-600 text-xs cursor-pointer ml-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandQuestion(q.id);
                          }}
                        >
                          show less
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
