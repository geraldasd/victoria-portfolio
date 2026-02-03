import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configure the custom fonts
const monument = localFont({
  src: [
    {
      path: "../public/fonts/ABCMonumentGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-monument",
});

const monumentMono = localFont({
  src: [
    {
      path: "../public/fonts/ABCMonumentGroteskMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-monument-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${monument.variable} ${monumentMono.variable} bg-white`}>{children}</body>
    </html>
  );
}