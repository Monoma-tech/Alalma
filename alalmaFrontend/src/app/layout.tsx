import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserPlanProvider } from "@/contexts/UserPlanContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alalma Sabiduría - Tu transformación espiritual",
  description: "Descubre cursos, terapias y herramientas para tu crecimiento espiritual y transformación personal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserPlanProvider>
          {children}
        </UserPlanProvider>
      </body>
    </html>
  );
}
