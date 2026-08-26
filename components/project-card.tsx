import Link from "next/link";

import { ProjectMedia } from "@/components/project-media";
import type { Project, ProjectImage } from "@/lib/projects";

const CARD_SIZES = "(min-width: 640px) 514px, calc(100vw - 3rem)";

export function ProjectCard({
  project,
  media,
  index,
}: {
  project: Project;
  /** Resolved cover image, or null for the typographic fallback. */
  media: ProjectImage | null;
  /** Zero-based position in the projects list. */
  index: number;
}) {
  // Only the first card is a plausible above-the-fold LCP candidate.
  const preload = index === 0 && media !== null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-300 hover:border-accent/60"
    >
      <ProjectMedia
        media={media}
        index={index}
        sizes={CARD_SIZES}
        preload={preload}
        size="card"
        className="border-b border-line transition-colors duration-300 group-hover:border-accent/60"
      />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
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
      </div>
    </Link>
  );
}
