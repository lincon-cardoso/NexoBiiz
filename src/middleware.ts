import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se o usuário está autenticado
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken && pathname.startsWith("/dashboard")) {
    // Redirecionar para a tela de login se o token não estiver presente
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  // Gerar nonce para CSP usando Web Crypto API e enviar ao cliente via cookie
  const nonce = crypto.randomUUID();
  response.cookies.set("csp-nonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600, // Expira em 1 hora
  });

  // Adicionar proteção contra CSRF
  const csrfToken = crypto.randomUUID();
  response.cookies.set("csrf-token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 3600, // Expira em 1 hora
  });

  // Monitoramento de sessões: invalidar tokens antigos
  const sessionExpiry = 3600; // Expira em 1 hora
  response.cookies.set(
    "session-expiry",
    (Date.now() + sessionExpiry * 1000).toString(),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: sessionExpiry,
    }
  );

  // Cabeçalhos de segurança adicionais
  response.headers.set("Expect-CT", "max-age=86400, enforce");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS apenas em produção
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  response.headers.set("Permissions-Policy", "geolocation=(), microphone=()");

  // Content Security Policy: usa nonce em produção e ativa report-only
  if (process.env.NODE_ENV === "production") {
    const csp =
      `default-src 'self'; img-src 'self' data: https:; ` +
      `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com; ` +
      `style-src 'self' https:;`;
    response.headers.set("Content-Security-Policy", csp);

    const reportUri = process.env.CSP_REPORT_URI || "";
    if (reportUri) {
      response.headers.set(
        "Content-Security-Policy-Report-Only",
        `${csp} report-uri ${reportUri}`
      );
    }
  } else {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https:;"
    );
  }

  // CORS for API routes with explicit whitelist
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin") || "";
    const whitelist =
      process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
    const allowOrigin = whitelist.includes(origin) ? origin : "";
    if (allowOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type,Accept"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Vary", "Origin");
    }
  }

  // Bloquear IPs após várias tentativas de autenticação falhadas
  const failedAttempts = request.cookies.get("failed-attempts")?.value || "0";
  if (parseInt(failedAttempts) > 5) {
    return NextResponse.json(
      { message: "IP bloqueado devido a várias tentativas falhadas." },
      { status: 429 }
    );
  }

  return response;
}
