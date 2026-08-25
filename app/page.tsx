import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";
import { getFeaturedProjects } from "@/lib/projects";

const EMAIL = "tejakrishnatata@gmail.com";

// Inlined at build time. Unset → the section renders the mailto CTA card
// instead of the form, so prod stays clean until the Apps Script is deployed.
const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      {/* Hero */}
      <section className="shell pb-24 pt-20 sm:pt-28 lg:pb-32 lg:pt-36">
        <Reveal>
          <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.05] tracking-display">
            Krishna Teja
            <br />
            <span className="hl">Software Engineer</span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-lg text-muted sm:text-xl">
            Building across data, AI, and devices.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/projects" className="btn btn-primary">
              View Projects
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a href="#contact" className="btn btn-outline">
              <Mail size={16} aria-hidden="true" />
              Get in Touch
            </a>
          </div>
        </Reveal>
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
                I&rsquo;m Krishna Teja, a software engineer who likes building
                across the whole stack &mdash; from AWS ETL pipelines that move
                real data, to generative AI experiments, to an IoT smart pill
                box that blinks at you in C++.
              </p>
              <p>
                I care about tools that work quietly and well. When I&rsquo;m
                not shipping, I&rsquo;m sharpening problem-solving on LeetCode
                or tinkering with whatever technology caught my attention that
                week.
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
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group grid gap-3 border-b border-line py-8 transition-colors sm:grid-cols-[6rem_1fr_auto] sm:items-center sm:gap-8"
                  >
                    <span className="text-sm font-medium text-muted">
                      {project.year}
                    </span>
                    <span>
                      <span className="block font-display text-2xl font-semibold tracking-display transition-colors group-hover:text-accent sm:text-3xl">
                        {project.name}
                      </span>
                      <span className="mt-1 block text-muted">
                        {project.tagline}
                      </span>
                    </span>
                    <ArrowRight
                      size={22}
                      aria-hidden="true"
                      className="hidden text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent sm:block"
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
