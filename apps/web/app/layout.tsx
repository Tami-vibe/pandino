import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Inter, Manrope, Montserrat, Playfair_Display, Poppins, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
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
  const fonts = [inter.className, inter.variable, manrope.variable, syne.variable, montserrat.variable, poppins.variable, dm.variable, playfair.variable];
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=ads_click,auto_stories,call_to_action,construction,dark_mode,light_mode,lock,palette,save,sentiment_dissatisfied,storefront,verified&display=block" />
      </head>
      <body className={fonts.join(" ")}>{children}</body>
    </html>
  );
}
