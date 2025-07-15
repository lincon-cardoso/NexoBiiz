// Força execução em Node.js para permitir headers customizados
export const runtime = "nodejs";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout bem-sucedido" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    const refreshToken = request.cookies.get("refreshToken")?.value;
    if (refreshToken) {
      await prisma.token.deleteMany({ where: { token: refreshToken } });
    }

    return response;
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
