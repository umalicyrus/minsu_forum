"use client";

import { useState } from "react";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [images, setImages] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        visibility,
        images: images.split(","),
        userId: 1, // replace with logged-in user id
        groupId: null, // optional
      }),
    });

    const newPost = await res.json();
    if (!newPost.error) window.location.href = `/posts/${newPost.id}`;
  }

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full p-6 rounded-xl bg-green-50 border border-green-200 shadow-lg space-y-5"
      >
        {/* Header */}
        <h1 className="text-lg font-semibold text-green-800">
          ✏️ Create a New Post
        </h1>

        {/* Tips Box */}
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-sm text-green-800 space-y-1">
          <p className="font-medium">💡 Tips to make a great post:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Write a clear and descriptive title</li>
            <li>Provide enough details in the content</li>
            <li>Add images (optional) for better clarity</li>
          </ul>
        </div>

        {/* Title */}
        <input
          placeholder='Start your title with "What", "How", "Why", etc.'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-full bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
        />

        {/* Content */}
        <textarea
          placeholder="Write your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
          rows={4}
        />

        {/* Visibility */}
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
        >
          <option value="public">Public</option>
          <option value="group">Group Only</option>
        </select>

        {/* Images */}
        <input
          placeholder="Image URLs (comma separated)"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="rounded-lg bg-white border border-green-300 px-4 py-2 w-full focus:ring-2 focus:ring-green-400"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="border-green-400 text-green-700 hover:bg-green-100 px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}
