import type { Metadata } from "next";
import { Newsreader, Inter, Inconsolata } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inconsolata",
});

export const metadata: Metadata = {
  title: "NewsFlash — App Preview",
  description: "Interactive preview of the NewsFlash mobile app for MENA financial intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable} ${inconsolata.variable}`}>
      <body>{children}</body>
    </html>
  );
}
