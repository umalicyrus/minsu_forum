import CategoryCard from "./CategoryCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Explore Categories</h1>
          <p className="text-sm text-blue-100">
            Discover topics, connect with others, and explore posts & questions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.id}`}>
                <CategoryCard category={cat} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
