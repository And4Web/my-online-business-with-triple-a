
"use client";

import { useState } from "react";
import Link from "next/link";

const projects = [
  {
    category: "E-commerce",
    title: "E-commerce Platform",
    description:
      "A starting point for building an online store with product listings, a shopping cart, and checkout.",
    technologies: ["Next.js", "MongoDB", "TypeScript"],
    price: 39,
    color: "blue",
    href: "/projects/e-commerce-platform",
  },
  {
    category: "Communication",
    title: "Real-Time Chat App",
    description:
      "A messaging application starter designed for live conversations and chat rooms.",
    technologies: ["React", "Socket.IO", "Node.js"],
    price: 29,
    color: "purple",
    href: "",
  },
  {
    category: "Productivity",
    title: "Admin Dashboard",
    description:
      "A dashboard starter for organizing business data, metrics, and management workflows.",
    technologies: ["Next.js", "TypeScript", "Tailwind"],
    price: 19,
    color: "cyan",
    href: "",
  },
];

const categories = [
  "All Projects",
  "E-commerce",
  "Communication",
  "Productivity",
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");

  
const filteredProjects = projects.filter((project) => {
  const matchesCategory =
    activeCategory === "All Projects" ||
    project.category === activeCategory;

  const searchText = searchQuery.trim().toLowerCase();

  const matchesSearch =
    project.title.toLowerCase().includes(searchText) ||
    project.category.toLowerCase().includes(searchText) ||
    project.description.toLowerCase().includes(searchText) ||
    project.technologies.some((technology) =>
      technology.toLowerCase().includes(searchText),
    );

  return matchesCategory && matchesSearch;
});


  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-blue-400"
        >
          ← Back to Home
        </Link>

        <div className="mt-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            The Nexora Marketplace
          </p>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Explore Our Projects
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Discover affordable source-code starters that help you
            build faster and bring your ideas to life.
          </p>
        </div>



<div className="mx-auto mt-10 max-w-xl">
  <label htmlFor="project-search" className="sr-only">
    Search projects
  </label>

  <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 transition focus-within:border-blue-500">
    <span aria-hidden="true" className="text-lg text-slate-400">
      ⌕
    </span>

    <input
      id="project-search"
      type="search"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
      placeholder="Search projects, technologies..."
      className="w-full bg-transparent text-base text-white outline-none placeholder:text-slate-500"
    />
  </div>
</div>




        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                activeCategory === category
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-blue-400 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-300">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredProjects.length}
            </span>{" "}
            {filteredProjects.length === 1 ? "project" : "projects"}
          </p>

          <p className="text-sm text-slate-500">
            Sample prices under $49
          </p>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50"
              >
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    project.color === "blue"
                      ? "bg-blue-500/10 text-blue-400"
                      : project.color === "purple"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-cyan-500/10 text-cyan-400"
                  }`}
                >
                  {project.category}
                </span>

                <h2 className="mt-5 text-xl font-bold">
                  {project.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">
                      Sample price
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      ${project.price}
                    </p>
                  </div>

                  {project.href ? (
                    <Link
                      href={project.href}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400"
                    >
                      View Details →
                    </Link>
                  ) : (
                    <span className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-400">
                      Coming Soon
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-slate-400">
            No projects found in this category.
          </p>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
