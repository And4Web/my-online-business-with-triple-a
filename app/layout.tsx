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
    default: "Nexora | Ready-Made Full-Stack Projects",
    template: "%s | Nexora",
  },

  description:
    "Discover ready-made full-stack software projects with source code. Explore e-commerce platforms, communication apps, booking systems and more at Nexora, operated by Divine flame IT Solutions.",

  applicationName: "Nexora",

  openGraph: {
    type: "website",
    title: "Nexora | Ready-Made Full-Stack Projects",
    description:
      "Explore ready-made full-stack software projects and source code. Build with confidence and launch faster with Nexora.",
    siteName: "Nexora",
  },

  twitter: {
    card: "summary_large_image",
    title: "Nexora | Ready-Made Full-Stack Projects",
    description:
      "Discover ready-made full-stack software projects and source code at Nexora.",
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
