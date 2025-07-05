import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logout realizado com sucesso" });
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
