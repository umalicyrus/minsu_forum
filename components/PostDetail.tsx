// // components/PostDetail.tsx
// "use client";

// import { useState } from "react";
// import PostForm from "./PostForm";
// import VoteButtons from "./VoteButtons";
// import Comments from "./Comments";
// export default function PostDetail({ post }: { post: any }) {
//   const [editing, setEditing] = useState(false);
//   const [currentPost, setCurrentPost] = useState(post);

//   async function handleDelete() {
//     if (!confirm("Are you sure you want to delete this post?")) return;

//     const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
//     if (res.ok) window.location.href = "/";
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow rounded-2xl p-6 space-y-6 mt-6">
//       {editing ? (
//         <PostForm
//           post={currentPost}
//           onSave={(updated: any) => {
//             setCurrentPost(updated);
//             setEditing(false);
//           }}
//           onCancel={() => setEditing(false)}
//         />
//       ) : (
//         <>
//           <h1 className="text-2xl font-bold">{currentPost.title}</h1>
//           <p className="text-gray-600">{currentPost.content}</p>

//           {currentPost.images?.length > 0 && (
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               {currentPost.images.map((img: any) => (
//                 <img
//                   key={img.id}
//                   src={img.url}
//                   alt=""
//                   className="rounded-lg border"
//                 />
//               ))}
//             </div>
//           )}

//           <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
//             <span>👤 {currentPost.user?.name}</span>
//             <span>📂 {currentPost.group?.name ?? "Public"}</span>
//           </div>

//           {/* 🟩 Votes */}
//           <VoteButtons
//             postId={currentPost.id}
//             votes={currentPost.votes}
//           />

//           {/* Buttons */}
//           <div className="flex gap-4 mt-6">
//             <button
//               onClick={() => setEditing(true)}
//               className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
//             >
//               Edit
//             </button>
//             <button
//               onClick={handleDelete}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//             >
//               Delete
//             </button>
//           </div>

//           {/* 🟩 Comments */}
//           <Comments
//             postId={currentPost.id}
//             comments={currentPost.comments}
//           />
//         </>
//       )}
//     </div>
//   );
// }
