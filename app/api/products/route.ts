// app/api/products/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// ✅ GET products for logged-in user only
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("Fetch Products Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ POST new product for logged-in user
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = payload.id;

    const body = await req.json();
    const { name, description, price, stock, categoryId } = body;

    if (!name || !description || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: String(name),
        description: String(description),
        price: Number(price),
        stock: Number(stock),
        sellerId: Number(userId), // 👈 secure: from token
        categoryId: Number(categoryId),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Create Product Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
