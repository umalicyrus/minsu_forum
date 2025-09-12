"use client";
import Image from "next/image";
import { useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  MoreVertical,
  X,
  MoreHorizontal,
} from "lucide-react";
import PostComments from "./PostComments"; // ✅ added

export default function PostCard({ post }: { post: any }) {
  // ✅ state for upvotes/downvotes
  const [upvotes, setUpvotes] = useState(post.upvotes ?? 0);
  const [downvotes, setDownvotes] = useState(post.downvotes ?? 0);

  // ✅ voting function
  async function handleVote(value: number) {
    try {
      const res = await fetch(`/api/posts/${post.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    } catch (err) {
      console.error(err);
    }
  }

  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const contentLimit = 150; // chars before showing "More"
  const contentTooLong = post.content?.length > contentLimit;
  const displayedContent =
    !expanded && contentTooLong
      ? post.content.slice(0, contentLimit) + "..."
      : post.content;

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
          <p>{displayedContent}</p>
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

      {/* IMAGES (multiple full width) */}
      {post.images?.length > 0 && (
        <div className="flex flex-col gap-2">
          {post.images.map((img: any, idx: number) => (
            <div key={idx} className="relative w-full h-auto">
              <Image
                src={img.url}
                alt={`Post image ${idx + 1}`}
                width={800}
                height={450}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* INTERACTION BAR */}
      <div className="flex justify-between items-center px-4 py-3 border-t text-sm text-gray-600">
        <div className="flex items-center gap-4">
          {/* LEFT OVAL: Upvote + Downvote */}
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 hover:bg-gray-100 transition">
            {/* Up Arrow Icon with click */}
            <ArrowBigUp
              onClick={() => handleVote(1)}
              className="text-500 mr-2 cursor-pointer"
              size={22}
            />
            {/* Text Upvotes slightly larger */}
            <span className="text-gray-800 font-semibold text-base mr-1">
              Upvotes
            </span>
            {/* Dot */}
            <span className="text-gray-400 mx-1">•</span>
            {/* Count */}
            <span className="text-gray-700 font-medium mr-3">{upvotes}</span>
            {/* Separator */}
            <span className="text-gray-300 mx-1">|</span>
            {/* Down Arrow Icon with click */}
            <ArrowBigDown
              onClick={() => handleVote(-1)}
              className="text-500 ml-3 cursor-pointer"
              size={22}
            />
          </div>

          {/* Comment icon only */}
          <MessageCircle size={20} className="cursor-pointer" />

          {/* Share button (kept as is) */}
          <button
            onClick={() =>
              navigator.clipboard.writeText(`/posts/${post.id}`)
            }
          >
            Share
          </button>

          {/* Share icon only */}
          <button className="hover:text-blue-500">
            <Share2 size={20} />
          </button>
        </div>

        {/* HORIZONTAL 3 DOT MENU */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal size={20} />
          </button>

          {menuOpen && (
            <div
              className="
                absolute 
                right-0 
                bottom-full 
                mb-2 
                w-48 
                bg-white 
                rounded-xl 
                shadow-lg 
                ring-1 ring-gray-200 
                z-10
              "
            >
              {[
                "Copy link",
                "Not interested in this",
                "Bookmark",
                "Log",
                "Report",
              ].map((item) => (
                <button
                  key={item}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ COMMENTS SECTION directly below your interaction bar */}
      <PostComments postId={post.id} />
    </div>
  );
}
