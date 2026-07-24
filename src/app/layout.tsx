import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
    <html lang="en">
      <body>{children}</body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  );
}
