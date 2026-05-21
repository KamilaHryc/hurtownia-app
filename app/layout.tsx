import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hurtownia Warzyw i Owoców",
  description: "System obsługi reklamacji i strat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}