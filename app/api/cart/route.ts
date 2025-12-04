import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { cart } from "@/app/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

// Get cart items
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, session.user.id));

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { gameId, storeName, price } = await request.json();

    if (!gameId || !storeName || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if item already in cart
    const existingItem = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, session.user.id), eq(cart.gameId, gameId)))
      .limit(1);

    if (existingItem.length > 0) {
      return NextResponse.json({ error: "Item already in cart" }, { status: 400 });
    }

    const newItem = await db.insert(cart).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      gameId,
      storeName,
      price: price.toString(),
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({ item: newItem[0] });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 });
  }
}

// Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({ error: "Missing gameId" }, { status: 400 });
    }

    await db
      .delete(cart)
      .where(and(eq(cart.userId, session.user.id), eq(cart.gameId, gameId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 });
  }
}

