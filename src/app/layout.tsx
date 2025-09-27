import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/core/context/AuthContext";

export const metadata: Metadata = {
  title: "Cuentas Claras",
  description: "Gestión de Negocio Simplificada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
