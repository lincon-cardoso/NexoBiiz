import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { transactionRateLimiter } from "@/middleware/rateLimiter";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import { csrfValidator } from "@/middleware/csrfValidator";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || ""; // Certifique-se de definir SECRET_KEY no arquivo .env

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
  transactionRateLimiter(
    request as unknown as NextApiRequest,
    {} as NextApiResponse,
    () => {}
  );
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ transactions });
}

export async function POST(request: Request) {
  transactionRateLimiter(
    request as unknown as NextApiRequest,
    {} as NextApiResponse,
    () => {}
  );
  csrfValidator(
    request as unknown as NextApiRequest,
    {} as NextApiResponse,
    () => {}
  );
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const encryptedData = await request.json();
    const decryptedData = JSON.parse(
      CryptoJS.AES.decrypt(encryptedData, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      )
    );
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
      { message: "Error creating transaction" },
      { status: 500 }
    );
  }
}
