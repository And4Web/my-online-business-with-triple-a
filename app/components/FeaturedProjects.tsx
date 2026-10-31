
import { connection } from "next/server";
import dbConnect from "../lib/mongodb";
import Product from "../lib/models/Product";
import type { Project } from "../lib/projects";
import ProjectCard from "./ProjectCard";

export default async function FeaturedProjects() {
  await connection();

  let projects: Project[] = [];
  let productsLoadFailed = false;

  try {
    await dbConnect();

    const products = await Product.find({
      status: { $in: ["active", "coming-soon"] },
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    projects = products.map((product) => ({
      slug: product.slug,
      title: product.title,
      category: product.category,
      description: product.description,
      technologies: product.technologies,
      price: product.price,
      color: product.color,
      features: product.features,
      imageUrl: product.imageUrl ?? "",
      href: `/projects/${product.slug}`,
    }));
  } catch (error) {
    console.error("Homepage products failed to load:", error);
    productsLoadFailed = true;
  }

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 pb-24">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            The marketplace
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Featured Projects
          </h2>

          <p className="mt-3 text-slate-400">
            Explore our current project listings and find a starting
            point for your next idea.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          {projects.length}{" "}
          {projects.length === 1 ? "project" : "projects"} listed
        </p>
      </div>

      {productsLoadFailed ? (
        <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          Our project catalog is temporarily unavailable. Please try
          again later.
        </p>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
          No projects are listed yet. Please check back soon.
        </p>
      )}
    </section>
  );
}
