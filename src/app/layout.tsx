import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andrewlindley.com"),
  title: "Andrew Lindley",
  description: "Product design portfolio — Meta, Sonos, Hulu.",
  openGraph: {
    title: "Andrew Lindley",
    description: "Product design portfolio — Meta, Sonos, Hulu.",
    url: "https://andrewlindley.com",
    siteName: "Andrew Lindley",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1920,
        height: 1080,
        alt: "Andrew Lindley — product design portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew Lindley",
    description: "Product design portfolio — Meta, Sonos, Hulu.",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
