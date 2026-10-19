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
      <body className={fonts.join(" ")}>{children}</body>
    </html>
  );
}
