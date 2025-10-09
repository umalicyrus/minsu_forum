import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminCategories from "./AdminCategories";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  // Get Next.js headers and convert them into a plain object
  const incomingHeaders = Object.fromEntries((await headers()).entries());

  const req = new Request("http://localhost", {
    headers: incomingHeaders,
  });

  const user = await getUserFromRequest(req);

  if (!user || user.role !== "ADMIN") {
    redirect("/not-authorized"); // or a custom /403
  }

  const categories = await prisma.category.findMany({
    orderBy: { id: "desc" },
  });

  return <AdminCategories existingCategories={categories} />;
}
