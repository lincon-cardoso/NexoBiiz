import { NextResponse } from "next/server";
import { redis } from "@/lib/redisClient";

export async function GET() {
  try {
    const pong = await redis.ping();
    return NextResponse.json({ pong });
  } catch (error) {
    console.error("Redis ping error:", error);
    return NextResponse.json(
      { error: "Redis error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
