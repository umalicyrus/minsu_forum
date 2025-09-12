"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreatePostModal({ userId, groupId }: { userId: number; groupId?: number }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PUBLIC"); // Match Prisma enum
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Generate previews when user selects images
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Convert files to base64
    const base64Files = await Promise.all(
      images.map(file =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
          reader.readAsDataURL(file);
        })
      )
    );

    // Call backend
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        visibility,
        images: base64Files, // send base64
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />

          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows={3}
            required
          />

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="PUBLIC">Public</option>
            <option value="GROUP">Group</option>
          </select>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full"
            />

            {/* Preview selected images */}
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
