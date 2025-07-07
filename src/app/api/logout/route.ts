// Força execução em Node.js para permitir headers customizados
export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { errorMessages } from "@/constants/errorMessages";

// Validação CSRF lendo o token do corpo da requisição (body já lido no handler)
function validateCSRF(csrfToken: string | undefined, cookieHeader: string) {
  const match = cookieHeader.match(/csrf-token=([^;]+)/);
  const validToken = match ? match[1] : undefined;

  console.log("[API][logout] Header cookie recebido:", cookieHeader);
  console.log("[API][logout] CSRF token recebido no body:", csrfToken);
  console.log(
    "[API][logout] Valor do csrf-token extraído do cookie:",
    validToken
  );

  if (!csrfToken || csrfToken !== validToken) {
    console.warn("[API][logout] Falha na validação CSRF", {
      csrfToken,
      validToken,
    });
    return NextResponse.json(
      {
        error: errorMessages.INVALID_INPUT,
        detail: "CSRF token ausente ou inválido.",
      },
      { status: 403 }
    );
  }
  return null;
}

export async function POST(request: Request) {
  // Loga todos os headers recebidos para depuração
  console.log(
    "[API][logout] Todos os headers recebidos:",
    Object.fromEntries(request.headers.entries())
  );

  const cookieHeader = request.headers.get("cookie") || "";
  let csrfToken: string | undefined = undefined;
  try {
    const body = await request.json();
    csrfToken = body?.csrfToken;
  } catch {
    // Se não for JSON, ignora
  }

  const csrfError = validateCSRF(csrfToken, cookieHeader);
  if (csrfError) return csrfError;

  try {
    const response = NextResponse.json({ message: "Logout bem-sucedido" });
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");

    return response;
  } catch (error) {
    console.error("Erro no logout:", error);
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
