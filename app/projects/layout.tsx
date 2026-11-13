
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Ready-Made Full-Stack Projects",
  description:
    "Browse affordable ready-made full-stack software projects and source code at Nexora. Explore e-commerce, communication, productivity and other software solutions.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Explore Ready-Made Full-Stack Projects | Nexora",
    description:
      "Discover affordable full-stack software projects and source code at Nexora, operated by Divine flame IT Solutions.",
    url: "/projects",
    siteName: "Nexora",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Explore Ready-Made Full-Stack Projects | Nexora",
    description:
      "Browse ready-made full-stack software projects and source code at Nexora.",
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
