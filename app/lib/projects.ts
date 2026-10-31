
export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  price: number;
  color: string;
  href: string;
  features: string[];
  imageUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "e-commerce-platform",
    title: "E-commerce Platform",
    category: "E-commerce",
    description:
      "A planned online store project for businesses looking to build an e-commerce website.",
    technologies: ["Next.js", "MongoDB", "TypeScript"],
    price: 39,
    color: "blue",
    href: "/projects/e-commerce-platform",
    features: [
      "Product catalog layout",
      "Responsive storefront design",
      "Planned database integration",
    ],
  },
  {
    slug: "real-time-chat-app",
    title: "Real-Time Chat App",
    category: "Communication",
    description:
      "A planned messaging project for exploring real-time communication features.",
    technologies: ["React", "Socket.IO", "Node.js"],
    price: 29,
    color: "purple",
    href: "",
    features: [
      "Chat interface design",
      "Planned real-time messaging",
      "Responsive layout",
    ],
  },
  {
    slug: "admin-dashboard",
    title: "Admin Dashboard",
    category: "Productivity",
    description:
      "A planned dashboard project for organizing information and presenting useful metrics.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    price: 19,
    color: "cyan",
    href: "",
    features: [
      "Dashboard layout",
      "Data visualization area",
      "Responsive admin interface",
    ],
  },
];
