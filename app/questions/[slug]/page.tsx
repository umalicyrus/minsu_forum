// app/questions/[slug]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import QuestionClient from "./QuestionClient";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Types for server-side shaping (not sent directly as Dates)
type AnswerFromDb = {
  id: number;
   role?: string;
  content: string;
  createdAt: Date;
  user?: { id?: number; name?: string; image?: string | null } | null;
};

type QuestionFromDb = {
  id: number;
  title: string;
  content?: string | null;
  anonymous?: boolean | null;
  createdAt: Date;
  user?: { id?: number; name?: string; image?: string | null } | null;
  category?: {
    name: string;
    imageUrl?: string | null;
    description?: string | null;
  } | null;
  answer: AnswerFromDb[];
};

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;
  const currentUser = token ? verifyToken(token) : null;

  const questionFromDb = await prisma.question.findUnique({
    where: { slug },
    include: {
      user: { select: { id: true, name: true, image: true } },
      category: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          description: true,
        },
      },
      answer: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!questionFromDb) notFound();

  // Convert Dates to ISO strings so props are serializable
  const serializableQuestion = {
    id: questionFromDb.id,
    title: questionFromDb.title,
    content: questionFromDb.content ?? undefined,
    anonymous: questionFromDb.anonymous ?? false,
    createdAt: questionFromDb.createdAt.toISOString(),
    user: questionFromDb.user ?? undefined,
    category: questionFromDb.category
      ? {
          name: questionFromDb.category.name,
          imageUrl: questionFromDb.category.imageUrl ?? undefined,
          description: questionFromDb.category.description ?? undefined,
        }
      : undefined,
    answer: questionFromDb.answer.map((ans) => ({
      id: ans.id,
      content: ans.content,
      createdAt: ans.createdAt.toISOString(),
      user: ans.user ?? undefined,
      authorId: ans.user?.id ?? null,
    })),
  };

return (
  <QuestionClient
    question={serializableQuestion}
    currentUser={currentUser ? { id: currentUser.id } : null}
  />
);
}
