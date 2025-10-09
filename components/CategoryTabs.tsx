"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  category: any; // You can type this strictly later
}

export default function CategoryTabs({ category }: CategoryTabsProps) {
  const [tab, setTab] = useState("posts");

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      {/* Tab Buttons */}
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="answers">Read Answers</TabsTrigger>
        <TabsTrigger value="writers">Most Viewed Writers</TabsTrigger>
      </TabsList>

      {/* Posts */}
      <TabsContent value="posts">
        {category.posts.length === 0 ? (
          <p className="text-gray-500">No posts in this category.</p>
        ) : (
          <ul className="space-y-4">
            {category.posts.map((post: any) => (
              <li key={post.id} className="p-4 bg-white rounded shadow">
                <h2 className="font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-600">{post.content}</p>
                <span className="text-xs text-gray-400">by {post.user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      {/* Questions */}
      <TabsContent value="questions">
        {category.questions.length === 0 ? (
          <p className="text-gray-500">No questions in this category.</p>
        ) : (
          <ul className="space-y-4">
            {category.questions.map((q: any) => (
              <li key={q.id} className="p-4 bg-white rounded shadow">
                <h2 className="font-semibold">{q.title}</h2>
                <p className="text-sm text-gray-600">{q.content}</p>
                <span className="text-xs text-gray-400">by {q.user.name}</span>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      {/* Answers */}
      <TabsContent value="answers">
        <p className="text-gray-500">👉 Here you can fetch & show answers related to questions in this category.</p>
      </TabsContent>

      {/* Writers */}
      <TabsContent value="writers">
        <p className="text-gray-500">👉 Here you can fetch & show top writers by most answers/posts.</p>
      </TabsContent>
    </Tabs>
  );
}
