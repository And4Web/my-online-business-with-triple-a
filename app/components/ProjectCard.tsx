
import Link from "next/link";
import Image from "next/image";
import type { Project } from "../lib/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20">

      {/* Product Preview */}
      <div className="relative flex h-48 items-center justify-center overflow-hidden bg-linear-to-br from-slate-800 via-slate-900 to-blue-950">

        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)]" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-400/20 bg-slate-950/70 shadow-2xl transition duration-300 group-hover:scale-110">
              <span className="text-4xl font-bold text-blue-400">
                {project.title.charAt(0).toUpperCase()}
              </span>
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute bottom-4 left-4 z-10">
          <span className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur">
            Nexora Project
          </span>
        </div>

        {!project.href && (
          <span className="absolute right-4 top-4 z-10 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            Coming Soon
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
            {project.category}
          </span>

          <span className="text-xs font-medium text-slate-500">
            Source Code
          </span>
        </div>

        <h2 className="mt-5 text-xl font-bold text-white transition group-hover:text-blue-300">
          {project.title}
        </h2>

        <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Built With
          </p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <div>
            <p className="text-xs text-slate-500">Starting at</p>
            <p className="mt-1 text-2xl font-extrabold text-white">
              ${project.price}
            </p>
          </div>

          {project.href ? (
            <Link
              href={project.href}
              className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              View Details →
            </Link>
          ) : (
            <span className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-400">
              Not Available
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
