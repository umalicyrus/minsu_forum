"use client";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function ForumPage() {
  // Dummy Sidebar Data
  const categories = [
    { id: 1, name: "General Discussion" },
    { id: 2, name: "Announcements" },
    { id: 3, name: "Help & Support" },
    { id: 4, name: "Off Topic" },
  ];
  const tags = ["Next.js", "Tailwind", "React", "Prisma", "Deployment"];
  const leaderboard = [
    { name: "Admin", points: 1200 },
    { name: "Jane Doe", points: 980 },
    { name: "Cyrus Umali", points: 870 },
  ];

  // State for Questions
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch questions from API
  async function fetchQuestions() {
    const res = await fetch("/api/questions");
    const data = await res.json();
    setQuestions(data);
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Post a new question
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, userId: 1 }), // replace userId from your auth
    });
    setTitle("");
    setContent("");
    setLoading(false);
    fetchQuestions();
  }

  // Edit question
  async function handleEdit(id: number) {
    const newTitle = prompt("New title:");
    const newContent = prompt("New content:");
    if (!newTitle || !newContent) return;
    await fetch(`/api/questions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    });
    fetchQuestions();
  }

  // Delete question
  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this question?")) return;
    await fetch(`/api/questions/${id}`, { method: "DELETE" });
    fetchQuestions();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Minsu Forum</h1>
          <div className="flex-1 mx-6">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full border rounded-lg px-3 py-1 focus:outline-blue-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              🔔
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://via.placeholder.com/32"
                alt="avatar"
                className="rounded-full w-8 h-8"
              />
              <span className="font-medium">User1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {cat.name}
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              + New Topic
            </button>
          </div>

          {/* Popular Tags */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-lg cursor-pointer hover:bg-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Top Contributors</h2>
            <ul className="space-y-2">
              {leaderboard.map((user, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{user.name}</span>
                  <span className="font-semibold text-blue-600">
                    {user.points}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Area */}
        <main className="md:col-span-3 space-y-6">
          {/* Ask Question Form */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Ask a Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                className="border w-full p-2 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="border w-full p-2 rounded"
                placeholder="Describe your question..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Posting..." : "Post Question"}
              </button>
            </form>
          </div>

          {/* Question List */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">Latest Questions</h2>
            {questions.map((q) => (
              <div
                key={q.id}
                className="border-b last:border-0 pb-4 mb-4 last:mb-0"
              >
                <h3 className="text-blue-600 font-semibold hover:underline cursor-pointer text-lg">
                  {q.title}
                </h3>
                <p className="text-gray-700 mb-2">{q.content}</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {q.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    {q.user?.name || "Unknown"}
                    {q.user?.verified && (
                      <CheckCircle
                        className="text-blue-500 inline-block w-4 h-4"
                        strokeWidth={2}
                      />
                    )}
                  </span>
                  <span>▲ {q.votes || 0} | 💬 {q.comments || 0} comments</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(q.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
