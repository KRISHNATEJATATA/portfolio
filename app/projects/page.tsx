import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { resolveProjectImage } from "@/lib/project-media";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Krishna Teja — event-driven pipelines, cloud data infrastructure, and backend systems built with Python and AWS.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <section className="shell py-20 sm:py-24 lg:py-32">
      <Reveal>
        <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-tight tracking-display">
          Projects
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg text-muted">
          Backend systems and event-driven data pipelines &mdash; plus a few
          experiments along the way.
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={(index % 2) * 100} className="h-full">
              {/* TODO(owner): to give a project a cover image, drop
                  public/projects/{slug}.webp plus a one-line
                  public/projects/{slug}.alt.txt (see public/projects/README.md),
                  or set the optional `image` field in lib/projects.ts. */}
              <ProjectCard
                project={project}
                media={resolveProjectImage(project)}
                index={index}
              />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
