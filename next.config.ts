// next.config.js
import dotenv from "dotenv";
dotenv.config();

import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline'; object-src 'none';",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
  },

  onDemandEntries: {
    maxInactiveAge: process.env.NODE_ENV === "development" ? 0 : 15_000,
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      // ─── HTML / Rotas dinâmicas ────────────────────────
      // Browser e CDN sempre revalidam no F5 normal
      {
        source: "/:path*",
        headers: [
          ...(isDev
            ? [
                // Dev: nada em cache
                {
                  key: "Cache-Control",
                  value:
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
                { key: "Pragma", value: "no-cache" },
                { key: "Expires", value: "0" },
              ]
            : [
                // Prod: browser e CDN com TTL zero
                {
                  key: "Cache-Control",
                  value: "public, max-age=0, s-maxage=0, must-revalidate",
                },
              ]),
          // Cabeçalhos de segurança
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          ...securityHeaders,
        ],
      },

      // ─── Assets estáticos versionados ────────────────────
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ─── Imagens otimizadas ─────────────────────────────
      {
        source: "/_next/image(/:path*)?",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
