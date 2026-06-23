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
  title: {
    default: "Pune District Handball Organisation (PDHO)",
    template: "%s | PDHO",
  },
  description: "Official portal of the Pune District Handball Organisation. Find tournaments, register teams, and stay updated with the latest handball news in Pune.",
  openGraph: {
    title: "Pune District Handball Organisation",
    description: "Official portal of the Pune District Handball Organisation. Find tournaments, register teams, and stay updated with the latest handball news in Pune.",
    url: "https://pdho.org",
    siteName: "PDHO",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pune District Handball Organisation",
    description: "Official portal of the Pune District Handball Organisation. Find tournaments, register teams, and stay updated with the latest handball news in Pune.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
