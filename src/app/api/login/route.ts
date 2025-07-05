import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { rateLimit } from "@/lib/rateLimit";
import { redis } from "@/lib/redisClient";

// prisma singleton import acima replaces new PrismaClient()

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export async function POST(request: Request) {
  try {
    // Rate limit per IP
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await rateLimit(`login:${ip}`);

    const data = await request.json();
    const { email, password } = loginSchema.parse(data);

    // Verificar usuário e comparar senha (dummy hash para timing attacks)
    const user = await prisma.user.findUnique({ where: { email } });
    const storedHash = user
      ? user.password
      : await argon2.hash("invalid-password");
    const isValid = await argon2.verify(storedHash, password);
    if (!isValid || !user) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Limpar contador de rate limit em Redis após sucesso
    const userIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    await redis.del(`login:${userIp}`);

    // Autenticação bem-sucedida: gerar tokens
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );
    // Enviar accessToken e refreshToken em cookies HttpOnly
    const res = NextResponse.json({ user: { id: user.id } }, { status: 200 });
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutos
    });
    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    // Adicionar headers de segurança na resposta
    res.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; object-src 'none'"
    );
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-Content-Type-Options", "nosniff");

    return res;
  } catch (error) {
    // Tratamento de rate limit do Redis
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json(
        { message: "Muitas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos.", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Erro no login:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
