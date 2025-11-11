"use client";

import React, { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Answer } from "@/types/answer"; // ✅ shared type

interface AnswerListProps {
  answers: Answer[];
  currentUser: { id: number } | null;
  setEditingAnswer: (answer: Answer) => void;
  handleDeleteAnswer: (id: number) => void;
}

export default function AnswerList({
  answers,
  currentUser,
  setEditingAnswer,
  handleDeleteAnswer,
}: AnswerListProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-4 space-y-4">
      {answers.map((ans) => (
        <div key={ans.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
          {/* ✅ Avatar */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
              {ans.anonymous
                ? "A"
                : ans.author?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            {/* ✅ Name and Time */}
            <div className="flex-1">
              <span className="font-medium text-gray-800">
                {ans.anonymous
                  ? "Anonymous"
                  : ans.author?.name || "User"}
              </span>
              <p className="text-sm text-gray-500">
                Posted ·{" "}
                {formatDistanceToNow(new Date(ans.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* ✅ 3-dot menu for edit/delete */}
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
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
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

          {/* ✅ Answer Content */}
          <p className="text-gray-700 whitespace-pre-wrap">{ans.content}</p>
        </div>
      ))}
    </div>
  );
}
