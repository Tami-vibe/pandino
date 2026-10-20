import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, DM_Serif_Display, Inter, Manrope, Montserrat, Playfair_Display, Poppins, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-barlow" });
const manrope = Manrope({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-manrope" });
const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-montserrat" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-poppins" });
const dm = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "700", variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Pandino",
  description: "A website for your auto shop, generated from recipes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const fonts = [inter.className, inter.variable, barlow.variable, manrope.variable, syne.variable, montserrat.variable, poppins.variable, dm.variable, playfair.variable];
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700&family=Syne:wght@600;700;800&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" />
        <link rel="stylesheet" href="/css/tokens-base.css" />
        <link rel="stylesheet" href="/css/daisyui-components.css" />
      </head>
      <body className={fonts.join(" ")}>{children}</body>
    </html>
  );
}
