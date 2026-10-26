
import Link from "next/link";
import type { Project } from "../lib/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/50">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
          {project.category}
        </span>

        {!project.href && (
          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400">
            Coming Soon
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-bold text-white">
        {project.title}
      </h2>

      <p className="mt-3 flex-1 text-sm leading-7 text-slate-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.technologies.map((technology) => (
          <span
            key={technology}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-5">
        <p className="text-2xl font-extrabold text-white">
          ${project.price}
        </p>

        {project.href ? (
          <Link
            href={project.href}
            className="rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            View Details →
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-400">
            Not Available Yet
          </span>
        )}
      </div>
    </article>
  );
}
