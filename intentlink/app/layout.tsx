// app/layout.tsx
import type { Metadata } from "next";
import { Rajdhani, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ApiTestButton } from "@/components/ui/api-test-button";
import { Header } from "@/components/ui/header";
import { WalletProvider } from "@/contexts/WalletContext";
import Image from "next/image";
import "./globals.css";
// Font configuration
const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
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
  title: "IntentLink | AI-Powered DeFi Execution",
  description: "Execute complex DeFi strategies with pure intent. Secured by DAGScanner.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rajdhani.variable} ${inter.variable} ${jetbrainsMono.variable} font-body bg-background text-white min-h-screen overflow-x-hidden selection:bg-primary selection:text-black`}>
        <WalletProvider>
          {/* Layer 1: The Image */}
          <div className="fixed inset-0 z-0">
            <Image
              src="/IntentLinkBackground.png"
              alt="Background"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>

          {/* Layer 2: The Gradient Overlay (Vignette) */}
          <div className="fixed inset-0 z-0 bg-linear-to-b from-black/90 via-black/80 to-black/95 pointer-events-none" />

          {/* Layer 2.5: Additional Center Darkening */}
          <div className="fixed inset-0 z-0 bg-radial-gradient from-transparent via-black/40 to-black/60 pointer-events-none" />

          {/* Layer 3: Grid Pattern */}
          <div className="fixed inset-0 z-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

          {/* Header */}
          <Header />

          {/* Layer 4: Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* ApiTestButton removed as per user request */}
          <Toaster theme="dark" position="bottom-right" />
        </WalletProvider>
      </body>
    </html>
  );
}