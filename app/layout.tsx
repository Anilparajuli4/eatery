import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BSquare Eatery - Where hunger meets flavour",
  description: "Experience the best food in town. BSquare Eatery: Where hunger meets flavour.",
};

import Providers from "./providers";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import NotificationCenter from "@/components/NotificationCenter";

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={googleClientId}>
          <Providers>
            <AuthProvider>
              <ToastProvider>
                <NotificationCenter />
                {children}
              </ToastProvider>
            </AuthProvider>
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
