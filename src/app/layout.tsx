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
      <body>{children}</body>
    </html>
  );
}
