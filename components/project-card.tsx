import Link from "next/link";

import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  /** Zero-based position in the projects list; drives the index tick. */
  index: number;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-accent/60 sm:p-8"
    >
      {/* Corner glow: amber wash bleeding in from the top-left, brightens on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 0% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <span
            className="font-display text-3xl font-semibold tracking-display text-accent transition-colors group-hover:text-ink"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-accent" aria-hidden="true">
            |
          </span>
          <h3 className="font-display text-xl font-semibold tracking-display text-ink transition-colors group-hover:text-accent">
            {project.name}
          </h3>
        </div>
        <span className="text-sm font-medium text-muted">{project.year}</span>
      </div>

      <p className="relative mt-3 text-muted">{project.tagline}</p>

      <ul
        className="relative mt-auto flex flex-wrap gap-2 pt-6"
        aria-label="Tech stack"
      >
        {project.stack.map((item) => (
          <li key={item} className="chip">
            {item}
          </li>
        ))}
      </ul>
    </Link>
  );
}
