"use client";

import { Category } from "@prisma/client";
import { Plus } from "lucide-react";

interface CategoryHeaderProps {
  category: {
    id: number;
    name: string;
    description: string | null;
    imageUrl: string | null;
    _count: { members: number };
  };
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-start gap-4 mb-8">
      {/* Logo */}
      <img
        src={category.imageUrl ?? "/default-logo.png"}
        alt={category.name}
        className="w-20 h-20 rounded-md object-cover"
      />

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-xl font-bold capitalize">{category.name}</h1>
        <p className="text-gray-600 text-sm mb-2">
          {category.description ?? "No description available."}
        </p>

        {/* Members oval */}
        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
          <Plus size={14} />
          {category._count.members} joined
        </div>
      </div>
    </div>
  );
}
