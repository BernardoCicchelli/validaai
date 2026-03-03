import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ValidAI - Validate your idea before you build it.",
  description: "A strategic diagnostic engine that evaluates product ideas before execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased selection:bg-black/10 dark:selection:bg-white/10`}>
        {children}
      </body>
    </html>
  );
}
