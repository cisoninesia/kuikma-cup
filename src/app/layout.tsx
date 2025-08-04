import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kuikma CUP - Padel Ranking",
  description: "ATP-style padel ranking system for tracking matches and player statistics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
