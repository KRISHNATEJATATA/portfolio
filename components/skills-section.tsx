import { Reveal } from "@/components/reveal";
import { skillGroups } from "@/lib/skills";

/**
 * Skills — grouped capability lists, no proficiency theatrics. Server
 * component; all motion lives in the shared Reveal leaf so this file stays
 * renderable on the server.
 */
export function SkillsSection() {
  return (
    <section aria-labelledby="skills-heading" className="border-t border-line">
      <div className="shell grid gap-10 py-20 sm:py-24 lg:grid-cols-[14rem_1fr] lg:gap-16 lg:py-32">
        <Reveal>
          <h2 id="skills-heading" className="eyebrow">
            Skills
          </h2>
        </Reveal>

        <div>
          <Reveal delay={100}>
            <p className="max-w-[65ch] text-lg text-muted">
              What I build with, grouped by where it shows up in my work.
            </p>
          </Reveal>

          {/* Same bordered-row rhythm as the Selected-work list, so the two
              inventory sections read as one family. Rows are plain lists —
              the grouping is the message, not any ranking within it. */}
          <ul className="mt-12 border-t border-line">
            {skillGroups.map((group, index) => (
              <li key={group.domain}>
                <Reveal delay={index * 80}>
                  <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-8">
                    <h3 className="font-display text-xl font-semibold tracking-display text-ink">
                      {group.domain}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <span className="chip">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
