import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === "linkon789@gmail.com" && password === "123456") {
    // Retorna sucesso ao cliente
    return NextResponse.json(
      { message: "Login bem-sucedido" },
      { status: 200 }
    );
  } else {
    // Retorna erro ao cliente
    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 }
    );
  }
}
