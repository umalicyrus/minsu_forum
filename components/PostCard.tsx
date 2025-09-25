// PostCard.tsx
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageCircle,
  Share2,
  X,
  MoreHorizontal,
} from "lucide-react";
import PostComments from "./PostComments";
import { toast } from "@/hooks/use-toast";

type PostCardProps = {
  post: any;
  isAuthenticated?: boolean;
  currentUserId?: string;
  isFollowing?: boolean;
  onFollowToggle?: (userId: string, nowFollowing: boolean) => void;
};

export default function PostCard({
  post,
  isAuthenticated = false,
  currentUserId,
  isFollowing: propFollowing,
  onFollowToggle,
}: PostCardProps) {
  // Votes
  const [upvotes, setUpvotes] = useState<number | null>(null);
  const [downvotes, setDownvotes] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  // Comments
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(
    post.commentCount ?? 0
  );

  // Author / Follow
  const authorId = post.user?.id?.toString();
  // localFollowing prefers explicit prop, then backend field on post, then false
  const [localFollowing, setLocalFollowing] = useState<boolean>(
    propFollowing ?? post.user?.isFollowing ?? false
  );
  // Dropdown for confirming unfollow
  const [showDropdown, setShowDropdown] = useState(false);

  // Menu (share / more)
  const [showMenu, setShowMenu] = useState(false);

  // Lightbox
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Derived
  const images = post.images ?? [];
  const remaining = images.length > 2 ? images.length - 2 : 0;
  const contentLimit = 150;
  const contentTooLong = post.content?.length > contentLimit;
  const displayedContent =
    !expanded && contentTooLong
      ? post.content.slice(0, contentLimit) + "..."
      : post.content;

  // hide follow button if user not logged in or looking at own post
  const showFollowButton =
    isAuthenticated && currentUserId && currentUserId !== authorId;

  // sync votes
  useEffect(() => {
    if (post.votes) {
      setUpvotes(post.votes.filter((v: any) => v.value === 1).length);
      setDownvotes(post.votes.filter((v: any) => v.value === -1).length);
    } else {
      setUpvotes(null);
      setDownvotes(null);
    }
  }, [post.votes]);

  // keep localFollowing in sync if parent prop or post metadata changes
  useEffect(() => {
    setLocalFollowing(propFollowing ?? post.user?.isFollowing ?? false);
  }, [propFollowing, post.user?.isFollowing]);

  // Voting
  async function handleVote(value: number) {
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
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    } catch (err) {
      console.error(err);
    }
  }

  // Follow (merge of your two snippets)
  // - If not following -> POST and auto-switch
  // - If already following -> toggle dropdown (confirm unfollow)
  async function handleFollowToggle() {
    if (!isAuthenticated) {
      toast({
        title: "🔒 Login Required",
        description: "You need to be logged in to follow.",
        variant: "destructive",
      });
      
      return;
    }

    // If not following, follow immediately
    if (!localFollowing) {
      try {
        const res = await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ followingId: Number(post.user.id) }),
        });

        const errBody = await res.json().catch(() => null);
        if (!res.ok) {
          console.error("Follow request failed", errBody);
          toast({
            title: "Follow failed",
            description: "Could not follow user.",
            variant: "destructive",
          });
          return;
        }

        setLocalFollowing(true);
        onFollowToggle?.(authorId!, true);
      } catch (err) {
        console.error("Follow error", err);
      }
      return;
    }

    // Already following -> show/hide unfollow dropdown for confirmation
    setShowDropdown((s) => !s);
  }

  async function handleUnfollow() {
    try {
      const res = await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: Number(post.user.id) }),
      });

      const errBody = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("Unfollow failed", errBody);
        toast({
          title: "Unfollow failed",
          description: "Could not unfollow user.",
          variant: "destructive",
        });
        return;
      }

      setLocalFollowing(false);
      setShowDropdown(false);
      onFollowToggle?.(authorId!, false);
    } catch (err) {
      console.error("Unfollow error", err);
    }
  }

  // Comments: allow viewing regardless; require login to post
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

  // Share
  async function handleShare() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : undefined;
    const url = origin ? `${origin}/posts/${post.id}` : `/posts/${post.id}`;

    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({
          title: post.title,
          text:
            (post.content && post.content.replace(/<[^>]+>/g, "")?.slice(0, 120)) ||
            "",
          url,
        });
      } catch (err) {
        // user probably cancelled
      }
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Post URL copied to clipboard.",
        });
      } catch (err) {
        console.error("Clipboard error", err);
      }
    } else {
      // fallback
      toast({
        title: "Can't share",
        description: "Sharing is not available in this environment.",
        variant: "destructive",
      });
    }
  }

  // Lightbox handlers
  const handleOpen = (idx: number) => {
    setActiveIndex(idx);
    setIsOpen(true);
  };
  const handleClose = () => setIsOpen(false);

  // Simple placeholders for menu actions (non-destructive; you can wire these up)
  function handleReport() {
    setShowMenu(false);
    toast({ title: "Reported", description: "Thanks — we'll review this post." });
  }
  function handleEdit() {
    setShowMenu(false);
    toast({ title: "Edit", description: "Open edit UI (implement in parent)." });
  }
  async function handleDelete() {
    setShowMenu(false);
    if (!isAuthenticated || currentUserId !== authorId) {
      toast({
        title: "Not allowed",
        description: "You can only delete your own posts.",
        variant: "destructive",
      });
      return;
    }
    // Example delete call (optional)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) {
        toast({ title: "Delete failed", variant: "destructive" });
        return;
      }
      toast({ title: "Deleted", description: "Post deleted." });
    } catch (err) {
      console.error(err);
    }
  }

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

          {/* Author name + small meta (optional) */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {post.user?.name ?? "Unknown"}
            </span>
            {post.createdAt && (
              <span className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </span>
            )}
          </div>

          {/* FOLLOW BUTTON */}
          {showFollowButton && (
            <div className="relative ml-3">
              {localFollowing ? (
                <div className="relative inline-block">
                  <button
                    onClick={handleFollowToggle}
                    className="text-blue-600 font-bold hover:underline px-2 py-1 rounded"
                    aria-expanded={showDropdown}
                    aria-controls={`unfollow-dropdown-${post.id}`}
                  >
                    Following
                  </button>

                  {showDropdown && (
                    <div
                      id={`unfollow-dropdown-${post.id}`}
                      className="absolute left-0 top-full mt-2 bg-white border rounded shadow-lg z-20 min-w-[140px]"
                    >
                      <button
                        onClick={handleUnfollow}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Unfollow
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className="text-blue-600 font-bold hover:underline px-2 py-1 rounded"
                >
                  Follow
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hide (X) + small actions */}
        <div className="flex items-center gap-2">
          <button
            title="Hide"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
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
      <div className="flex flex-col gap-2 px-4">
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
              Upvotes
            </span>

            <span className="text-gray-400 mx-1">•</span>

            <span className="text-gray-700 font-medium mr-3">
              {upvotes ?? 0}
            </span>

            <span className="text-gray-300 mx-1">|</span>

            {/* Downvote */}
            <div
              onClick={() => handleVote(-1)}
              className="flex items-center ml-3 cursor-pointer"
              title="Downvote"
            >
              <ArrowBigDown size={22} />
              <span className="ml-1 text-gray-700 font-medium">
                {downvotes ?? 0}
              </span>
            </div>
          </div>

          {/* COMMENT ICON WITH COUNT */}
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-blue-600"
            onClick={handleToggleComments}
            title={`View comments (${commentCount})`}
          >
            <MessageCircle size={20} />
            <span className="text-gray-700 text-sm font-medium">
              {commentCount}
            </span>
          </div>
        </div>

        {/* SHARE + MENU */}
        <div className="flex items-center gap-3">
          <button
            title="Share"
            onClick={handleShare}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50"
          >
            <Share2 size={18} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMenu((s) => !s)}
              className="p-1 rounded hover:bg-gray-50"
              title="More"
            >
              <MoreHorizontal size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg z-30 min-w-[160px]">
                {currentUserId === authorId ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleReport}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <PostComments
          postId={post.id}
          isAuthenticated={isAuthenticated}
          onNewComment={() => setCommentCount((prev: number) => prev + 1)}
        />
      )}

      {/* ==== MODAL / LIGHTBOX ==== */}
      {isOpen && images[activeIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center px-4">
          <button
            className="absolute top-5 right-5 text-white text-3xl"
            onClick={handleClose}
          >
            ✕
          </button>

          <div className="max-h-[90vh]">
            <Image
              src={images[activeIndex].url}
              alt={`Post image large`}
              width={1000}
              height={700}
              className="max-h-[90vh] w-auto object-contain rounded-xl"
            />
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto max-w-[90vw]">
            {images.map((img: any, idx: number) => (
              <div key={idx} className="flex-shrink-0">
                <Image
                  src={img.url}
                  alt={`Thumbnail ${idx + 1}`}
                  width={100}
                  height={100}
                  className={`h-20 w-20 object-cover rounded-xl cursor-pointer border ${
                    activeIndex === idx ? "border-white" : "border-transparent"
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
