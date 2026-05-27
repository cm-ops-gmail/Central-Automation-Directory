import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central Automation Hub",
  description: "Content Operations Automation Directory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
