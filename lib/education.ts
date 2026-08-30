/**
 * One entry in the education history. Mirrors `Experience` on purpose so
 * both histories scan identically on the page: period left, credential
 * right. Kept small on purpose — one line per qualification, not a
 * transcript dump.
 */
export type Education = {
  /** Qualification earned, e.g. "B.Tech, Computer Science & Engineering". */
  degree: string;
  /** Institution that awarded it. */
  school: string;
  /**
   * Years attended as a display string, e.g. "2021 — 2025".
   * Free-form so unusual ranges never need date plumbing.
   */
  period: string;
  /** Optional final score or distinction, exactly as the resume states it. */
  detail?: string;
};

// Facts verified 2026-08-26 against docs/resume.md (the source of truth).
// No GPA conversion, no honors lines — the resume states only what's here.
export const education: Education[] = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    school: "Vellore Institute of Technology, Chennai",
    period: "2021 — 2025",
    detail: "83.5%",
  },
];
