import "material-symbols";
import "remixicon/fonts/remixicon.css";
import "react-calendar/dist/Calendar.css";
import "swiper/css";
import "swiper/css/bundle";

// globals
import "./globals.css";

import LayoutProvider from "@/providers/LayoutProvider";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});
  
export const metadata: Metadata = {
  title: "Neural Content - AI-Powered Content Creation Platform",
  description: "Create amazing content with AI-powered tools and advanced features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" dir="ltr">
      <body
        className={`${inter.variable} antialiased`}
      >
        <QueryProvider>
          <NextAuthProvider>
            <AuthProvider>
              <TranslationProvider>
                <LayoutProvider>
                  {children}
                </LayoutProvider>
              </TranslationProvider>
            </AuthProvider>
          </NextAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
