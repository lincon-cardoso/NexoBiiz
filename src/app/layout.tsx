import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@/style/global.scss";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Nexobiiz - Transformando Ideias em Soluções",
  description:
    "Nexobiiz é uma plataforma inovadora focada em criar soluções digitais personalizadas para o seu negócio.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookiesStore = await cookies();
  const nonce = cookiesStore.get("csp-nonce")?.value;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Analytics script permitido via CSP com nonce */}
        <script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXX"
          nonce={nonce}
          async
        />
        {/* Carrega init externo em /scripts/init.js */}
        <script src="/scripts/init.js" nonce={nonce} async />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
