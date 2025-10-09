"use client";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface AdminCategoriesProps {
  existingCategories: Category[];
}

export default function AdminCategories({ existingCategories }: AdminCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>(existingCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ✅ Refresh categories
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  // ✅ Create / Update
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (file) formData.append("image", file);

    let res;
    if (editingId) {
      res = await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });
    }

    if (res.ok) {
      await fetchCategories();
      resetForm();
    } else {
      const err = await res.json();
      alert(err.error || "Something went wrong");
    }
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchCategories();
    } else {
      const err = await res.json();
      alert(err.error || "Delete failed");
    }
  };

  // ✅ Edit
  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setFile(null);
  };

  // ✅ Reset
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Manage Categories</h1>

      {/* FORM */}
      <div className="border p-4 rounded mb-6">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Short description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 mb-2 w-full"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {editingId ? "Update Category" : "Create Category"}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <ul>
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={c.imageUrl || "/placeholder.png"}
                alt={c.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <p className="font-medium">{c.name}</p>
                {c.description && (
                  <p className="text-sm text-gray-500">{c.description}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(c)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
