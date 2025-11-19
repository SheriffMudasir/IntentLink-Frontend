// app/layout.tsx
import type { Metadata } from "next";
import { Rajdhani, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; // <-- Import
import "./globals.css";
// Font configuration
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-rajdhani',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "IntentLink",
  description: "The Future of DeFi Execution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-space-900 text-white`}>
        {/* Main background container */}
        <div className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-[-2]" style={{ backgroundImage: "url('/images/IntentLinkBackground.png')" }} />
        
        {/* Faint grid overlay */}
        <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-[url('/grid.svg')] opacity-20" />

        <main>{children}</main>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}