import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { errorMessages } from "@/constants/errorMessages";

interface JwtPayload {
  userId: number;
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  const token = match ? match[1] : null;

  if (!token) {
    return NextResponse.json(
      { message: errorMessages.AUTHENTICATION_ERROR },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: errorMessages.USER_LOAD_ERROR },
        { status: 404 }
      );
    }

    const dashboardData = {
      message: "Dashboard carregado com sucesso!",
      data: {
        totalUsers: 42,
        totalCompanies: 7,
        lastLogin: new Date().toISOString(),
      },
      userId: decoded.userId,
      userName: user.name,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return NextResponse.json(
      { message: errorMessages.INVALID_CREDENTIALS },
      { status: 401 }
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.warn("Acesso livre no ambiente de desenvolvimento.");
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
