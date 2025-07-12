// next.config.js
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
    maxInactiveAge: process.env.NODE_ENV === "development" ? 0 : 15_000,
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      // ▶︎ HTML / rotas dinâmicas: sempre revalida
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
                  value: "public, max-age=0, must-revalidate",
                },
                { key: "Surrogate-Control", value: "max-age=31536000" },
              ]),
          // cabeçalhos de segurança (mantém igual)
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
        ],
      },

      // ▶︎ Assets versionados com hash: cache longo
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ▶︎ Imagens otimizadas: cache longo
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
