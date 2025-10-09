import prisma from "@/lib/prisma";
import CategoryHeader from "@/components/CategoryHeader";
import CategoryTabs from "@/components/CategoryTabs";

interface CategoryPageProps {
  params: { id: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = Number(params.id);

  // Fetch category + posts + questions
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: { select: { members: true } },
      posts: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      questions: {
        include: { user: true, answer: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    return <div className="p-8 text-center text-gray-500">Category not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top category info */}
      <CategoryHeader category={category} />

      {/* Tabs for posts/questions/answers/writers */}
      <CategoryTabs category={category} />
    </div>
  );
}
