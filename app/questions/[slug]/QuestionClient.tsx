"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import AnswerForm from "@/components/AnswerForm";
import { formatDistanceToNow } from "date-fns";
import * as Dialog from "@radix-ui/react-dialog";
import { Toaster, toast } from "sonner";

interface Answer {
  id: number;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date;
  authorId?: number;
  user?: {
    id?: number;
    name?: string;
    image?: string | null;
  } | null;
  anonymous?: boolean;
}

type Question = {
  id: number;
  title: string;
  content?: string;
  anonymous?: boolean;
  createdAt: string;
  user?: { name?: string; image?: string | null } | undefined;
  category?: {
    name?: string;
    imageUrl?: string | null;
    description?: string | null;
  } | null;
  answer: Answer[];
};

type User = {
  id?: number;
  name?: string | null;
  image?: string | null;
};

export default function QuestionClient({
  question,
  currentUser,
}: {
  question: Question;
  currentUser: User | null;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAnswersOpen, setIsAnswersOpen] = useState<boolean>(true);
  const [answers, setAnswers] = useState<Answer[]>(question.answer);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | undefined>(undefined);

  const handleAnswerSuccess = (newAnswer: Answer) => {
    setAnswers((prev) => [...prev, newAnswer]);
    toast("✅ Your answer has been posted!", {
      description: newAnswer.anonymous
        ? "Posted anonymously"
        : `Thank you, ${newAnswer.user?.name || "User"}!`,
    });
    setIsDialogOpen(false);
  };

  const handleEditSuccess = (updatedAnswer: Answer) => {
    setAnswers((prev) =>
      prev.map((ans) => (ans.id === updatedAnswer.id ? updatedAnswer : ans))
    );
    toast("✏️ Your answer has been updated!");
    setEditingAnswer(undefined);
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm("Are you sure you want to delete this answer?")) return;

    try {
      const res = await fetch(`/api/answers/${answerId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete answer");

      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
      toast("🗑️ Answer deleted successfully");
    } catch (err) {
      console.error(err);
      toast("❌ Failed to delete answer", {
        description: "Please try again later.",
      });
    }
  };

  const handleEditSubmit = async (updatedAnswer: Answer) => {
    try {
      const res = await fetch(`/api/answers/${updatedAnswer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: updatedAnswer.content,
          anonymous: updatedAnswer.anonymous,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");

      const data = await res.json();
      handleEditSuccess(data);
    } catch (err) {
      console.error(err);
      toast("❌ Failed to update answer", {
        description: "Please try again later.",
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-5 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Section */}
      <div className="md:col-span-2 space-y-6">
        {/* Question Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            {question.anonymous ? (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                ?
              </div>
            ) : question.user?.image ? (
              <img
                src={question.user.image}
                alt={question.user.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold">
                {question.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-800">
                {question.anonymous ? "Anonymous" : question.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-500">
                Posted · {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mt-4">
            <img
              src={question.category?.imageUrl || "/placeholder.png"}
              alt={question.category?.name || "Category"}
              className="w-10 h-10 object-cover rounded-md border border-gray-200"
            />
            <p className="text-gray-800 font-medium capitalize">
              {question.category?.name || "Uncategorized"}
            </p>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-3">{question.title}</h1>
          {question.content && <p className="text-gray-700">{question.content}</p>}
        </div>

        {/* Answers Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <button
            onClick={() => setIsAnswersOpen((s) => !s)}
            className="w-full flex justify-between items-center p-6 hover:bg-gray-50 transition rounded-t-2xl"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Answers ({answers.length})
            </h2>
            <ChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                isAnswersOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isAnswersOpen && (
            <div className="p-6 border-t border-gray-200 space-y-4">
              {answers.length > 0 ? (
                answers.map((ans) => (
                  <div
                    key={ans.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition relative"
                  >
                    {/* Answer Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold overflow-hidden">
                        {ans.anonymous
                          ? "?"
                          : ans.user?.image ? (
                              <img
                                src={ans.user.image}
                                alt={ans.user.name || "User"}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              ans.user?.name?.charAt(0).toUpperCase() || "U"
                            )}
                      </div>

                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {ans.anonymous ? "Anonymous" : ans.user?.name || "User"}
                        </span>
                        <p className="text-sm text-gray-500">
                          Posted · {formatDistanceToNow(new Date(ans.createdAt), { addSuffix: true })}
                        </p>
                      </div>

                      {/* 3-dot menu */}
                      {ans.authorId === currentUser?.id && (
                        <div ref={menuRef} className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(openMenuId === ans.id ? null : ans.id)
                            }
                            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition"
                            title="You can edit or delete your answer"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {openMenuId === ans.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
                              <button
                                onClick={() => {
                                  setEditingAnswer(ans);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
                              >
                                <Pencil className="w-4 h-4 text-blue-600" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  handleDeleteAnswer(ans.id);
                                  setOpenMenuId(null);
                                }}
                                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Editing Mode */}
                    {editingAnswer?.id === ans.id ? (
                      <div className="space-y-3">
                        <textarea
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows={4}
                          defaultValue={ans.content}
                          onChange={(e) =>
                            setEditingAnswer({ ...editingAnswer, content: e.target.value })
                          }
                        ></textarea>

                        <label className="flex items-center gap-2 text-gray-700">
                          <input
                            type="checkbox"
                            checked={editingAnswer.anonymous || false}
                            onChange={(e) =>
                              setEditingAnswer({ ...editingAnswer, anonymous: e.target.checked })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          Post anonymously
                        </label>

                        <div className="flex gap-2">
                          <button
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            onClick={() => editingAnswer && handleEditSubmit(editingAnswer)}
                          >
                            Save Changes
                          </button>
                          <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            onClick={() => setEditingAnswer(undefined)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 whitespace-pre-wrap">{ans.content}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No answers yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Answer Form */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-3">Write an Answer</h3>
          <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Dialog.Trigger asChild>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg shadow hover:bg-green-700 transition flex items-center justify-center gap-2">
                <Pencil className="w-4 h-4" /> Write an Answer
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                  <Dialog.Title className="text-xl font-semibold mb-4">
                    Write Your Answer
                  </Dialog.Title>
                  <AnswerForm
                    questionId={question.id}
                    onSuccess={handleAnswerSuccess}
                  />
                  <Dialog.Close asChild>
                    <button className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="hidden md:block">
        <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
          <h2 className="text-lg font-bold mb-4 text-green-700">Category Details</h2>
          <img
            src={question.category?.imageUrl || "/placeholder.png"}
            alt={question.category?.name || "Category"}
            className="w-24 h-24 object-cover rounded-lg border border-gray-200 mx-auto"
          />
          <h3 className="text-gray-800 font-semibold text-lg text-center capitalize mt-2">
            {question.category?.name || "Uncategorized"}
          </h3>
          <p className="text-sm text-gray-600 text-center mt-1">
            {question.category?.description || "No description available for this category."}
          </p>
        </div>
      </aside>

      <Toaster />
    </div>
  );
}
