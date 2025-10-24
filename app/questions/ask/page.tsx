"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import QuestionList from "@/components/QuestionList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, PenLine, Pencil } from "lucide-react";
import Navbar from "@/components/navbar";

export default function AskCardPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState<
    { id: number; name: string; description?: string; imageUrl?: string }[]
  >([]);
  const [tags, setTags] = useState<string[]>([]);
  const [leaderboard, setLeaderboard] = useState<
    { name: string; points: number }[]
  >([]);

  const [user, setUser] = useState<{ firstName?: string; image?: string } | null>(
    null
  );

  // Fetch user, categories, tags, leaderboard
  useEffect(() => {
    fetchUser();
    fetchCategories();
    fetchTags();
    fetchLeaderboard();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", { credentials: "include" });
      if (res.ok) setUser(await res.json());
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) setCategories(await res.json());
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await fetch("/api/tags");
      if (res.ok) setTags(await res.json());
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) setLeaderboard(await res.json());
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  };

  function handlePosted() {
    setRefreshKey((prev) => prev + 1);
  }

  async function handleSubmit() {
    if (!title) return;

    setLoading(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content, anonymous, categoryId }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "Unauthorized") setLoginOpen(true);
        else throw new Error(data.error || "Failed to post question");
        return;
      }

      setTitle("");
      setContent("");
      setOpen(false);
      handlePosted();
    } catch (err: any) {
      console.error("handleSubmit error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const renderAvatar = () => {
    if (user?.image) {
      return (
        <img
          src={user.image}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover shadow"
        />
      );
    }

    const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U";
    return (
      <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white shadow">
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        {/* 🟢 Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-green-700">Categories</h2>

            {/* ✅ All Questions button */}
            <button
              onClick={() => setCategoryId(null)}
              className={`w-full text-left p-2 rounded-lg font-medium mb-2 ${
                categoryId === null
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "hover:bg-green-50"
              }`}
            >
              All Questions
            </button>

            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)} // ✅ category filter
                  className={`relative group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    categoryId === cat.id
                      ? "bg-green-100 border border-green-300"
                      : "hover:bg-green-50"
                  }`}
                >
                  <img
                    src={cat.imageUrl || "/placeholder.png"}
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  <span className="text-gray-800 font-medium text-base capitalize">
                    {cat.name}
                  </span>
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 hidden group-hover:block z-20">
                    <div className="bg-green-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg max-w-xs break-words animate-fade-in">
                      {cat.description || "No description available"}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <button className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-all">
              + New Topic
            </button>
          </div>

          {/* Tags */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow p-4 border border-green-200">
            <h2 className="text-lg font-bold mb-4 text-green-800">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg cursor-pointer hover:bg-green-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow p-4 border border-green-200">
            <h2 className="text-lg font-bold mb-4 text-green-800">Top Contributors</h2>
            <ul className="space-y-2">
              {leaderboard.map((user, idx) => (
                <li key={idx} className="flex justify-between text-sm text-green-700">
                  <span>{user.name}</span>
                  <span className="font-semibold text-green-800">{user.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 🟢 Main Content */}
        <main className="md:col-span-2">
          <Card className="p-6 shadow-md bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
            <Dialog open={open} onOpenChange={setOpen}>
              <div className="flex items-center gap-3">
                {renderAvatar()}
                <DialogTrigger asChild>
                  <div className="flex-1">
                    <Input
                      placeholder="What do you want to ask or share?"
                      className="rounded-full bg-white px-4 py-2 flex-1 cursor-pointer border border-green-200 focus:ring-2 focus:ring-green-400"
                      readOnly
                      onClick={() => setOpen(true)}
                    />
                  </div>
                </DialogTrigger>
              </div>

              <div className="flex justify-around mt-4 border-t border-green-200 pt-3">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-green-700 hover:bg-green-100 rounded-full px-4 py-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Ask
                  </Button>
                </DialogTrigger>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-green-700 hover:bg-green-100 rounded-full px-4 py-2"
                >
                  <PenLine className="w-5 h-5" />
                  Answer
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-green-700 hover:bg-green-100 rounded-full px-4 py-2"
                >
                  <Pencil className="w-5 h-5" />
                  Post
                </Button>
              </div>

              <DialogContent className="max-w-lg p-6 rounded-xl bg-green-50 border border-green-200 shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-green-800">
                    Ask a Question
                  </DialogTitle>
                </DialogHeader>

                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-sm text-green-800 space-y-1">
                  <p className="font-medium">💡 Tips on getting good answers quickly:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure your question has not been asked already</li>
                    <li>Keep your question short and to the point</li>
                    <li>Double-check grammar and spelling</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  {renderAvatar()}
                  <Input
                    placeholder='Start your question with "What", "How", "Why", etc'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-full bg-white border border-green-300 px-4 py-2 flex-1 focus:ring-2 focus:ring-green-400"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-green-800 mb-1 block">
                    Select Category
                  </label>
                  <select
                    value={categoryId ?? ""}
                    onChange={(e) =>
                      setCategoryId(e.target.value ? Number(e.target.value) : null)
                    }
                    className="w-full border border-green-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">-- Choose a category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    id="anonymous"
                    className="w-4 h-4"
                  />
                  <label htmlFor="anonymous" className="text-sm text-green-800">
                    Post anonymously
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="border-green-400 text-green-700 hover:bg-green-100"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmit}
                    disabled={loading || !title}
                  >
                    {loading ? "Posting..." : "Post Question"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Card>

          {/* ✅ Pass categoryId to QuestionList */}
          <div className="mt-8">
            <QuestionList refreshKey={refreshKey} categoryId={categoryId} />
          </div>

          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogContent className="max-w-md p-6 rounded-xl bg-white border border-gray-200 shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold text-gray-800">
                  Please Login
                </DialogTitle>
              </DialogHeader>
              <p className="mt-2 text-gray-600">
                You need to be logged in to post a question.
              </p>
              <div className="flex justify-end mt-4">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setLoginOpen(false);
                    window.location.href = "/login";
                  }}
                >
                  Go to Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
