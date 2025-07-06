import { NextResponse } from "next/server";
import { errorMessages } from "@/constants/errorMessages";

export async function POST() {
  const res = NextResponse.json({ message: errorMessages.LOGOUT_ERROR });
  // Remove accessToken e refreshToken em qualquer ambiente
  res.cookies.set("accessToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: false, // Garante remoção em localhost
  });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    secure: false,
  });
  return res;
}
