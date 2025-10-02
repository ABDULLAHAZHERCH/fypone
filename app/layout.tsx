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
  title: "v-FIT | Virtual Fitting Room - Try Clothes in 3D",
  description: "Create your 3D Digital Twin and try on clothes virtually. Reduce returns, increase confidence, and shop smarter with v-FIT's revolutionary virtual fitting room technology.",
  keywords: ["virtual fitting room", "3D avatar", "digital twin", "online shopping", "virtual try-on", "fashion tech", "AR clothing"],
  authors: [{ name: "v-FIT Team" }],
  openGraph: {
    title: "v-FIT | Virtual Fitting Room",
    description: "Revolutionary virtual fitting room technology with 3D Digital Twins",
    type: "website",
    siteName: "v-FIT",
  },
  twitter: {
    card: "summary_large_image",
    title: "v-FIT | Virtual Fitting Room",
    description: "Try clothes virtually with your 3D Digital Twin",
  },
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
        {children}
      </body>
    </html>
  );
}
