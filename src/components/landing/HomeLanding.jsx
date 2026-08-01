import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import LiquidEther from "@/components/kit/LiquidEther";
import { CountUp, Reveal, Stagger, Item } from "@/components/kit";
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
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#5ED29C] px-5 py-2 text-[13px] font-bold text-[#070B0A] transition-transform hover:-translate-y-0.5"
          >
            Start a track
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

const STEPS = [
  ["01.", "Write a prompt", "Open a lesson and type your instructions. There is nothing to install, and you do not need an account yet."],
  ["02.", "Run it on a real model", "Your prompt goes to an actual language model and comes back with whatever that model really said."],
  ["03.", "Get it graded", "Challenges score the output against a rubric, so passing means the thing worked and not that you clicked through."],
  ["04.", "Keep going", "Hold a streak, move through the tracks, and end up with projects worth showing someone."],
];

const STATS = [
  [480, "+", "lessons and challenges"],
  [128, "", "AP CS lessons"],
  [3, "", "languages that run in the browser"],
];

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`relative mx-auto max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  );
}

export default function HomeLanding() {
  const navigate = useNavigate();
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
      <section className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-center px-6 pb-20 pt-10">
        <Reveal>
          <h1 className="u-display max-w-[15ch] text-[clamp(46px,8.4vw,104px)] font-extrabold leading-[0.92] tracking-[-0.035em] text-white">
            Write the prompt.
            <span className="block text-[#5ED29C]">
              Survive the attacks<span className="cl-caret" aria-hidden="true">_</span>
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-9 max-w-[52ch] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-white">
            You write the system prompt that guards a secret. Then real attacks try to{" "}
            <Accent>talk the model into giving it up</Accent>. It runs against an actual
            language model in your browser, and you do not need an account to start.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-11 flex flex-wrap items-center gap-8">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#5ED29C] px-9 py-4 text-[16px] font-bold text-[#070B0A] transition-transform hover:-translate-y-0.5"
            >
              Start building free
              <ArrowRight size={18} strokeWidth={2.6} aria-hidden="true" />
            </button>
            <a
              href="#playground"
              className="group inline-flex items-center gap-2 text-[16px] font-semibold text-white"
            >
              <span className="border-b border-white/25 pb-0.5 transition-colors group-hover:border-[#5ED29C]">
                Try the playground
              </span>
              <ArrowRight size={16} aria-hidden="true" className="text-[#5ED29C] transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </section>

      <Reveal>
        <LivePlayground />
      </Reveal>

      <Section id="tracks" className="py-28">
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

      <Section className="py-28">
        <Reveal>
          <h2 className="u-display max-w-[16ch] text-[clamp(30px,4.4vw,54px)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            What actually happens when you open a lesson
          </h2>
        </Reveal>
        <Stagger className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4" gap={0.08}>
          {STEPS.map(([n, t, d]) => (
            <Item key={n}>
              <div className="border-t border-white/12 pt-7">
                <Numeral>{n}</Numeral>
                <h3 className="u-display mt-6 text-[19px] font-extrabold tracking-[-0.02em] text-white">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/92">{d}</p>
              </div>
            </Item>
          ))}
        </Stagger>
      </Section>

      <Section className="grid items-center gap-16 py-28 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/12 bg-[#070B0A]/70 p-6 backdrop-blur-sm">
            <div className="self-end rounded-2xl border border-[#5ED29C]/25 bg-[#5ED29C]/10 px-4 py-3 u-mono text-[13px] text-white">
              for i in range(len(nums)):
              <br />
              &nbsp;&nbsp;total =+ nums[i]
            </div>
            <div className="self-start rounded-2xl border border-white/12 px-4 py-3 text-sm leading-relaxed text-white">
              <span className="u-mono mb-2 block text-[11px] text-[#5ED29C]">tutor</span>
              Your total never adds up because{" "}
              <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">=+</code>{" "}
              isn't what you think. Python reads it as{" "}
              <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">total = (+nums[i])</code>
              , so each loop overwrites total. You meant{" "}
              <code className="rounded bg-black/40 px-1.5 py-0.5 u-mono text-[12px] text-[#34D0C4]">+=</code>. Flip
              the two characters and it accumulates.
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div>
            <h2 className="u-display max-w-[15ch] text-[clamp(28px,3.8vw,46px)] font-extrabold leading-[1.04] tracking-[-0.035em] text-white">
              A tutor that reads <Accent>your actual code</Accent>
            </h2>
            <p className="mt-6 max-w-[50ch] text-[17px] leading-relaxed text-white">
              When something breaks it reads the code you wrote, not a generic version of
              the error. It says what went wrong in plain English and points at the line
              to change. You get that at 1am on a Sunday, which is usually when you need it.
            </p>
          </div>
        </Reveal>
      </Section>

      <div className="border-y border-white/12">
        <Section className="grid grid-cols-2 gap-x-8 gap-y-14 py-20 md:grid-cols-4">
          {STATS.map(([v, suffix, label], i) => (
            <Reveal key={label} delay={i * 0.07}>
              <b className="u-display block text-[clamp(38px,5vw,62px)] font-extrabold leading-none tracking-[-0.04em] text-white">
                <CountUp to={v} suffix={suffix} />
              </b>
              <span className="mt-5 block h-px w-10 bg-[#5ED29C]" />
              <span className="mt-4 block text-[14px] font-medium text-white">{label}</span>
            </Reveal>
          ))}
          <Reveal delay={0.21}>
            <b className="u-display block text-[clamp(38px,5vw,62px)] font-extrabold leading-none tracking-[-0.04em] text-white">
              $0
            </b>
            <span className="mt-5 block h-px w-10 bg-[#5ED29C]" />
            <span className="mt-4 block text-[14px] font-medium text-white">to start, and no card</span>
          </Reveal>
        </Section>
      </div>

      <Section className="py-28">
        <div className="grid items-start gap-16 md:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <figure className="m-0">
              <blockquote className="u-display text-[clamp(24px,2.9vw,38px)] font-extrabold leading-[1.14] tracking-[-0.03em] text-white">
                Plenty of people finish a course and still have{" "}
                <Accent>never built anything someone else could open</Accent>. That is the
                part Compilearn is built around.
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="h-px w-10 bg-[#5ED29C]" />
                <span className="text-[13px] font-semibold text-white">the Compilearn mission</span>
              </figcaption>
            </figure>
          </Reveal>
          <div className="flex flex-col gap-10">
            {[
              ["The tutor pushes you to work it out instead of pasting the answer in. Slower, and it is the only version that sticks.", "how we teach"],
              ["Python, Java, and C++ all run in the browser. It is the same code you would write in a real editor, not a trimmed down teaching version.", "what you will use"],
            ].map(([q, who], i) => (
              <Reveal key={who} delay={0.08 + i * 0.08}>
                <figure className="m-0 border-t border-white/12 pt-7">
                  <blockquote className="text-[17px] leading-relaxed text-white">{q}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-4">
                    <span className="h-px w-8 bg-[#5ED29C]" />
                    <span className="text-[13px] font-semibold text-white">{who}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section className="py-32">
        <Reveal>
          <h2 className="u-display max-w-[14ch] text-[clamp(40px,7vw,88px)] font-extrabold leading-[0.94] tracking-[-0.04em] text-white">
            Start coding in the next 30 seconds<span className="cl-caret" aria-hidden="true">_</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-8 max-w-[48ch] text-[18px] leading-relaxed text-white">
            It is free, it runs in the browser, and you do not have to sign up first. Open
            a lesson and run a line.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <button
            onClick={() => navigate("/login")}
            className="mt-12 inline-flex items-center gap-2.5 rounded-full bg-[#5ED29C] px-10 py-4 text-[17px] font-bold text-[#070B0A] transition-transform hover:-translate-y-0.5"
          >
            Start learning free
            <ArrowRight size={18} strokeWidth={2.6} aria-hidden="true" />
          </button>
        </Reveal>
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
            <span className="u-mono text-[#F5A524] text-lg font-semibold">&gt;_</span>
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
