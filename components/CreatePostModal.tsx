"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RichTextEditor from "./RichTextEditor";

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
  const [visibility, setVisibility] = useState("PUBLIC");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // handle images
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Convert files to base64
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
        content, // now HTML from TipTap
        visibility,
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
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
            required
          />

          {/* TipTap Editor */}
          <div>
            <label className="block text-sm font-medium mb-1 text-green-800">
              Content
            </label>
            <RichTextEditor content={content} setContent={setContent} />
          </div>

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
          >
            <option value="PUBLIC">Public</option>
            <option value="GROUP">Group</option>
          </select>


            {/* Upload Images */}
            <div>
              <label className="block text-sm font-medium mb-1 text-green-800">
                Upload Images
              </label>

              {/* Make this relative so the file input stays inside */}
              <div className="relative border-2 border-dashed border-green-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-green-100 cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10" // stays inside this box
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

              {/* Preview */}
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
