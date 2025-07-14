// next.config.js
import dotenv from "dotenv";
dotenv.config();

import type { NextConfig } from "next";

// detecta ambiente de desenvolvimento (localhost) e produção
const isDev = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// CSP para localhost (dev) e produção
const cspDirectives = isDev
  ? [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "object-src 'none'",
    ]
  : [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self' https://fonts.gstatic.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "require-trusted-types-for 'script'",
      "report-uri /csp-report",
    ];

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspDirectives.join("; "),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // X-XSS-Protection é obsoleto em navegadores modernos, CSP é suficiente
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // oculta X-Powered-By
  productionBrowserSourceMaps: isProduction, // source maps só em prod
  experimental: {
    optimizeCss: isProduction, // otimização de CSS só em prod
  },
  onDemandEntries: {
    maxInactiveAge: isProduction ? 15_000 : 0, // exec dev vs prod
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // cache diferente para localhost (desenvolvimento) e produção
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
                {
                  key: "Cache-Control",
                  value: "public, max-age=0, s-maxage=0, must-revalidate",
                },
              ]),
          ...securityHeaders,
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image/:path*",
        source: "/_next/image/:path*",
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
