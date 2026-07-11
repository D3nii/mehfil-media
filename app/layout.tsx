import type { Metadata } from "next";
import {
  Instrument_Serif,
  Noto_Nastaliq_Urdu,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mehfil Media — AI Creators for Pakistani Brands",
  description:
    "Upload a product. Receive a campaign. AI-generated female creators producing scroll-stopping UGC for Pakistan's boldest brands — in 48 hours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${instrument.variable} ${nastaliq.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap"
        />
      </head>
      <body
        className="grain min-h-full overflow-x-clip bg-ivory text-ink"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
