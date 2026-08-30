import { Reveal } from "@/components/reveal";
import { education } from "@/lib/education";

/**
 * Education — one row per qualification, period left, credential right.
 * Renders nothing while lib/education.ts is empty: an unpopulated section
 * must stay invisible, not apologise for itself (the "coming soon"
 * anti-pattern from docs/portfolio-gap-report.md).
 */
export function EducationSection() {
  if (education.length === 0) return null;

  return (
    <section aria-labelledby="education-heading" className="border-t border-line">
      <div className="shell grid gap-10 py-20 sm:py-24 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:py-32">
        <Reveal>
          <h2 id="education-heading" className="eyebrow">
            Education
          </h2>
        </Reveal>

        {/* Period left, credential right — same row rhythm as Experience so
            both histories scan the same way. The score stays plain muted
            text (not a chip) so the row reads as calm as its neighbour. */}
        <ul className="border-t border-line">
          {education.map((entry, index) => (
            <li key={`${entry.school}-${entry.period}`}>
              <Reveal delay={index * 80}>
                <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <span className="text-sm font-medium text-muted">
                    {entry.period}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-display">
                      {entry.degree}
                    </h3>
                    <p className="mt-1 text-muted">{entry.school}</p>
                    {entry.detail ? (
                      <p className="mt-2 text-muted">{entry.detail}</p>
                    ) : null}
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
