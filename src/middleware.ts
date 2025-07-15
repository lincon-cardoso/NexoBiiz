import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/transactions")
    ) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/logout") {
      await deleteTokenFromDatabase(accessToken); // Função fictícia para apagar o token
      const response = NextResponse.redirect("/login");
      response.cookies.delete("accessToken");
      return response;
    }
  }

  return NextResponse.next();
}

async function deleteTokenFromDatabase(token: string | undefined) {
  if (!token) return;
  // Implementação para apagar o token do banco de dados
  console.log(`Apagando token: ${token}`);
  // Exemplo: await prisma.token.delete({ where: { token } });
}
