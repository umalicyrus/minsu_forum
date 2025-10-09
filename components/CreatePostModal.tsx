"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RichTextEditor from "./RichTextEditor";

interface Category {
  id: number;
  name: string;
}

export default function CreatePostModal({
  userId,
  groupId,
}: {
  userId: number;
  groupId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ Fetch categories from API on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const base64Files = await Promise.all(
      images.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
          })
      )
    );

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        categoryId: categoryId || null, // ✅ send selected category
        images: base64Files,
        userId,
        groupId,
      }),
    });

    const newPost = await res.json();
    if (!newPost.error) {
      setOpen(false);
      window.location.href = `/posts/${newPost.id}`;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
          Create Post
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-6 rounded-xl bg-green-50 border border-green-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-green-800">
            Create a New Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1 text-green-800">
              Content
            </label>
            <RichTextEditor content={content} setContent={setContent} />
          </div>

          {/* ✅ Categories dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1 text-green-800">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Images */}
          <div>
            <label className="block text-sm font-medium mb-1 text-green-800">
              Upload Images
            </label>
            <div className="relative border-2 border-dashed border-green-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-green-100 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-green-700 mt-2 pointer-events-none">
                Click or drag to upload
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {previewUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="preview"
                  className="rounded border h-20 w-full object-cover"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="border-green-400 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
