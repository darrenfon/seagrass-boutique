import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Seagrass Boutique | Coastal Fashion with a Modern Bohemian Flare",
  description:
    "Hand-curated coastal fashion in Ocean City, NJ. Discover unique clothing, dresses, candles, and accessories from designers like Current Air, Lost + Wander, Voluspa, and more.",
  keywords: ["boutique", "coastal fashion", "bohemian", "Ocean City NJ", "women's clothing", "boho"],
  openGraph: {
    title: "Seagrass Boutique",
    description: "Coastal Fashion with a Modern Bohemian Flare",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
