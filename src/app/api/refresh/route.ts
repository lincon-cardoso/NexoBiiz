import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  // Pegar token de refresh do cookie
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/refreshToken=([^;]+)/);
  if (!match) {
    return NextResponse.json(
      { message: "Refresh token não fornecido." },
      { status: 401 }
    );
  }
  const refreshToken = match[1];
  try {
    // Verificar refresh token
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { userId: string };
    const userId = payload.userId;

    // Gerar novo access token
    const newAccessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );
    // Retornar cookie HttpOnly com novo accessToken
    const res = NextResponse.json({ user: { userId } }, { status: 200 });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutos
    });
    return res;
  } catch (err) {
    console.error("Refresh token inválido:", err);
    return NextResponse.json(
      { message: "Refresh token inválido." },
      { status: 401 }
    );
  }
}
