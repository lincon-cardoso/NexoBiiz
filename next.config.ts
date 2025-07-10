import dotenv from "dotenv";
dotenv.config();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,

  experimental: {
    optimizeCss: true,
  },

  onDemandEntries: {
    maxInactiveAge: process.env.NODE_ENV === "development" ? 0 : 15000, // Desabilita cache em desenvolvimento, ativa em produção
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      // 🔹 HEADERS GERAIS PARA TODAS AS PÁGINAS
      {
        source: "/:path*",
        headers: [
          ...(isDev
            ? [
                {
                  key: "Cache-Control",
                  value:
                    "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
                { key: "Pragma", value: "no-cache" },
                { key: "Expires", value: "0" },
              ]
            : [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ]),

          // 🔒 Cabeçalhos de segurança
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Surrogate-Control", value: "no-store" },
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
        ],
      },

      // 🔹 ARQUIVOS ESTÁTICOS DO NEXT
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // 🔹 IMAGENS OTIMIZADAS
      {
        source: "/_next/image",
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
