"use client";
import React, { useEffect, useState } from "react";

interface BrightestCategory {
  id: number;
  name: string;
  imageUrl: string | null;
  totalAnswers: number;
}

export default function BrightestSection() {
  const [categories, setCategories] = useState<BrightestCategory[]>([]);

  useEffect(() => {
    fetch("/api/answers/brightest")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((cat: BrightestCategory) => cat.totalAnswers > 0);
        setCategories(filtered);
      })
      .catch(console.error);
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="mt-4 p-4">
      <h3 className="font-semibold text-lg mb-2">Brightest at</h3>
      <hr className="border-gray-300 mb-4" />

      <div className="flex flex-col gap-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3">
            {/* Logo */}
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                {cat.name[0].toUpperCase()}
              </div>
            )}

            {/* Category Name */}
            <p className="flex-1 font-medium text-gray-800">{cat.name}</p>

            {/* Total Answers */}
            <p className="font-semibold text-gray-800">{cat.totalAnswers}</p>

            {/* Label */}
            <p className="text-gray-500 text-sm">Answer</p>
          </div>
        ))}
      </div>
    </div>
  );
}
