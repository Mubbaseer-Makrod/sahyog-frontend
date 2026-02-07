import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SahyogFarm - Quality Tractors & Farm Equipment",
    template: "%s | SahyogFarm",
  },
  description:
    "Your trusted partner for quality tractors and farm equipment. Browse our collection of premium tractors from top brands.",
  keywords: [
    "tractors",
    "farm equipment",
    "used tractors",
    "agricultural machinery",
    "SahyogFarm",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "SahyogFarm",
    title: "SahyogFarm - Quality Tractors & Farm Equipment",
    description:
      "Your trusted partner for quality tractors and farm equipment. Browse our collection of premium tractors from top brands.",
  },
  twitter: {
    card: "summary",
    title: "SahyogFarm - Quality Tractors & Farm Equipment",
    description:
      "Your trusted partner for quality tractors and farm equipment. Browse our collection of premium tractors from top brands.",
  },
  icons: {
    icon: "/favicon.ico",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
