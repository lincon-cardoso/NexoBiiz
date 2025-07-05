import { NextResponse, NextRequest } from "next/server";
// Usar Web Crypto API nativa (Edge Runtime) - não importar 'crypto'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  return response;
}
