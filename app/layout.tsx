import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BuddyScript",
  description: "BuddyScript is a social media platform for connecting with friends and family.",
  keywords: ["social media", "social networking", "connect with friends", "family", "chat", "messaging", "share", "post", "like", "comment", "share", "post", "like", "comment"],
  authors: [{ name: "BuddyScript", url: "https://buddyscript.com" }],
  creator: "BuddyScript",
  publisher: "BuddyScript",
  openGraph: {
    title: "BuddyScript",
    description: "BuddyScript is a social media platform for connecting with friends and family.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased `}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
