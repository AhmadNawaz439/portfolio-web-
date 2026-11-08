import type { Db } from "./types";

function sampleViews(): Record<string, number> {
  const views: Record<string, number> = {};
  const base = [32, 41, 38, 55, 47, 29, 24, 51, 63, 58, 72, 66, 44, 39];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    views[d.toISOString().slice(0, 10)] = base[13 - i];
  }
  return views;
}

// Placeholder content. Everything here can be edited from the dashboard.
export function seedDb(): Db {
  const now = new Date().toISOString();
  const skill = (id: string, category: string, name: string) => ({ id, name, category });
  return {
    profile: {
      name: "Ahmad Nawaz",
      role: "Web App Developer & UI/UX Designer",
      heroRoles: "UI/UX Designer\nWeb App\nDeveloper",
      tagline:
        "I design and build web apps that look clean, feel simple and work fast — from the first Figma sketch to the final live product.",
      aboutTag: "CS Student.",
      bio: "I'm a Computer Science student who designs and builds web apps. My studies give me a solid base in programming, data structures, algorithms and databases — and I use it to turn ideas into clean interfaces in Figma, then into fast, working products with React and Next.js.",
      quote:
        "Computer Science taught me how things work. Design taught me how they should feel. I bring both into everything I build.",
      photoUrl: "/ahmad-portrait.png",
      aboutPhotoUrl: "/ahmad-about.jpg",
      location: "Multan, Pakistan",
      email: "relentless.ahmad439@gmail.com",
      github: "https://github.com/AhmadNawaz439",
      linkedin: "https://www.linkedin.com/in/ahmadnawazdev",
      twitter: "",
      instagram: "",
      resumeUrl: "",
      available: true,
      yearsExperience: 0,
      footerText: "Designing and building web apps people enjoy using.",
    },
    highlights: [
      { title: "Computer Science", text: "Strong foundations in programming, data structures and algorithms." },
      { title: "UI / UX Design", text: "Wireframes and Figma prototypes built around real users." },
      { title: "Web App Development", text: "Fast, responsive web apps with React, Next.js and Node.js." },
      { title: "Problem Solving", text: "Breaking complex problems into simple, working solutions." },
    ],
    languages: [
      { name: "Urdu", level: "Native", percent: 100 },
      { name: "English", level: "Professional", percent: 85 },
    ],
    skills: [
      skill("s21", "Programming Languages", "Python"),
      skill("s8", "Programming Languages", "JavaScript"),
      skill("s9", "Programming Languages", "TypeScript"),
      skill("s1", "UI/UX Design", "Figma"),
      skill("s2", "UI/UX Design", "Wireframing"),
      skill("s3", "UI/UX Design", "Prototyping"),
      skill("s4", "UI/UX Design", "User Research"),
      skill("s5", "UI/UX Design", "Design Systems"),
      skill("s6", "Frontend Development", "HTML"),
      skill("s7", "Frontend Development", "CSS"),
      skill("s10", "Frontend Development", "React"),
      skill("s11", "Frontend Development", "Next.js"),
      skill("s12", "Frontend Development", "Tailwind CSS"),
      skill("s13", "Backend & Databases", "Node.js"),
      skill("s14", "Backend & Databases", "Express"),
      skill("s15", "Backend & Databases", "PostgreSQL"),
      skill("s16", "Backend & Databases", "MongoDB"),
      skill("s17", "Version Control", "Git"),
      skill("s18", "Version Control", "GitHub"),
      skill("s19", "Tools & Deployment", "VS Code"),
      skill("s20", "Tools & Deployment", "Vercel"),
    ],
    projects: [
      {
        id: "p1",
        title: "Your Best Web App",
        description:
          "[The problem it solves and who it's for.] I designed the full user flow in Figma, then built it with Next.js and Node.js. [The result — users, feedback, speed or an award.]",
        tags: ["Figma", "Next.js", "Node.js", "PostgreSQL"],
        imageUrl: "",
        githubUrl: "https://github.com/",
        liveUrl: "https://example.com",
        featured: true,
        createdAt: now,
      },
      {
        id: "p2",
        title: "UI/UX Case Study",
        description:
          "[An app or website you redesigned.] I researched what confused users, created wireframes and a clickable prototype, and tested it with real people. [What improved.]",
        tags: ["Figma", "User Research", "Prototyping"],
        imageUrl: "",
        githubUrl: "https://github.com/",
        liveUrl: "",
        featured: true,
        createdAt: now,
      },
      {
        id: "p3",
        title: "Design System",
        description:
          "[A component library you built.] Reusable, accessible components designed in Figma and coded in React, so new pages stay consistent and quick to build.",
        tags: ["Figma", "React", "Tailwind CSS"],
        imageUrl: "",
        githubUrl: "https://github.com/",
        liveUrl: "",
        featured: false,
        createdAt: now,
      },
      {
        id: "p4",
        title: "Full-Stack Project",
        description:
          "[Another app you built end to end.] Login, database and a clean dashboard — designed and developed by me.",
        tags: ["React", "Express", "MongoDB"],
        imageUrl: "",
        githubUrl: "https://github.com/",
        liveUrl: "",
        featured: false,
        createdAt: now,
      },
    ],
    experience: [
      {
        id: "e1",
        type: "achievement",
        role: "Hackathon Finalist",
        company: "National Hackathon",
        period: "2025",
        description: "Competed at national level, building and pitching a working prototype.",
      },
      {
        id: "e2",
        type: "work",
        role: "Team Leadership",
        company: "College project",
        period: "2024",
        description: "Led a team of developers through design, task division and final deployment.",
      },
      {
        id: "e3",
        type: "achievement",
        role: "Event Management",
        company: "College fest",
        period: "2024",
        description: "Organised a major college event, managing teams, schedules and operations.",
      },
      {
        id: "e4",
        type: "education",
        role: "B.Tech Computer Science",
        company: "Your University",
        period: "2022 — 2026",
        description: "Specialising in AI/ML and software engineering.",
      },
    ],
    interests: [
      { title: "Poster Design", description: "Blending bold shapes and typography into striking visual posters.", imageUrl: "" },
      { title: "Chess", description: "Studying openings and long-term strategy over the board.", imageUrl: "" },
      { title: "Photography", description: "Capturing light, people and places around me.", imageUrl: "" },
      { title: "Music", description: "Listening, discovering and sometimes playing.", imageUrl: "" },
    ],
    messages: [],
    views: sampleViews(),
  };
}
