// // components/PostForm.tsx
// "use client";

// import { useState } from "react";

// export default function PostForm({
//   post,
//   onSave,
//   onCancel,
// }: {
//   post: any;
//   onSave: (updated: any) => void;
//   onCancel: () => void;
// }) {
//   const [title, setTitle] = useState(post.title);
//   const [content, setContent] = useState(post.content);
//   const [visibility, setVisibility] = useState(post.visibility || "public");
//   const [images, setImages] = useState(post.images?.map((i: any) => i.url) || []);

//   async function handleSubmit(e: any) {
//     e.preventDefault();
//     const res = await fetch(`/api/posts/${post.id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ title, content, visibility, images }),
//     });
//     const updated = await res.json();
//     if (!updated.error) onSave(updated);
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Title</label>
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border rounded-lg p-2"
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Content</label>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           className="w-full border rounded-lg p-2"
//           rows={4}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Visibility</label>
//         <select
//           value={visibility}
//           onChange={(e) => setVisibility(e.target.value)}
//           className="w-full border rounded-lg p-2"
//         >
//           <option value="public">Public</option>
//           <option value="group">Group Only</option>
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Image URLs (comma separated)</label>
//         <input
//           value={images.join(",")}
//           onChange={(e) => setImages(e.target.value.split(","))}
//           className="w-full border rounded-lg p-2"
//         />
//       </div>

//       <div className="flex gap-4">
//         <button
//           type="submit"
//           className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
//         >
//           Save
//         </button>
//         <button
//           type="button"
//           onClick={onCancel}
//           className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// }
