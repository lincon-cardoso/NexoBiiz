import type { Metadata } from "next";
import "../style/uniao.scss";



export const metadata: Metadata = {
  title: "Nexobiiz - Transformando Ideias em Soluções",
  description: "Nexobiiz é uma plataforma inovadora focada em criar soluções digitais personalizadas para o seu negócio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body >
        {children}
      </body>
    </html>
  );
}
