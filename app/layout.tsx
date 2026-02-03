import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Configure the custom font
const monument = localFont({
  src: [
    {
      path: "../public/fonts/ABCMonumentGrotesk-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-monument",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${monument.variable} bg-white`}>{children}</body>
    </html>
  );
}