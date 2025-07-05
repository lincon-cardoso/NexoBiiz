import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true, // Habilita mapas de origem no ambiente de produção

  experimental: {
    optimizeCss: true, // Ativa otimização de CSS
  },

  async headers() {
    return [
      // 🔹 Cabeçalhos de segurança + sem cache para páginas (SSR e HTML)
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Surrogate-Control", value: "no-store" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src *; frame-ancestors 'none';" },
          // {
          //   key: "Content-Security-Policy",
          //   value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src *; frame-ancestors 'none';"
          // },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },

          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' https://static.cloudflareinsights.com; " +
              "script-src 'self' https://static.cloudflareinsights.com " +
              "'sha256-bZP3iMM5Cko4Dq+aF6EkaXeCcf3hOL4hqb/6FETUDCg=' " +
              "'sha256-LcsuUMiDkprrt6ZKeiLP4iYNhWo8NqaSbAgtoZxVK3s=' " +
              "'sha256-OBTN3RiyCV4Bq7dFqZ5a2pAXjnCcCYeTJMO2I/LYKeo=' " +
              "'sha256-BnUO1cTGRJSLoOHjFT/xlPM4jHk2N900AVCGZDChfe8=' " +
              "'sha256-lpsso/ATFdqCbhjOT6RiFaRYtjiKFKJpnM1W3/8yBp8=' " +
              "'sha256-l+jHIJXHnxOxTurmIRe1AIXFS88HmAoYDCQuFyf07Kw=' " +
              "'sha256-TYibgXe4t0lwR6Cf+3zooXQPQox0ZlhSywk024wdd3Q=' " +
              "'sha256-GlmiYYLPAKS0avPr3mUIYhwG3CJ25ZZxJYTDLHfq1P8=' " +
              "'sha256-UlT6OsMG+SlfIrv8HljCVvUtKpdLUrHLpaI064+Q5ns=' " +
              "'sha256-nzgVfPFR9NICOq2OkFtq0jS0lY6er6grjpE0ZElXBV0=' " +
              "'sha256-bM1AX8tDHA4vP4LwnwbHy065kbap/jSMBEIs0eQOeCk=' " +
              "'sha256-K/ckGTZAiQkxDEn081iYlLvd3Kc2VCcwzyhoS/91j5U=' " +
              "'sha256-8K78zQME8uoSkAVCMN+ZvP8nfSlfSKedY9exVHyP+oE=' " +
              "'sha256-AU+ly8zuV4CLU5JdwjV3/eNvtCW/+1O2k1GrkdnsJiU=' " +
              "'sha256-hyZela/1uOH+B6l3LYW8BYNu78m2JK6dQmgnRKLHXjM=' " +
              "'sha256-8P8Hryud1pei0pt/11+6BlQfBCAESFPO0gRIyRKythk=' " +
              "'sha256-6FWzdEDbLe/VIjGuonne5OWKwIHRHEelKuAia4uNsE8=' " +
              "'sha256-YeZ9f2nOtw+sLDPWfSYzO4WQGNgrdR7c1K/gbE43Qk4=' " +
              "'sha256-mhENM3dNjuQLweTFQUHs3amtK9Wdt3gn4bYgXTWYo6w=' " +
              "'sha256-z4PhNX7vuL3xVChQ1m2AB9Yg5AULVxXcg/SpIdNs6c5H0NE8XYXysP+DGNKHfuwvY7kxvUdBeoGlODJ6+SfaPg==' " +
              "'sha256-n9ZI7V7Gyyeflwv0gI/vw8J/qv461qDVIawSP3UqMMM=' " +
              "'sha256-TyBfx3N4No0TcSSfEWDcpmjZhG+jZottrpmyDXhGigk=' " +
              "'sha256-WydCWP4FCgyGow2jsOUeoSUHzl9axfNBvNXzmTpM+Ho=' " +
              "'sha256-YeGXg5jnQizgi0NQPZ23HfUVmf1kYIfYb1LRvRjzqqQ='; " +
              "style-src 'self' 'unsafe-hashes' 'sha256-zlqnbDt84zf1iSefLU/ImC54isoprH/MRiVZGskwexk=';",
          },
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },

      // 🔹 Cache agressivo para arquivos estáticos com hash
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // 🔹 Cache agressivo para imagens otimizadas
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
