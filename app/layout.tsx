import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const metadata: Metadata = {
	title: "Fahad Bin Mahbub · Outlier Portfolio",
	description:
		"A curated portfolio of interactive HTML and React applications and UI experiments built as an AI Trainer at Outlier.ai.",
	icons: [{ rel: "icon", url: `${BASE_PATH}/favicon.svg` }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
