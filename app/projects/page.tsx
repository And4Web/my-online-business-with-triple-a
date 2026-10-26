"use client";

import { useState } from "react";
import Link from "next/link";

import ProjectCard from "../components/ProjectCard";

import { projects } from "../lib/projects";


const categories = [
  "All Projects",
  "E-commerce",
  "Communication",
  "Productivity",
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  
// const filteredProjects = projects.filter((project) => {
//   const matchesCategory =
//     activeCategory === "All Projects" ||
//     project.category === activeCategory;

//   const searchText = searchQuery.trim().toLowerCase();

//   const matchesSearch =
//     project.title.toLowerCase().includes(searchText) ||
//     project.category.toLowerCase().includes(searchText) ||
//     project.description.toLowerCase().includes(searchText) ||
//     project.technologies.some((technology) =>
//   technology.toLowerCase().includes(searchQuery.toLowerCase())
// );

//   return matchesCategory && matchesSearch;
// });



const filteredProjects = projects
  .filter((project) => {
    const matchesCategory =
      activeCategory === "All Projects" ||
      project.category === activeCategory;

    const searchText = searchQuery.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.category.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.technologies.some((technology) =>
        technology.toLowerCase().includes(searchText)
      );

    return matchesCategory && matchesSearch;
  })
  .sort((a, b) => {
    if (sortOrder === "price-low") {
      return a.price - b.price;
    }

    if (sortOrder === "price-high") {
      return b.price - a.price;
    }

    return 0;
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

        
    
<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
  <label
    htmlFor="sortOrder"
    className="text-sm font-medium text-slate-300"
  >
    Sort by price
  </label>

  <select
    id="sortOrder"
    value={sortOrder}
    onChange={(event) => setSortOrder(event.target.value)}
    className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500"
  >
    <option value="default">Default order</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
  </select>
<button
  type="button"
  onClick={() => {
    setSearchQuery("");
    setActiveCategory("All Projects");
    setSortOrder("default");
  }}
  className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-blue-400"
>
  Clear Filters
</button>
</div>





        {filteredProjects.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
  <ProjectCard key={project.slug} project={project} />
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
