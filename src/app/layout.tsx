import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "@/style/global.scss";

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
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
