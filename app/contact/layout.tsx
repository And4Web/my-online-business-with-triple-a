
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Nexora for software project inquiries, purchase and download assistance, deployment support, and business inquiries. Nexora is operated by Divine flame IT Solutions.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Nexora",
    description:
      "Get in touch with Nexora for product questions, purchase assistance, deployment support, and business inquiries.",
    url: "/contact",
    siteName: "Nexora",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Nexora",
    description:
      "Contact Nexora for software project inquiries and customer support.",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
