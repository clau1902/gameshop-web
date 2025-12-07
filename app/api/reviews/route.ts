import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/db";
import { reviews } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq, desc, and } from "drizzle-orm";

// GET - Fetch reviews for a game
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get("gameId");

  if (!gameId) {
    return NextResponse.json({ error: "gameId is required" }, { status: 400 });
  }

  try {
    const gameReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.gameId, gameId))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ reviews: gameReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { gameId, rating, title, content } = body;

    if (!gameId || !rating || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    // Check if user already reviewed this game
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, session.user.id), eq(reviews.gameId, gameId)))
      .limit(1);

    if (existingReview.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this game" }, { status: 400 });
    }

    const now = new Date();
    const reviewId = crypto.randomUUID();

    await db.insert(reviews).values({
      id: reviewId,
      userId: session.user.id,
      userName: session.user.name || "Anonymous",
      gameId,
      rating,
      title,
      content,
      helpful: 0,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({ 
      success: true, 
      review: {
        id: reviewId,
        userId: session.user.id,
        userName: session.user.name,
        gameId,
        rating,
        title,
        content,
        helpful: 0,
        createdAt: now,
        updatedAt: now,
      }
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required" }, { status: 400 });
    }

    // Verify the review belongs to the user
    const review = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.userId, session.user.id)))
      .limit(1);

    if (review.length === 0) {
      return NextResponse.json({ error: "Review not found or not authorized" }, { status: 404 });
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

