import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, code } = await request.json();
    const mfaRecord = await prisma.mFA.findFirst({ where: { userId, code } });
    if (!mfaRecord) {
      return NextResponse.json(
        { message: "Código MFA inválido." },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "MFA verificado com sucesso." });
  } catch (error) {
    console.error("Erro na verificação MFA:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
