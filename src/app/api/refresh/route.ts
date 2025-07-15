import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

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

    // Verificar se o refresh token está na base de dados
    const tokenRecord = await prisma.token.findUnique({
      where: { token: refreshToken },
    });
    if (!tokenRecord) {
      return NextResponse.json(
        { message: "Refresh token inválido." },
        { status: 401 }
      );
    }

    // Gerar novo access token
    const newAccessToken = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );
    // Gerar novo refresh token
    const newRefreshToken = jwt.sign(
      { userId, nonce: uuidv4() },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    // Atualizar refresh token na base de dados
    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { token: newRefreshToken, createdAt: new Date() },
    });

    // Retornar cookies HttpOnly com novo accessToken e refreshToken
    const res = NextResponse.json({ user: { userId } }, { status: 200 });
    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutos
    });
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
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
