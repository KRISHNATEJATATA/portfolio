import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { KineticHero } from "@/components/kinetic-hero";
import { ContactForm } from "@/components/contact-form";
import { SkillsSection } from "@/components/skills-section";
import { ExperienceSection } from "@/components/experience-section";
import { EducationSection } from "@/components/education-section";
import { getFeaturedProjects } from "@/lib/projects";

const EMAIL = "tejakrishnatata@gmail.com";

// Inlined at build time. Unset → the section renders the mailto CTA card
// instead of the form, so prod stays clean until the Apps Script is deployed.
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      {/* Hero — kinetic entrance timed to the site intro (components/kinetic-hero.tsx).
          Replaces the previous Reveal wrappers so the two entrance systems never stack. */}
      <section className="shell pb-24 pt-20 sm:pt-28 lg:pb-32 lg:pt-36">
        <KineticHero
          nameLines={[
            { text: "Krishna Teja" },
            { text: "Backend Engineer", hl: true },
          ]}
          tagline="Building event-driven data platforms in Python on AWS."
        >
          <Link href="/projects" className="btn btn-primary">
            View Projects
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <a href="#contact" className="btn btn-outline">
            <Mail size={16} aria-hidden="true" />
            Get in Touch
          </a>
        </KineticHero>

        {/* Without scripting the kinetic hidden states never clear on their
            own — force the hero fully visible (mirrors the .reveal noscript
            override in app/layout.tsx). */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-kh-char],[data-kh-fade]{opacity:1 !important;transform:none !important}",
            }}
          />
        </noscript>
      </section>

      {/* About */}
      <section aria-labelledby="about-heading" className="border-t border-line">
        <div className="shell grid gap-10 py-20 sm:py-24 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:py-32">
          <Reveal>
            <h2 id="about-heading" className="eyebrow">
              About
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="max-w-[65ch] space-y-6 text-lg text-muted">
              <p>
                I&rsquo;m Krishna Teja, a software consultant at Encora
                Digital (a Coforge company), building the recommendation
                platform for Avid Content Core &mdash; event-driven pipelines
                that turn user activity into personalized recommendations.
              </p>
              <p>
                My work lives mostly in Python and AWS: Kafka and Kinesis
                ingestion, Snowflake-backed batch scoring, and FastAPI services
                serving results over Valkey and PostgreSQL. I care about tools
                that work quietly and well.
              </p>
              <p>
                Want the details? The{" "}
                <Link href="/projects" className="link">
                  projects
                </Link>{" "}
                speak for themselves &mdash; or just{" "}
                <a href={`mailto:${EMAIL}`} className="link">
                  email me
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills — grouped capability lists, data-driven from lib/skills.ts
          (closes docs/portfolio-gap-report.md item 4). */}
      <SkillsSection />

      {/* Experience — renders nothing until roles exist in lib/experience.ts
          (closes docs/portfolio-gap-report.md item 5). */}
      <ExperienceSection />

      {/* Education — sourced from docs/resume.md, data in lib/education.ts. */}
      <EducationSection />

      {/* Featured projects */}
      <section
        aria-labelledby="featured-heading"
        className="border-t border-line"
      >
        <div className="shell py-20 sm:py-24 lg:py-32">
          <Reveal>
            <h2 id="featured-heading" className="eyebrow">
              Selected work
            </h2>
          </Reveal>

          <ul className="mt-12 border-t border-line">
            {featured.map((project, index) => (
              <li key={project.slug}>
                <Reveal delay={index * 80}>
                  {/* Hover/focus treatment: amber wash sweeps in from the left
                      (scaleX, origin-left), year + tagline drift a few px, and
                      the arrow nudge is absorbed into a longer slide. Every
                      moving part is transform/opacity only, 300ms on a cubic
                      ease, gated behind motion-safe, and mirrored 1:1 under
                      :focus-visible for keyboard parity. The sweep sits at -z-10
                      inside an isolated stacking context so text stays above it;
                      contrast (ink/muted/accent on the tinted wash) stays WCAG AA. */}
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group relative isolate grid gap-3 border-b border-line py-8 transition-colors sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:gap-8"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 bg-accent/10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-focus-visible:scale-x-100 motion-safe:group-hover:scale-x-100"
                    />
                    <span className="text-sm font-medium text-muted transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-focus-visible:translate-x-1 motion-safe:group-hover:translate-x-1">
                      {project.year}
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-semibold tracking-display transition-colors group-focus-visible:text-accent group-hover:text-accent sm:text-3xl">
                        {project.name}
                      </span>
                      <span className="mt-1 block text-muted transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-focus-visible:translate-x-1 motion-safe:group-hover:translate-x-1">
                        {project.tagline}
                      </span>
                    </span>
                    <ArrowRight
                      size={22}
                      aria-hidden="true"
                      className="hidden text-muted transition-[translate,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-visible:text-accent group-hover:text-accent motion-safe:group-focus-visible:translate-x-1.5 motion-safe:group-hover:translate-x-1.5 sm:block"
                    />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <Reveal delay={160}>
            <Link
              href="/projects"
              className="mt-10 inline-flex items-center gap-2 font-medium text-accent transition-colors hover:text-accent-strong"
            >
              All projects
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Contact strip */}
      <section
        id="contact"
        tabIndex={-1}
        aria-labelledby="contact-heading"
        className="border-t border-line bg-surface scroll-mt-16 focus:outline-none"
      >
        <div className="shell grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-16 lg:py-28">
          <Reveal>
            <h2
              id="contact-heading"
              className="font-display text-3xl font-semibold tracking-display sm:text-4xl"
            >
              Have something worth building?
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted">
              Tell me what you&rsquo;re working on or where you could use a
              hand. I read everything myself.
            </p>
            <p className="mt-6 text-muted">
              Prefer email? Write to me directly at{" "}
              <a href={`mailto:${EMAIL}`} className="link">
                {EMAIL}
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={120}>
            {CONTACT_ENDPOINT ? (
              <ContactForm endpoint={CONTACT_ENDPOINT} />
            ) : (
              <div className="rounded-xl border border-line bg-background p-8 sm:p-10">
                <p className="text-lg text-muted">
                  The fastest way to reach me is plain email. I read all of it.
                </p>
                <a href={`mailto:${EMAIL}`} className="btn btn-primary mt-8">
                  <Mail size={16} aria-hidden="true" />
                  {EMAIL}
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
