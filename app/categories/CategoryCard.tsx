"use client";

import { Category } from "@prisma/client";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer w-full max-w-xs mx-auto">
      {/* Top half: smaller image */}
      <div className="h-28 w-full">
        <img
          src={category.imageUrl ?? "/default-logo.png"}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom half: name + description */}
      <div className="p-3">
        <h2 className="text-base font-semibold capitalize mb-1 truncate">{category.name}</h2>
        <p className="text-xs text-gray-600 line-clamp-2">
          {category.description ?? "No description available."}
        </p>
      </div>
    </div>
  );
}
