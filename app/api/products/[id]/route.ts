import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET product by id
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 await here
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  return NextResponse.json(product);
}

// UPDATE product
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await req.json();

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE product
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Product deleted" });
}
