import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();
// Carrega e sanitiza a chave de criptografia do arquivo .env, removendo possíveis aspas e espaços
let SECRET_KEY = process.env.SECRET_KEY || "";
SECRET_KEY = SECRET_KEY.trim().replace(/^"|"$/g, "");

async function getUserId(request: Request): Promise<number | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  const token = match ? match[1] : null;
  if (!token) return null;
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET!
    ) as JwtPayload;
    return payload.userId as number;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const encryptedTransactions = transactions.map((transaction) => {
      const encryptedValue = CryptoJS.AES.encrypt(
        transaction.valor.toString(),
        SECRET_KEY
      ).toString();
      return {
        ...transaction,
        valor: encryptedValue,
      };
    });

    return NextResponse.json({ transactions: encryptedTransactions });
  } catch {
    return NextResponse.json(
      { message: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!SECRET_KEY) {
      return NextResponse.json(
        { message: "Erro interno: chave de criptografia não configurada." },
        { status: 500 }
      );
    }

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const encryptedStr = typeof payload === "string" ? payload : payload.data;
    const decryptedString = CryptoJS.AES.decrypt(
      encryptedStr,
      SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      return NextResponse.json(
        { message: "Dados descriptografados estão vazios ou inválidos." },
        { status: 400 }
      );
    }

    const decryptedData = JSON.parse(decryptedString);
    const { tipo, descricao, valor } = decryptedData;
    if (!tipo || !descricao || !valor || isNaN(Number(valor))) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: { tipo, descricao, valor, userId },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
