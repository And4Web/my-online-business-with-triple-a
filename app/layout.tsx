import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.and4web.co.in"),

  alternates: {
    canonical: "/",
  },

  title: {
    default: "And4Web | Original Ready-Made Software & Source Code",
    template: "%s | And4Web",
  },

  description:
    "Discover original ready-made full-stack software and source-code solutions, including e-commerce applications, communication apps, booking systems and more. And4Web is a software brand operated by Divine Flame IT Solutions.",

  applicationName: "And4Web",

  openGraph: {
    type: "website",
    title: "And4Web | Original Ready-Made Software & Source Code",
    description:
      "Explore original ready-made full-stack software applications and source-code solutions developed by Divine Flame IT Solutions. Build with confidence and launch faster with And4Web.",
    siteName: "And4Web",
  },

  twitter: {
    card: "summary_large_image",
    title: "And4Web | Original Ready-Made Software & Source Code",
    description:
      "Discover original ready-made full-stack software and source-code solutions at And4Web, operated by Divine Flame IT Solutions.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
