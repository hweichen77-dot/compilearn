import React, { useEffect, useState } from "react";
import "@/styles/landing.css";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import LiquidEther from "@/components/kit/LiquidEther";
import { Reveal } from "@/components/kit";
import LivePlayground from "@/components/landing/LivePlayground";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const V = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "";
const DOWNLOAD_MAC = `https://github.com/hweichen77-dot/compilearn/releases/download/v${V}/Compilearn_${V}_universal.dmg`;
const DOWNLOAD_WIN = `https://github.com/hweichen77-dot/compilearn/releases/download/v${V}/Compilearn_${V}_x64-setup.exe`;

const NAV_LINKS = [
  ["Tracks", "#tracks"],
  ["Playground", "#playground"],
];

function Accent({ children }) {
  return <em className="u-serif italic text-[1.1em] text-[#5ED29C]">{children}</em>;
}

function Numeral({ children }) {
  return (
    <span className="u-display block text-[clamp(38px,4.4vw,58px)] leading-none tracking-[-0.04em] text-white">
      {children}
    </span>
  );
}

function RuleLabel({ children }) {
  return (
    <div className="mt-4 flex items-center gap-4">
      <span className="h-px w-10 shrink-0 bg-[#5ED29C]" />
      <span className="text-[13px] font-semibold text-white">{children}</span>
    </div>
  );
}

function NavLinks() {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="mr-3 hidden items-center sm:flex" onMouseLeave={() => setHovered(null)}>
      {NAV_LINKS.map(([label, href], i) => (
        <a
          key={href}
          href={href}
          onMouseEnter={() => setHovered(i)}
          onFocus={() => setHovered(i)}
          className="relative px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white"
        >
          {hovered === i && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 -z-10 rounded-full bg-[#5ED29C]/15 ring-1 ring-inset ring-[#5ED29C]/35"
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative">{label}</span>
        </a>
      ))}
    </div>
  );
}

function Nav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-white/10 bg-[#070B0A]/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-300 ${
          scrolled ? "h-14" : "h-[68px]"
        }`}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className="grid h-7 w-7 place-items-center rounded-md u-mono text-sm font-bold"
            style={{ color: "#5ED29C", background: "rgba(94,210,156,0.10)", border: "1px solid rgba(94,210,156,0.28)" }}
          >
            &gt;_
          </span>
          <span className="u-display text-[17px] font-extrabold tracking-tight text-white">
            Compilearn
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLinks />
          <button
            onClick={() => navigate(createPageUrl("AITrack"))}
            className="rounded-full bg-[#5ED29C] px-5 py-2 text-[13px] font-bold text-[#070B0A] transition-transform hover:-translate-y-0.5"
          >
            Browse the tracks
          </button>
        </div>
      </div>
    </nav>
  );
}

const TRACKS = [
  {
    key: "ai",
    n: "01.",
    label: "AI Track",
    title: "Your first API call to a running app",
    body: "Starts where you have never called a model before and ends with something deployed. Meant to be done in order.",
    tag: "modules",
    to: "AITrack",
    modules: ["Your First API Call", "Prompt Engineering", "Build a Chatbot", "Embeddings & Semantic Search", "Build a RAG System", "AI Agents & Tool Use", "Shipping to production"],
  },
  {
    key: "projects",
    n: "02.",
    label: "AI Projects",
    title: "Twenty-two things you can hand to someone",
    body: "Each project is broken into steps you can follow, and what you end up with is a real app rather than an exercise.",
    tag: "22 projects",
    to: "Projects",
    chips: ["Chatbot", "Essay grader", "RAG search", "Vision app", "+18 more"],
  },
  {
    key: "csp",
    n: "03.",
    label: "AP CSP",
    title: "The whole Computer Science Principles course",
    body: "Every Big Idea, plus Create Task practice and the multiple choice drills that show up on the exam.",
    tag: "48 lessons",
    to: "APCS",
    chips: ["Big Ideas 1–5", "Create Task", "MCQ practice"],
  },
  {
    key: "csa",
    n: "04.",
    label: "AP CSA",
    title: "Java from nothing to free response",
    body: "Starts with syntax and gets as far as recursion and sorting, then drills the exam format until it stops being scary.",
    tag: "80 lessons",
    to: "APCS",
    chips: ["Java basics", "OOP & classes", "Arrays & ArrayList", "2D arrays", "Recursion", "Sorting & searching", "MCQ drills", "FRQ prep"],
  },
];

function TrackChip({ children }) {
  return (
    <span className="u-mono text-[11px] rounded-full border border-white/12 px-3 py-1 text-white">
      {children}
    </span>
  );
}

function TrackCell({ t, modules }) {
  const navigate = useNavigate();
  const count = t.key === "ai" && modules?.length ? modules.length : null;
  return (
    <button
      type="button"
      onClick={() => navigate(createPageUrl(t.to))}
      className="group flex flex-col items-start bg-[#070B0A]/70 p-8 text-left backdrop-blur-sm transition-colors hover:bg-[#0C1210]/80 md:p-11"
    >
      <Numeral>{t.n}</Numeral>
      <RuleLabel>{t.label}</RuleLabel>
      <h3 className="u-display mt-7 text-[clamp(21px,2vw,27px)] font-extrabold leading-[1.12] tracking-[-0.03em] text-white">
        {t.title}
      </h3>
      <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-white/92">{t.body}</p>
      <div className="mt-7 flex flex-wrap gap-2">
        {(t.chips || t.modules.slice(0, 4)).map((c) => (
          <TrackChip key={c}>{c}</TrackChip>
        ))}
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[#5ED29C]">
        {count ? `${count} modules` : t.tag}
        <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  );
}

export default function HomeLanding() {
  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const aiTitles = projects
    .filter((p) => (p.track || "ai") === "ai" && p.kind !== "product")
    .map((p) => p.title);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070B0A] text-white" style={{ fontFamily: "var(--font-display)" }}>
      {prefersReducedMotion ? (
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(75%_55%_at_50%_20%,rgba(94,210,156,.16)_0%,rgba(52,208,196,.07)_45%,transparent_100%)]" />
      ) : (
        <div className="fixed inset-0 z-0">
          <LiquidEther
            className="h-full w-full opacity-100"
            colors={["#5ED29C", "#34D0C4", "#0EA86E"]}
            mouseForce={26}
            cursorSize={130}
            resolution={0.35}
            BFECC={false}
            iterationsPoisson={18}
            autoDemo
            autoSpeed={0.85}
            autoIntensity={3.6}
          />
        </div>
      )}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(102deg,rgba(7,11,10,.88)_0%,rgba(7,11,10,.66)_40%,rgba(7,11,10,.16)_100%)]" />

      <div className="relative z-10">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] u-mono text-xs px-4 py-2"
        style={{ background: "var(--accent)", color: "var(--bg-base)" }}
      >
        Skip to content
      </a>
      <Nav />

      <main id="main-content">
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 lg:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
          <div>
            <Reveal>
              <h1 className="u-display max-w-[14ch] text-[clamp(34px,4.4vw,64px)] font-extrabold leading-[0.94] tracking-[-0.035em] text-white">
                Write the prompt.
                <span className="block text-[#5ED29C]">
                  Survive the attacks<span className="cl-caret" aria-hidden="true">_</span>
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-[46ch] text-[17px] leading-[1.55] text-white">
                Three injection attacks run against your system prompt on a live model, and you get
                a <Accent>held or broken score</Accent> in about twenty seconds.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-4 text-[14px] text-white">
                Nothing to install. Two free runs before you sign in.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <a
                href="#tracks"
                className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-white"
              >
                <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-[#5ED29C]">
                  Or see the 504 lessons behind it
                </span>
                <ArrowRight size={15} aria-hidden="true" className="text-[#5ED29C] transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <LivePlayground />
          </Reveal>
        </div>
      </section>

      <Section id="tracks" className="py-24">
        <Reveal>
          <h2 className="u-display max-w-[18ch] text-[clamp(30px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            Start with AI. The rest is here when you want it.
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-6 max-w-[54ch] text-[17px] leading-relaxed text-white">
            Four tracks. You can begin on any of them, and there is no rule against
            running two at once.
          </p>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
          {TRACKS.map((t) => (
            <TrackCell key={t.key} t={t} modules={t.key === "ai" ? aiTitles : null} />
          ))}
        </div>
      </Section>
      </main>

      <SiteFooter />
      </div>
    </div>
  );
}

function FooterLink({ to, href, children }) {
  const cls = "block text-sm text-white transition-colors hover:text-[#5ED29C]";
  if (to) return <Link to={to} className={cls}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/12 px-6 pb-24 pt-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-2">
            <span className="u-mono text-[#5ED29C] text-lg font-semibold">&gt;_</span>
            <span className="u-display text-lg font-extrabold tracking-tight text-white">Compilearn</span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white">
            Run real code in the browser and get a tutor that makes you work it out.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[
              [DOWNLOAD_MAC, "Download for macOS"],
              [DOWNLOAD_WIN, "Download for Windows"],
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                rel="noopener"
                className="inline-flex items-center rounded-full border border-white/20 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#5ED29C]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-[13px] font-semibold text-white">Product</h3>
          <div className="space-y-2.5">
            <FooterLink to={createPageUrl("AITrack")}>AI track</FooterLink>
            <FooterLink to={createPageUrl("APCS")}>AP CS</FooterLink>
            <FooterLink to={createPageUrl("Challenges")}>Compete</FooterLink>
            <FooterLink to={createPageUrl("Projects")}>Projects</FooterLink>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-[13px] font-semibold text-white">About</h3>
          <div className="space-y-2.5">
            <FooterLink href="https://github.com/hweichen77-dot/compilearn">GitHub</FooterLink>
            <FooterLink href="mailto:jason.huang317235@gmail.com">Contact</FooterLink>
            <FooterLink to={createPageUrl("Privacy")}>Privacy</FooterLink>
            <FooterLink to={createPageUrl("Terms")}>Terms</FooterLink>
            <FooterLink to={createPageUrl("Accessibility")}>Accessibility</FooterLink>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-6xl border-t border-white/12 pt-7 text-xs text-white">
        © 2026 Compilearn. Learn by building.
        <p className="mt-2 leading-relaxed text-white">
          Independent project, not affiliated with or endorsed by the College Board. AP®
          and Advanced Placement® are registered trademarks of the College Board. AI
          output can be inaccurate, so verify before relying on it.
        </p>
      </div>
    </footer>
  );
}
