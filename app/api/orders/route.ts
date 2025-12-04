import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { orders, orderItems, cart } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { GAMES } from "@/app/data/games";

// Get user's orders
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, session.user.id))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Create new order (checkout)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentMethod } = await request.json();

    // Get cart items
    const cartItems = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, session.user.id));

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

    // Create order
    const orderId = crypto.randomUUID();
    const newOrder = await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      totalAmount: totalAmount.toFixed(2),
      status: "completed",
      paymentMethod: paymentMethod || "card",
      createdAt: new Date(),
    }).returning();

    // Create order items
    const orderItemsToInsert = cartItems.map((item) => {
      const game = GAMES.find((g) => g.id === item.gameId);
      return {
        id: crypto.randomUUID(),
        orderId: orderId,
        gameId: item.gameId,
        gameTitle: game?.title || "Unknown Game",
        storeName: item.storeName,
        price: item.price,
        createdAt: new Date(),
      };
    });

    await db.insert(orderItems).values(orderItemsToInsert);

    // Clear cart
    await db.delete(cart).where(eq(cart.userId, session.user.id));

    // Get the complete order with items
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    return NextResponse.json({ 
      order: { ...newOrder[0], items },
      message: "Order placed successfully!" 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

