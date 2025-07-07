import { NextResponse } from "next/server";
import { errorMessages } from "@/constants/errorMessages";

function validateCSRF(request: Request) {
  const csrfToken = request.headers.get("x-csrf-token");
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/csrf-token=([^;]+)/);
  const validToken = match ? match[1] : undefined;
  if (!csrfToken || csrfToken !== validToken) {
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
  const csrfError = validateCSRF(request);
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
