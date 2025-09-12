// app/posts/new/page.tsx
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
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto mt-8 space-y-4">
      <h1 className="text-2xl font-bold">Create a New Post</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-lg p-2"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg p-2"
        rows={4}
      />

      <select
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="public">Public</option>
        <option value="group">Group</option>
      </select>

      <input
        placeholder="Image URLs (comma separated)"
        value={images}
        onChange={(e) => setImages(e.target.value)}
        className="w-full border rounded-lg p-2"
      />

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        Create Post
      </button>
    </form>
  );
}
