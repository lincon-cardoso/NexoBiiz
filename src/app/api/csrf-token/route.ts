import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET() {
  const csrfToken = randomBytes(16).toString("hex");
  const res = NextResponse.json({ csrfToken });
  res.cookies.set("csrfToken", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });
  return res;
}
