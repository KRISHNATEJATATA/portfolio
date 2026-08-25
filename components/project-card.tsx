import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/60 sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-semibold tracking-display text-ink transition-colors group-hover:text-accent">
          {project.name}
        </h3>
        <span className="text-sm font-medium text-muted">{project.year}</span>
      </div>

      <p className="mt-3 text-muted">{project.tagline}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-6" aria-label="Tech stack">
        {project.stack.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>
    </Link>
  );
}
