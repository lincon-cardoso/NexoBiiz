import { NextResponse, NextRequest } from "next/server";
// Usar Web Crypto API nativa (Edge Runtime) - não importar 'crypto'

// Rate limiting simples em memória (apenas para dev/homologação)
const rateLimitMap = new Map<string, { count: number; last: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX = 20; // 20 requisições por janela

// CSRF token para métodos de alteração de dados
const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "csrf-token";

function generateCsrfToken() {
  // Gera um token simples (ideal: usar crypto.randomUUID ou crypto.getRandomValues)
  return crypto.randomUUID();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas protegidas (exemplo: dashboard)
  const protectedRoutes = ["/dashboard"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      // Redireciona para login se não autenticado
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Validação extra: se o token existe, mas é inválido/expirado, força logout
    // Opcional: decodificar e validar JWT aqui se necessário
  }

  // Rate limiting global para rotas de API
  if (process.env.NODE_ENV !== "production" && pathname.startsWith("/api/")) {
    // Libera o rate limit em dev
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    let ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      request.nextUrl.hostname ||
      "unknown";
    // Se múltiplos IPs, pega o primeiro
    if (ip.includes(",")) ip = ip.split(",")[0].trim();

    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, last: now };
    if (now - entry.last > RATE_LIMIT_WINDOW) {
      // Nova janela
      rateLimitMap.set(ip, { count: 1, last: now });
    } else {
      entry.count++;
      entry.last = now;
      rateLimitMap.set(ip, entry);
      if (entry.count > RATE_LIMIT_MAX) {
        return new NextResponse(
          JSON.stringify({
            message: "Rate limit exceeded. Tente novamente em instantes.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // Handle CORS preflight for API routes with explicit whitelist
  if (pathname.startsWith("/api/") && request.method === "OPTIONS") {
    const headers = new Headers();
    const origin = request.headers.get("origin") || "";
    const whitelist =
      process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
    const allowOrigin = whitelist.includes(origin) ? origin : "";
    if (allowOrigin) {
      headers.set("Access-Control-Allow-Origin", allowOrigin);
      headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type,Accept");
    }
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  // Gerar nonce para CSP usando Web Crypto API e enviar ao cliente via cookie
  const nonce = crypto.randomUUID();
  response.cookies.set("csp-nonce", nonce, { httpOnly: true, path: "/" });
  // Security headers
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
    // Adiciona domínio de vendor para scripts (ex: Google Tag Manager)
    const csp =
      `default-src 'self'; img-src 'self' data: https:; ` +
      `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com; ` +
      `style-src 'self' https:;`;
    response.headers.set("Content-Security-Policy", csp);
    // Report-only CSP para detectar violações sem bloquear
    const reportUri = process.env.CSP_REPORT_URI || "";
    if (reportUri) {
      response.headers.set(
        "Content-Security-Policy-Report-Only",
        `${csp} report-uri ${reportUri}`
      );
    }
  } else {
    // Dev: permite inline e eval para hot-reload
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

  // Configurar cookies seguros
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  // CSRF protection para métodos sensíveis
  const isApi = pathname.startsWith("/api/");
  const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
    request.method
  );
  if (isApi && isMutation) {
    const csrfCookie = request.cookies.get(CSRF_COOKIE)?.value;
    const csrfHeader = request.headers.get(CSRF_HEADER);
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      return new NextResponse(
        JSON.stringify({ message: "CSRF token inválido ou ausente." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Gera e envia CSRF token para GET em APIs (para frontend consumir)
  if (isApi && request.method === "GET") {
    const csrfToken = generateCsrfToken();
    response.cookies.set(CSRF_COOKIE, csrfToken, {
      httpOnly: false,
      path: "/",
    });
    response.headers.set(CSRF_HEADER, csrfToken);
  }

  if (pathname === "/logout") {
    const response = NextResponse.redirect("/login");
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    return response;
  }

  let error;
  try {
    // ... lógica do middleware ...
  } catch (err) {
    error = err;
  }

  if (error) {
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação.",
        error: error.toString(),
      },
      { status: 500 }
    );
  }

  return response;
}
