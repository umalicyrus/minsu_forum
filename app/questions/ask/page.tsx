"use client";

import { useState } from "react";
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

  // Trigger refresh after posting
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
        body: JSON.stringify({ title, content, anonymous }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Unauthorized") {
          // Open login modal if user is not logged in
          setLoginOpen(true);
        } else {
          console.error("POST error:", data);
          throw new Error(data.error || "Failed to post question");
        }
        return;
      }

      setTitle("");
      setContent("");
      setOpen(false);
      handlePosted(); // refresh the list
    } catch (err: any) {
      console.error("handleSubmit error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="w-full max-w-2xl">
          <Card className="p-6 shadow-md bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200">
            <Dialog open={open} onOpenChange={setOpen}>
              {/* Top row with avatar + oval */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white shadow">
                  U
                </div>

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

              {/* Icons BELOW the oval */}
              <div className="flex justify-around mt-4 border-t border-green-200 pt-3">
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-green-700 hover:bg-green-100 rounded-full px-4 py-2"
                    onClick={() => setOpen(true)}
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

              {/* Popup content */}
              <DialogContent className="max-w-lg p-6 rounded-xl bg-green-50 border border-green-200 shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-green-800">
                    Ask a Question
                  </DialogTitle>
                </DialogHeader>

                {/* Tips */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-sm text-green-800 space-y-1">
                  <p className="font-medium">💡 Tips on getting good answers quickly:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Make sure your question has not been asked already</li>
                    <li>Keep your question short and to the point</li>
                    <li>Double-check grammar and spelling</li>
                  </ul>
                </div>

                {/* Input inside modal */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white shadow">
                    U
                  </div>
                  <Input
                    placeholder='Start your question with "What", "How", "Why", etc'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-full bg-white border border-green-300 px-4 py-2 flex-1 focus:ring-2 focus:ring-green-400"
                  />
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

                {/* Buttons */}
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

          {/* Question list below the AskCard */}
          <div className="mt-8">
            <QuestionList refreshKey={refreshKey} />
          </div>

          {/* Login Modal */}
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
                    // Redirect to your login page
                    window.location.href = "/login";
                  }}
                >
                  Go to Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
