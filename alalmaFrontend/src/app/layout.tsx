import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Crimson_Text, Playfair_Display } from "next/font/google";
import "./globals.css";
import { UserPlanProvider } from "@/contexts/UserPlanContext";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ContentApprovalProvider } from "@/contexts/ContentApprovalContext";
import { EarningsProvider } from "@/contexts/EarningsContext";
import { FavoritesCartProvider } from "@/contexts/FavoritesCartContext";
import { LiveProvider } from "@/contexts/LiveContext";
import { LivePermissionsProvider } from "@/contexts/LivePermissionsContext";
import { FloatingLiveButton } from "@/components/live/FloatingLiveButton";
import { LiveUpgradeModal } from "@/components/live/LiveUpgradeModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-isabel-light",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-dolce-vita",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alalma.com'),
  title: "Alalma - Tu transformación espiritual",
  description: "Descubre cursos, terapias y herramientas para tu crecimiento espiritual y transformación personal",
  openGraph: {
    title: 'Alalma - Tu transformación espiritual',
    description: 'Descubre cursos, terapias y herramientas para tu crecimiento espiritual y transformación personal',
    images: ['/with_padding.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${crimsonText.variable} ${playfairDisplay.variable} antialiased`}
      >
        <AuthProvider>
          <UserPlanProvider>
            <UserRoleProvider>
              <ContentApprovalProvider>
                <EarningsProvider>
                  <FavoritesCartProvider>
                    <LiveProvider>
                      <LivePermissionsProvider>
                        {children}
                        <FloatingLiveButton />
                        <LiveUpgradeModal />
                      </LivePermissionsProvider>
                    </LiveProvider>
                  </FavoritesCartProvider>
                </EarningsProvider>
              </ContentApprovalProvider>
            </UserRoleProvider>
          </UserPlanProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
