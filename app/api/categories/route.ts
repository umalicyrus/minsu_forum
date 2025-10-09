import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/auth";
import { error } from "console";

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    console.log("Authenticated user:", user);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || null;
    const file = formData.get("image") as File | null;

    console.log("Received:", { name, description, hasFile: !!file });

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name required" }, { status: 400 });
    }

    const normalizedName = name.trim().toLowerCase();

    const existing = await prisma.category.findFirst({
      where: { name: normalizedName },
    });

    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    let filePath: string | null = null;
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      await writeFile(path.join(uploadDir, fileName), buffer);
      filePath = `/uploads/${fileName}`;
      console.log("File saved at:", filePath);
    }

    const category = await prisma.category.create({
      data: {
        name: normalizedName,
        description: description?.trim() || null,
        imageUrl: filePath,
      },
    });

    console.log("Saved category:", category);

    return NextResponse.json(category, { status: 201 });
  } catch (err: any) {
    console.error("Error creating category:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: {id: "desc" }});
    return NextResponse.json(categories);
  } catch (err: any) {
    console.error("❌ GET Error:", err);
    return NextResponse.json({ error: "Fieled to fetch categories" }, {status: 500 });
  }
}
