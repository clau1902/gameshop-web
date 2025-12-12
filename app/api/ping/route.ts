import { NextResponse } from "next/server";
// ./app/api/ping

// /api/ping

export async function GET() {
    return NextResponse.json({ message: "Pong" });
}


export async function POST() {
    return NextResponse.json({ message: "Pong by POST" });
}
