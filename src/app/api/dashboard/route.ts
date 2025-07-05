import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

interface JwtPayload {
  userId: number;
}

export async function GET(request: Request) {
  // Pega o cookie accessToken
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;
    // Buscar nome do usuário no banco
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    // Exemplo de dados fictícios para o dashboard
    const dashboardData = {
      message: "Dashboard carregado com sucesso!",
      data: {
        totalUsers: 42,
        totalCompanies: 7,
        lastLogin: new Date().toISOString(),
      },
      userId: decoded.userId,
      userName: user?.name || null,
    };
    return NextResponse.json(dashboardData);
  } catch {
    return NextResponse.json(
      { message: "Token inválido ou expirado." },
      { status: 401 }
    );
  }

  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({
      message: "Acesso livre no ambiente de desenvolvimento.",
      data: {
        totalUsers: 42,
        totalCompanies: 7,
        lastLogin: new Date().toISOString(),
      },
      userId: "dev-user",
      userName: "Dev User",
    });
  }
}
