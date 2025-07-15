import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await argon2.verify(user.password, password))) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    const refreshTokenId = uuidv4();
    await prisma.token.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        token: refreshToken,
        createdAt: new Date(),
      },
    });

    // Registrar sessão de login
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("remote-address") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";
    await prisma.session.create({
      data: { userId: user.id, ip, userAgent, createdAt: new Date() },
    });

    const response = NextResponse.json({
      message: "Login bem-sucedido",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        cnpj: user.cnpj,
      },
    });
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
