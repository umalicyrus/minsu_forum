"use client";
import React, { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";

// define a type for Post and Props
type PostUser = {
  id: number | string;
  isFollowing?: boolean;
  name?: string;
  avatar?: string;
};

type Post = {
  id: number | string;
  title?: string;
  content?: string;
  user: PostUser;
  commentCount?: number;
  images?: { url: string }[];
  votes?: { value: number }[];
  createdAt?: string;
};

interface PostsPageClientProps {
  posts: Post[];
  currentUserId?: string;
  isAuthenticated: boolean;
}

export default function PostsPageClient({
  posts,
  currentUserId,
  isAuthenticated,
}: PostsPageClientProps) {
  // explicitly type the Set as Set<string>
  const [followedAuthors, setFollowedAuthors] = useState<Set<string>>(new Set<string>());

  // initialize from posts that already have isFollowing true
  useEffect(() => {
    const initial = new Set<string>(
      posts
        .filter((p) => p.user?.isFollowing)
        .map((p) => p.user.id.toString())
    );
    setFollowedAuthors(initial);
  }, [posts]);

  // When a PostCard toggles follow/unfollow
  const handleFollowToggle = (authorId: string, nowFollowing: boolean) => {
    setFollowedAuthors((prev) => {
      const next = new Set<string>(prev);
      if (nowFollowing) next.add(authorId);
      else next.delete(authorId);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          isAuthenticated={isAuthenticated}
          currentUserId={currentUserId}
          isFollowing={followedAuthors.has(post.user.id.toString())}
          onFollowToggle={handleFollowToggle}
        />
      ))}
    </div>
  );
}
