import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic"; // ✅ ensure Next.js detects methods

async function saveFile(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await writeFile(path.join(uploadDir, fileName), buffer);
  return `/uploads/${fileName}`;
}

// ✅ UPDATE
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const file = formData.get("image") as File | null;

    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    let filePath = category.imageUrl;
    if (file) {
      if (filePath) {
        try {
          await unlink(path.join(process.cwd(), "public", filePath));
        } catch {}
      }
      filePath = await saveFile(file);
    }

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name: name ? name.trim().toLowerCase() : category.name,
        description: description?.trim() || category.description,
        imageUrl: filePath,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("❌ PUT Error:", err);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; // ✅ await params
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const category = await prisma.category.findUnique({ where: { id: Number(id) } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.imageUrl) {
      try {
        await unlink(path.join(process.cwd(), "public", category.imageUrl));
      } catch {}
    }

    await prisma.category.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    console.error("❌ DELETE Error:", err);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
