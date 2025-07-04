import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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
        { message: `${conflictField} já está registrado.` },
        { status: 409 }
      );
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(parsedData.password, 10);

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
      return NextResponse.json(user, { status: 201 });
    } catch (prismaError) {
      console.error("Erro do Prisma ao criar usuário:", prismaError);
      return NextResponse.json(
        {
          message: "Erro ao criar usuário no banco de dados.",
          details: String(prismaError),
        },
        { status: 500 }
      );
    }
  } catch (error) {
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
      { message: "Erro ao registrar usuário." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
