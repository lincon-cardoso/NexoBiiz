import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { transactionRateLimiter } from "@/middleware/rateLimiter";
import dotenv from "dotenv";
import CryptoJS from "crypto-js";
import { csrfValidator } from "@/middleware/csrfValidator";

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
  transactionRateLimiter(
    request as unknown as NextApiRequest,
    {} as NextApiResponse,
    () => {}
  );
  const userId = await getUserId(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { message: "Nenhuma transação encontrada." },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return NextResponse.json(
      { message: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!SECRET_KEY) {
    console.error(
      "SECRET_KEY não está definida. Certifique-se de que o arquivo .env está configurado corretamente e sendo carregado."
    );
    return NextResponse.json(
      { message: "Erro interno: chave de criptografia não configurada." },
      { status: 500 }
    );
  }

  transactionRateLimiter(
    request as unknown as NextApiRequest,
    {} as NextApiResponse,
    () => {}
  );

  csrfValidator(request as unknown as NextRequest);

  console.log("Iniciando validação de usuário...");
  const userId = await getUserId(request);
  console.log("ID do usuário:", userId);

  if (!userId) {
    console.error("Usuário não autorizado.");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Recebendo dados da requisição...");
    const payload = await request.json();
    const encryptedStr = typeof payload === "string" ? payload : payload.data;
    console.log("Dados criptografados recebidos:", encryptedStr);

    console.log("SECRET_KEY utilizada para descriptografia:", SECRET_KEY);

    try {
      console.log("Descriptografando dados...");
      const decryptedString = CryptoJS.AES.decrypt(
        encryptedStr,
        SECRET_KEY
      ).toString(CryptoJS.enc.Utf8);
      console.log("Dados descriptografados como string:", decryptedString);

      if (!decryptedString) {
        console.error(
          "Erro: Dados descriptografados estão vazios ou inválidos."
        );
        return NextResponse.json(
          { message: "Dados descriptografados estão vazios ou inválidos." },
          { status: 400 }
        );
      }

      const decryptedData = JSON.parse(decryptedString);
      console.log("Dados descriptografados como JSON:", decryptedData);

      const { tipo, descricao, valor } = decryptedData;
      if (!tipo || !descricao || !valor || isNaN(Number(valor))) {
        console.error("Dados inválidos:", decryptedData);
        return NextResponse.json(
          { message: "Dados inválidos" },
          { status: 400 }
        );
      }

      console.log("Criando transação no banco de dados...");
      const transaction = await prisma.transaction.create({
        data: { tipo, descricao, valor, userId },
      });
      console.log("Transação criada com sucesso:", transaction);

      return NextResponse.json({ transaction }, { status: 201 });
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return NextResponse.json(
        { message: "Erro ao criar transação" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { message: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}
