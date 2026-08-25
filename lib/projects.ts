export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string[];
  stack: string[];
  year: number;
  sourceUrl: string;
  demoUrl: string | null;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "smart-pill-box",
    name: "IoT Smart Pill Box",
    tagline: "A C++ embedded medication reminder that blinks when a dose is due.",
    description: [
      "A small connected device that helps keep medication schedules honest. Built in C++ on microcontroller hardware, it watches the clock and lights up when it's time for a dose — no app, no account, just a box that does one job.",
      "The interesting parts were the constraints: working within limited memory and power, debouncing real-world hardware, and making sure reminder state survives a power cycle.",
    ],
    stack: ["C++", "Embedded", "IoT"],
    year: 2024,
    sourceUrl: "https://github.com/KRISHNATEJATATA/Smart-pill-box",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "aws-etl",
    name: "AWS ETL Pipeline",
    tagline: "Python data pipeline on AWS that moves real data from raw to useful.",
    description: [
      "A Python ETL pipeline running on AWS: pull raw data in, transform it into something trustworthy, and land it where it can actually be queried. Built to learn cloud data engineering end to end rather than stopping at a tutorial.",
      "It covers the unglamorous parts that make pipelines real — scheduling runs, handling failures without duplicating data, and keeping storage costs sane.",
    ],
    stack: ["Python", "AWS", "ETL"],
    year: 2025,
    sourceUrl: "https://github.com/KRISHNATEJATATA/aws_etl",
    demoUrl: null,
    featured: true,
  },
  {
    slug: "generative-ai",
    name: "Generative AI Experiments",
    tagline: "Small experiments to understand what generative models actually do well.",
    description: [
      "A workshop of experiments with generative AI: prompt patterns, structured outputs, and small tools built while figuring out where these models genuinely help and where they don't.",
      "Each experiment is deliberately small — the goal is understanding, not a product.",
    ],
    stack: ["Python", "GenAI"],
    year: 2025,
    sourceUrl: "https://github.com/KRISHNATEJATATA/Generative-Ai",
    demoUrl: null,
    featured: false,
  },
  {
    slug: "pokedex",
    name: "Pokedex",
    tagline: "A data-driven web experiment in consuming an API cleanly.",
    description: [
      "A Pokedex interface built as a web experiment: fetch from a public API, render large lists without jank, and make search feel instant.",
      "A small project on purpose — it was about practicing fundamentals like state, caching, and list performance.",
    ],
    stack: ["JavaScript", "Web", "REST API"],
    year: 2023,
    sourceUrl: "https://github.com/KRISHNATEJATATA/Pokedex",
    demoUrl: null,
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((project) => project.featured);
}
