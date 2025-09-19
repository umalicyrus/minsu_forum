"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  X,
  MoreHorizontal,
} from "lucide-react";
import PostComments from "./PostComments";
import { toast } from "@/hooks/use-toast"; // 👈 added toast

export default function PostCard({
  post,
  isAuthenticated = false, // pass this from parent
}: {
  post: any;
  isAuthenticated?: boolean;
}) {
  const [upvotes, setUpvotes] = useState<number | null>(null);
  const [downvotes, setDownvotes] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(
    post.commentCount ?? 0
  );

  useEffect(() => {
    if (post.votes) {
      setUpvotes(post.votes.filter((v: any) => v.value === 1).length);
      setDownvotes(post.votes.filter((v: any) => v.value === -1).length);
    }
  }, [post.votes]);

  async function handleVote(value: number) {
    // 🚫 if not authenticated, show toast
    if (!isAuthenticated) {
      toast({
        title: "🔒 Login Required",
        description: "You need to be logged in to vote.",
        variant: "destructive",
        className:
          "border-l-4 border-red-500 bg-red-50 text-red-800 rounded-xl shadow-md p-4",
      });
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });

      if (!res.ok) {
        console.error("Vote failed");
        return;
      }

      const data = await res.json();
      // API returns { upvotes, downvotes }
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    } catch (err) {
      console.error(err);
    }
  }

  // 🚀 allow everyone to view comments but toast if not logged in
  function handleToggleComments() {
    setShowComments(!showComments);

    if (!isAuthenticated) {
      toast({
        title: "ℹ️ Notice",
        description: "You can view comments but must log in to post.",
        variant: "default",
        className:
          "border-l-4 border-blue-500 bg-blue-50 text-blue-800 rounded-xl shadow-md p-4",
      });
    }
  }

  // Images logic
  const images = post.images ?? [];
  const remaining = images.length > 2 ? images.length - 2 : 0;

  const contentLimit = 150;
  const contentTooLong = post.content?.length > contentLimit;
  const displayedContent =
    !expanded && contentTooLong
      ? post.content.slice(0, contentLimit) + "..."
      : post.content;

  // Lightbox
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOpen = (idx: number) => {
    setActiveIndex(idx);
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div className="bg-gray-100 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {post.user?.avatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={post.user.avatar}
                alt={post.user?.name ?? "User avatar"}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-bold">
                {post.user?.name?.[0]?.toUpperCase() ?? "A"}
              </span>
            </div>
          )}

          {/* User name + Follow */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-gray-800">
              {post.user?.name ?? "Anonymous"}
            </span>
            <span className="text-gray-400">•</span>
            <button className="text-blue-600 font-bold hover:underline">
              Follow
            </button>
          </div>
        </div>

        {/* Hide (X) */}
        <button
          title="Hide"
          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* TITLE */}
      <h2 className="px-4 text-xl font-bold text-gray-900">{post.title}</h2>

      {/* CONTENT */}
      {post.content && (
        <div className="px-4 py-2 text-gray-700 text-sm leading-relaxed">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: displayedContent }}
          />
          {contentTooLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 text-xs font-semibold hover:underline mt-1"
            >
              {expanded ? "Less" : "More"}
            </button>
          )}
        </div>
      )}

      {/* IMAGES */}
      {/* (unchanged image code) */}
      <div className="flex flex-col gap-2">
        {/* 1 IMAGE */}
        {images.length === 1 && (
          <div className="relative w-full h-auto">
            <Image
              src={images[0].url}
              alt={`Post image`}
              width={800}
              height={450}
              className="w-full h-auto object-cover rounded-xl cursor-pointer"
              onClick={() => handleOpen(0)}
            />
          </div>
        )}

        {/* 2 IMAGES */}
        {images.length === 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.map((img: { url: string }, idx: number) => (
              <div key={idx} className="relative w-full h-60">
                <Image
                  src={img.url}
                  alt={`Post image ${idx + 1}`}
                  fill
                  className="object-cover rounded-xl cursor-pointer"
                  onClick={() => handleOpen(idx)}
                />
              </div>
            ))}
          </div>
        )}

        {/* 3+ IMAGES */}
        {images.length > 2 && (
          <div className="grid grid-cols-2 gap-2">
            {images.slice(0, 2).map((img: { url: string }, idx: number) => (
              <div key={idx} className="relative w-full h-auto">
                <Image
                  src={img.url}
                  alt={`Post image ${idx + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover rounded-xl cursor-pointer"
                  onClick={() => handleOpen(idx)}
                />
                {idx === 1 && remaining > 0 && (
                  <div
                    className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl cursor-pointer"
                    onClick={() => handleOpen(idx)}
                  >
                    <span className="text-white text-3xl font-bold">
                      +{remaining}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-between items-center px-4 py-3 border-t text-sm text-gray-600">
        <div className="flex items-center gap-4">
{/* UPVOTES */}
<div
  className="flex items-center bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 transition"
  title="Upvote / Downvote"
>
  {/* Upvote */}
  <div
    onClick={() => handleVote(1)}
    className="mr-2 cursor-pointer"
    title="Upvote"
  >
    <ArrowBigUp size={22} />
  </div>

  <span className="text-gray-800 font-semibold text-base mr-1">
    {upvotes ?? 0} Upvotes
  </span>

  <span className="text-gray-400 mx-1">•</span>

  <span className="text-gray-700 font-medium mr-3">{upvotes}</span>

  <span className="text-gray-300 mx-1">|</span>

  {/* Downvote */}
  <div
    onClick={() => handleVote(-1)}
    className="flex items-center ml-3 cursor-pointer"
    title="Downvote"
  >
    <ArrowBigDown size={22} />
    <span className="ml-1 text-gray-700 font-medium">{downvotes ?? 0}</span>
  </div>
</div>
          {/* COMMENT ICON WITH COUNT */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
            onClick={handleToggleComments} // 👈 new logic
            title={`View comments (${commentCount})`}
          >
            <MessageCircle size={20} />
            <span className="text-gray-700 text-sm font-medium">
              {commentCount}
            </span>
          </div>
        </div>

        {/* SHARE + MENU (unchanged) */}
        {/* ... */}
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <PostComments
          postId={post.id}
          isAuthenticated={isAuthenticated} // 👈 pass auth down
          onNewComment={() => setCommentCount((prev: number) => prev + 1)}
        />
      )}

      {/* ==== MODAL / LIGHTBOX ==== */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={handleClose}
          >
            ✕
          </button>

          <Image
            src={images[activeIndex].url}
            alt={`Post image large`}
            width={1000}
            height={700}
            className="max-h-[90vh] w-auto object-contain rounded-xl"
          />

          <div className="flex gap-2 mt-4 overflow-x-auto max-w-[90vw]">
            {images.map((img: any, idx: number) => (
              <Image
                key={idx}
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                width={100}
                height={100}
                className={`h-20 w-20 object-cover rounded-xl cursor-pointer border ${
                  activeIndex === idx ? "border-white" : "border-transparent"
                }`}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
