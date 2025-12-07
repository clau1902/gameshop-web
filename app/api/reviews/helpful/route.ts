import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { reviews } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

// POST - Mark a review as helpful
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
    }

    // Increment the helpful count
    await db
      .update(reviews)
      .set({ 
        helpful: sql`${reviews.helpful} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, reviewId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

