import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acara RSI",
  description: "Aplikasi manajemen pendaftaran acara",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", dmSans.variable, interHeading.variable)}
    >
      <body className="flex min-h-full flex-col">
        <Header />

        {children}

        <footer className="border-t">
          <div className="mx-auto flex max-w-5xl items-center justify-between p-4 text-sm text-muted-foreground">
            <span>&copy; 2026 Acara RSI</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
