import { Reveal } from "@/components/reveal";
import { experiences } from "@/lib/experience";

/**
 * Experience — recent roles, one impact line each. Renders nothing while
 * lib/experience.ts is empty: an unpopulated section must stay invisible,
 * not apologise for itself (the "coming soon" anti-pattern from
 * docs/portfolio-gap-report.md).
 */
export function ExperienceSection() {
  if (experiences.length === 0) return null;

  return (
    <section
      aria-labelledby="experience-heading"
      className="border-t border-line"
    >
      <div className="shell grid gap-10 py-20 sm:py-24 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:py-32">
        <Reveal>
          <h2 id="experience-heading" className="eyebrow">
            Experience
          </h2>
        </Reveal>

        {/* Period left, story right — mirrors the year/name rows of the
            Selected-work list so both histories scan the same way. */}
        <ul className="border-t border-line">
          {experiences.map((job, index) => (
            <li key={`${job.org}-${job.period}`}>
              <Reveal delay={index * 80}>
                <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <span className="text-sm font-medium text-muted">
                    {job.period}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-display">
                      {job.url ? (
                        <a
                          href={job.url}
                          className="transition-colors hover:text-accent focus-visible:text-accent"
                        >
                          {job.role}
                        </a>
                      ) : (
                        job.role
                      )}
                    </h3>
                    <p className="mt-1 text-muted">{job.org}</p>
                    <p className="mt-2 max-w-[65ch] text-muted">
                      {job.summary}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
