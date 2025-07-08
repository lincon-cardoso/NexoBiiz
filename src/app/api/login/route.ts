import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { errorMessages } from "@/constants/errorMessages";

function generateCSRFToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function validateCSRF(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/csrf-token=([^;]+)/);
  const validToken = match ? match[1] : undefined;
  // Removendo logs de depuração
  if (!csrfToken || csrfToken !== validToken) {
    return NextResponse.json(
      {
        error: errorMessages.INVALID_INPUT,
        detail: "CSRF token ausente ou inválido.",
      },
      { status: 403 }
    );
  }
  return null;
}

export async function GET(request: Request) {
  // Só gera o token CSRF se não existir
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/csrf-token=([^;]+)/);
  const existingToken = match ? match[1] : undefined;
  if (existingToken) {
    return new NextResponse(null, { status: 204 });
  }
  const csrfToken = generateCSRFToken();
  const response = new NextResponse(null, { status: 204 });
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: false, // Permite leitura no JS
    sameSite: "lax", // Mais permissivo para SPA
    path: "/",
    maxAge: 60 * 60,
  });
  return response;
}

export async function POST(request: Request) {
  const csrfError = validateCSRF(request);
  if (csrfError) return csrfError;

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

    const response = NextResponse.json({ message: "Login bem-sucedido" });
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
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
