import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import argon2 from "argon2";
import { errorMessages } from "@/constants/errorMessages";

// Definir o esquema de validação com Zod (sem o campo username)
const userSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
  company: z.string().optional(),
  cnpj: z.string().length(14, "O CNPJ deve ter exatamente 14 caracteres."),
  phone: z.string().min(10, "O telefone deve ter pelo menos 10 caracteres."),
});

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    // Aplicar rate limiting usando Redis
    await rateLimit(ip);
    const data = await request.json();
    console.log("[API][register] Dados recebidos:", data);

    // Validar os dados no backend
    const parsedData = userSchema.parse(data);
    console.log("[API][register] Dados validados no backend:", parsedData);

    // Verificar se o email ou CNPJ já estão registrados
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: parsedData.email }, { cnpj: parsedData.cnpj }],
      },
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === parsedData.email ? "Email" : "CNPJ";
      return NextResponse.json(
        { message: `${conflictField} ${errorMessages.AUTHENTICATION_ERROR}` },
        { status: 409 }
      );
    }

    // Hash da senha antes de salvar (argon2)
    const hashedPassword = await argon2.hash(parsedData.password);

    // Criar o usuário no banco de dados
    try {
      const user = await prisma.user.create({
        data: {
          ...parsedData,
          password: hashedPassword, // Salvar a senha como hash
          company: parsedData.company ?? "", // Garantir que 'company' seja uma string
        },
      });
      console.log("Usuário criado:", user);

      // Registrar evento na tabela ScriptEvents
      const scriptEvent = await prisma.scriptEvents.create({
        data: {
          scriptName: "register",
          eventType: "USER_CREATED",
        },
      });
      console.log("Evento registrado:", scriptEvent);

      // Adicionar headers de segurança na resposta
      const response = NextResponse.json({
        message: "Registro bem-sucedido",
      });
      response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; object-src 'none'"
      );
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-Content-Type-Options", "nosniff");

      return response;
    } catch (prismaError) {
      console.error("Erro do Prisma ao criar usuário:", prismaError);
      return NextResponse.json(
        {
          message: errorMessages.USER_LOAD_ERROR,
          details: String(prismaError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "RATE_LIMITED") {
      return NextResponse.json(
        { message: "Muitas requisições. Tente novamente mais tarde." },
        { status: 429 }
      );
    }
    if (error instanceof z.ZodError) {
      // Retornar erros de validação
      console.error("Erro de validação:", error.errors);
      return NextResponse.json(
        { message: "Erro de validação.", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json(
      { message: errorMessages.LOGIN_FAILED },
      { status: 500 }
    );
  }
}
