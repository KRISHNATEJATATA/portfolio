import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected projects by Krishna Teja — embedded C++, AWS data pipelines, generative AI experiments, and web experiments.",
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
          Things I&rsquo;ve built across the stack &mdash; devices, data
          pipelines, and a few experiments in between.
        </p>
      </Reveal>

      <ul className="mt-14 grid gap-6 sm:grid-cols-2">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={(index % 2) * 100} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
