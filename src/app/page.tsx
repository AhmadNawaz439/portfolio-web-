import { Suspense, type ComponentType, type SVGProps } from "react";
import { getData } from "@/lib/db";
import Navbar from "@/components/site/Navbar";
import ContactForm from "@/components/site/ContactForm";
import ViewTracker from "@/components/site/ViewTracker";
import SmoothScroll from "@/components/site/SmoothScroll";
import AnimatedBackground from "@/components/site/AnimatedBackground";
import MouseParallax from "@/components/site/MouseParallax";
import ExpandingCards from "@/components/site/ExpandingCards";
import Reveal from "@/components/site/Reveal";
import ProjectCaseStudies from "@/components/site/ProjectCaseStudies";
import { SITE_URL } from "@/lib/site";
import {
  ArrowUpRightIcon,
  BrainIcon,
  CodeIcon,
  FolderIcon,
  GithubIcon,
  GlobeIcon,
  GradCapIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  MapPinIcon,
  PenIcon,
  SparkIcon,
  VideoIcon,
  WhatsappIcon,
  XIcon,
} from "@/components/icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export default function Home() {
  return (
    <Suspense fallback={<div className="site min-h-screen" />}>
      <Portfolio />
    </Suspense>
  );
}


const highlightIcons: Icon[] = [GradCapIcon, PenIcon, CodeIcon, BrainIcon, VideoIcon];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mb-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h2>
    </Reveal>
  );
}

/** PNG/WebP photos are treated as cut-outs (transparent background); others get a frame. */
const isCutout = (src: string) => /\.(png|webp)$/i.test(src);

function FramedPhoto({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-[var(--blue)]/40 shadow-[0_0_80px_rgba(51,102,255,0.3)] ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-full w-full object-cover object-top" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#3366ff]/10" />
    </div>
  );
}

function Photo({ src, name, className = "" }: { src: string; name: string; className?: string }) {
  if (src && !isCutout(src)) return <FramedPhoto src={src} name={name} className={className} />;
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={className.includes("object-") ? className : `object-cover object-top ${className}`}
      />
    );
  }
  // Placeholder until a photo is added in the dashboard.
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden
      className={`grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#1d2b66,#0a0d1f_60%,transparent_75%)] ${className}`}
    >
      <span className="text-7xl font-black text-white/10 sm:text-9xl">{initials}</span>
    </div>
  );
}

async function Portfolio() {
  const { profile, skills, projects, highlights, languages, interests } = await getData();

  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");
  const heroRoles = profile.heroRoles.split("\n").map((r) => r.trim()).filter(Boolean);
  // Development projects first, video editing projects after; featured first within each.
  const orderedProjects = [...projects].sort(
    (a, b) => Number(Boolean(a.videoUrl)) - Number(Boolean(b.videoUrl)) || Number(b.featured) - Number(a.featured),
  );

  const stats = [
    { value: `${projects.length}+`, label: "Projects" },
    // Hidden until years of coding is set in the dashboard.
    ...(profile.yearsExperience > 0 ? [{ value: `${profile.yearsExperience}+`, label: "Years coding" }] : []),
    { value: `${skills.length}+`, label: "Technologies" },
  ];

  // WhatsApp chat link with a ready-made first message.
  const waDigits = (profile.whatsapp || "").replace(/\D/g, "");
  const waLink = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        `Hi ${profile.name.split(" ")[0]}, I saw your portfolio and would like to talk with you.`,
      )}`
    : "";

  const socials = [
    { href: profile.github, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: profile.twitter, label: "X / Twitter", Icon: XIcon },
  ].filter((s) => s.href);

  // Structured data that tells Google who this site is about.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.tagline,
    url: SITE_URL,
    ...(profile.photoUrl ? { image: `${SITE_URL}${profile.photoUrl}` } : {}),
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Multan", addressCountry: "PK" },
    knowsAbout: skills.map((s) => s.name),
    sameAs: socials.map((s) => s.href),
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${profile.name} Portfolio`,
    url: SITE_URL,
  };

  return (
    <div className="site relative isolate flex-1 overflow-x-clip">
      <AnimatedBackground />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personSchema, websiteSchema]).replace(/</g, "\\u003c"),
        }}
      />
      <ViewTracker />
      <SmoothScroll />
      <Navbar name={profile.name} resumeUrl={profile.resumeUrl} />

      {/* Decorative glowing squares */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <span className="glow-box right-[-5%] top-[24%] h-48 w-48" />
        <span className="glow-box left-[-2%] top-[40%] h-56 w-36" />
        <span className="glow-box right-[-1%] top-[66%] h-56 w-44" />
        <span className="glow-box left-[-1%] top-[78%] h-64 w-40" />
      </div>

      <main>
        {/* ---------- Hero ---------- */}
        <section id="home" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-16">
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)]/15 blur-[120px]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[42%] -z-10 h-[420px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)]/25 blur-[90px]"
          />
          <div
            aria-hidden
            className="outline-text pointer-events-none absolute left-1/2 top-[40%] -z-10 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[22vw] font-black uppercase leading-none tracking-tight md:left-[62%] md:text-[10.5vw]"
          >
            <MouseParallax move={-40}>Portfolio</MouseParallax>
          </div>

          {/* Photo */}
          {profile.photoUrl && !isCutout(profile.photoUrl) ? (
            <div className="absolute bottom-24 left-1/2 -z-10 h-[46%] w-[72%] max-w-xs -translate-x-1/2 opacity-30 lg:bottom-auto lg:left-[55%] lg:top-1/2 lg:h-[60%] lg:w-[24%] lg:max-w-[300px] lg:-translate-y-[45%] lg:opacity-100">
              <FramedPhoto src={profile.photoUrl} name={profile.name} className="h-full w-full" />
            </div>
          ) : (
            <div className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[62%] w-full max-w-md [mask-image:linear-gradient(to_bottom,black_60%,transparent_95%)] md:h-[86%] md:max-w-[720px]">
              <MouseParallax move={18} tilt={9} className="h-full w-full origin-bottom">
                <Photo
                  src={profile.photoUrl}
                  name={profile.name}
                  className="h-full w-full object-contain object-bottom opacity-50 drop-shadow-[0_0_40px_rgba(51,102,255,0.35)] md:opacity-100"
                />
              </MouseParallax>
            </div>
          )}

          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-28 sm:px-6 md:min-h-[72vh] md:grid-cols-2">
            <div className="fade-up relative z-10 max-w-xl self-center">
              <p className="text-5xl leading-none sm:text-6xl lg:text-[4.25rem]">
                <span className="font-black text-white">Hi</span>{" "}
                <span className="font-extralight text-zinc-300">I&apos;m</span>
              </p>
              <h1 className="mt-3 leading-[0.9]">
                <span className="block text-6xl font-black tracking-tight text-[var(--blue)] drop-shadow-[0_0_35px_rgba(51,102,255,0.5)] sm:text-8xl lg:text-[7.25rem]">
                  {firstName}
                </span>{" "}
                {lastName && (
                  <span className="mt-4 block text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                    {lastName}
                  </span>
                )}
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-zinc-300 lg:text-lg">{profile.tagline}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[var(--blue)] hover:bg-[var(--blue)]/15"
                  >
                    <ArrowUpRightIcon width={17} height={17} /> View Resume
                  </a>
                )}
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-[var(--blue)] hover:bg-[var(--blue)]/15"
                >
                  <FolderIcon width={17} height={17} /> View Projects
                </a>
              </div>
            </div>

            {heroRoles.length > 0 && (
              <div className="fade-up relative z-10 self-end text-right [animation-delay:200ms] md:pb-6">
                <p className="text-xl font-extrabold uppercase tracking-wide text-[var(--blue)] sm:text-2xl lg:text-3xl">
                  {heroRoles[0]}
                </p>
                {heroRoles.slice(1).map((r) => (
                  <p key={r} className="text-4xl font-black uppercase leading-[0.92] text-white sm:text-5xl lg:text-6xl">
                    {r}
                  </p>
                ))}
              </div>
            )}
          </div>

          <a
            href="#about"
            className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white"
          >
            <span className="flex h-9 w-6 justify-center rounded-full border border-white/30 pt-2">
              <span className="scroll-dot h-2 w-0.5 rounded-full bg-white" />
            </span>
            Scroll down
          </a>
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="relative scroll-mt-16 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div>
              <Reveal className="flex items-start justify-between gap-4">
                <h2 className="text-6xl font-black leading-[0.9] text-white sm:text-7xl">
                  ABOUT
                  <span className="block text-[var(--blue)]">ME.</span>
                </h2>
                {profile.aboutTag && (
                  <span className="mt-2 border-b border-white/30 pb-1 text-sm text-zinc-300">{profile.aboutTag}</span>
                )}
              </Reveal>

              <Reveal delay={100}>
                <p className="mt-8 max-w-4xl text-base leading-relaxed text-zinc-300 lg:text-lg">{profile.bio}</p>
              </Reveal>

              {highlights.length > 0 && (
                <Reveal delay={150} className={`mt-10 grid grid-cols-2 gap-4 ${highlights.length === 5 ? "sm:grid-cols-6 lg:grid-cols-5" : "sm:grid-cols-4"}`}>
                  {highlights.map((h, i) => {
                    const Icon = highlightIcons[i % highlightIcons.length];
                    // With 5 boxes: 3 on the first row and 2 wider ones on the second, so no box sits alone.
                    const span =
                      highlights.length === 5
                        ? `${i < 3 ? "sm:col-span-2" : "sm:col-span-3"} lg:col-span-1 ${i === 4 ? "col-span-2 sm:col-span-3" : ""}`
                        : "";
                    return (
                      <div key={h.title} className={`panel p-5 transition hover:border-[var(--blue)]/40 ${span}`}>
                        <Icon width={20} height={20} className="text-[var(--blue)]" />
                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white">{h.title}</p>
                        <p className="mt-1.5 text-xs leading-snug text-zinc-400">{h.text}</p>
                      </div>
                    );
                  })}
                </Reveal>
              )}

              {profile.quote && (
                <Reveal delay={200}>
                  <blockquote className="panel relative mt-6 border-l-2 border-l-[var(--blue)] p-5 pl-12 text-sm italic leading-relaxed text-zinc-300">
                    <span aria-hidden className="absolute left-4 top-3 text-3xl font-black not-italic text-[var(--blue)]">
                      &ldquo;
                    </span>
                    {profile.quote}
                  </blockquote>
                </Reveal>
              )}

              {/* Stats on the left, languages on the right */}
              <Reveal delay={250} className="panel mt-8 grid gap-8 p-6 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div className="flex flex-wrap gap-x-10 gap-y-6">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-4xl font-bold leading-none text-[var(--blue)]">{s.value}</p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">{s.label}</p>
                    </div>
                  ))}
                </div>

                {languages.length > 0 && (
                  <>
                    <span aria-hidden className="hidden h-16 w-px bg-white/10 sm:block" />
                    <div>
                      <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
                        <GlobeIcon width={13} height={13} className="text-[var(--blue)]" /> Languages
                      </p>
                      <ul className="mt-3 space-y-2.5">
                        {languages.map((l) => {
                          const filled = Math.max(1, Math.round(l.percent / 20));
                          return (
                            <li key={l.name} className="flex items-center gap-6" title={l.level}>
                              <span className="w-16 text-sm font-semibold text-white">{l.name}</span>
                              <span className="flex gap-1.5" aria-label={`${l.level}, ${filled} out of 5`}>
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${
                                      i < filled
                                        ? "bg-[var(--blue)] shadow-[0_0_8px_rgba(51,102,255,0.7)]"
                                        : "bg-white/15"
                                    }`}
                                  />
                                ))}
                              </span>
                              <span className="text-[10px] uppercase tracking-widest text-zinc-500">{l.level}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Projects ---------- */}
        <section id="projects" className="relative scroll-mt-16 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle eyebrow="Creative works" title="Featured Projects" />
            <Reveal>
              <ProjectCaseStudies projects={orderedProjects} />
            </Reveal>
          </div>
        </section>

        {/* ---------- Interests ---------- */}
        {interests.length > 0 && (
          <section id="interests" className="relative scroll-mt-16 py-24">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <SectionTitle eyebrow="My passions" title="Beyond The Code" />
              <Reveal>
                <ExpandingCards
                  tone="warm"
                  items={interests.map((it, i) => ({
                    id: String(i),
                    title: it.title,
                    description: it.description,
                    imageUrl: it.imageUrl,
                  }))}
                />
              </Reveal>
            </div>
          </section>
        )}

        {/* ---------- Contact ---------- */}
        <section id="contact" className="relative scroll-mt-16 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionTitle eyebrow="Let's collaborate" title="Get In Touch" />
            <div className="grid gap-10 md:grid-cols-2">
              <Reveal>
                <h3 className="text-lg font-bold text-white">Let&apos;s start a conversation</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                  {profile.available
                    ? "I'm currently open to internships, full-time positions and collaborative freelance projects. "
                    : ""}
                  Whether you want to discuss a new project idea, talk tech, or just say hello, drop me a message!
                </p>
                <div className="mt-8 space-y-3">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="panel flex items-center gap-4 p-4 transition hover:border-[var(--blue)]/40"
                    >
                      <MailIcon className="text-[var(--blue)]" />
                      <span>
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Email me at</span>
                        <span className="text-sm font-medium text-white">{profile.email}</span>
                      </span>
                    </a>
                  )}
                  {waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="panel group flex items-center gap-4 p-4 transition hover:border-[#25d366]/50 hover:bg-[#25d366]/[0.06]"
                    >
                      <WhatsappIcon width={20} height={20} className="text-[#25d366]" />
                      <span className="flex-1">
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-500">WhatsApp</span>
                        <span className="text-sm font-medium text-white">Chat with me on WhatsApp</span>
                      </span>
                      <ArrowUpRightIcon width={16} height={16} className="text-zinc-500 transition group-hover:text-[#25d366]" />
                    </a>
                  )}
                  {profile.location && (
                    <div className="panel flex items-center gap-4 p-4">
                      <MapPinIcon className="text-[var(--blue)]" />
                      <span>
                        <span className="block text-[10px] uppercase tracking-widest text-zinc-500">Location</span>
                        <span className="text-sm font-medium text-white">{profile.location}</span>
                      </span>
                    </div>
                  )}
                </div>
                {socials.length > 0 && (
                  <div className="mt-6 flex gap-2">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-300 transition hover:border-[var(--blue)] hover:text-white"
                      >
                        <Icon width={16} height={16} />
                      </a>
                    ))}
                  </div>
                )}
              </Reveal>
              <Reveal delay={150}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <p className="text-xl font-bold text-[var(--blue)]">{profile.name}</p>
          {profile.footerText && <p className="mt-2 text-sm text-zinc-400">{profile.footerText}</p>}
          <div className="mt-10 flex items-center justify-between text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
            <a href="#home" className="inline-flex items-center gap-1 hover:text-white">
              <SparkIcon width={14} height={14} /> Back to top
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
