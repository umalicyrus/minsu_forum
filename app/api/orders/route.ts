import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth"; // if using next-auth

// GET /api/orders -> Get all orders of the logged-in user
export async function GET() {
  try {
    // 1. Check session
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Fetch user’s orders with product details
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        product: true, // includes product info in response
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
