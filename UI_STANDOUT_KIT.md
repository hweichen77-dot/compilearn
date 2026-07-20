# Compilearn UI Standout Kit

Goal: make Compilearn read **crafted and premium**, not "vibe-coded / generic-AI-template," and stand out among coding-education apps. Synthesized from a deep scan of best-in-class dev-tool/SaaS landing pages (Linear, Vercel, Stripe, Resend, Railway…), the current award-gallery motion playbook (Awwwards/Godly + Aceternity/Magic UI/React Bits), and 18 coding-education platforms (Brilliant, Mimo, Boot.dev, Duolingo, Exercism, Codewars, LeetCode…).

Everything below is in **Compilearn's real stack**: React (JSX, not TS) + Vite + Tailwind + Framer Motion 11 + Radix + Lucide + three.js — **zero new dependencies**. Components are driven off CSS vars so they inherit the accent.

Hard rules honored throughout (from your global design rules): **no eyebrow pill badges above headlines, no uppercase letter-spaced kicker labels, no light-grey text.** Hierarchy is built from size/weight/opacity, never a grey fade.

---

## 0. TL;DR — the 6 highest-leverage moves

1. **Fix the text hierarchy bug (5 min, biggest correctness win).** `index.css` sets `--muted-foreground` and `--text-muted` to pure `#FFFFFF`. That over-corrects the no-grey rule and kills all depth — every caption is as loud as body. Replace with a **white-opacity ramp** (`#fff` → `92%` → `62%`). This is exactly how Brilliant/Mimo/Boot.dev get hierarchy without grey. See §2.
2. **Grid backdrop + one ambient glow behind the hero.** The single move that reads "engineered product." Trivial CSS. §3.1, §3.4.
3. **One display face + tight tracking.** The #1 premium-vs-childish lever across every edu platform studied. You already load `Instrument Serif` but force Inter everywhere — put a designed display face (or the serif) on hero/section headings at `font-weight:600`, `letter-spacing:-0.02em`, `line-height:1.05`. §2.
4. **Active bento feature grid with real screenshots**, not icon cards — the dominant 2026 layout move. §4.3.
5. **A monospace/terminal signature** (typewriter with `>_` prompt) — on-brand for a coding app and a real differentiator from glossy SaaS. Ties to your amber `>_` logo. §4.6.
6. **Two-tier Run / Submit editor + AI-analysis feedback.** Your live-LLM playground is the gap Frontend Masters (huge, premium, *no editor*) can't fill. Ship Monaco `vs-dark` + Run(visible cases)/Submit(hidden suite) + Coddy-style AI code review. §5.

---

## 1. Current-state gap analysis (what you already have)

**Already built (in `src/components/landing/primitives.jsx`) — do NOT reinvent:**
`AuroraBackground` (aurora + grain), `Reveal` (scroll, expo easing `[0.16,1,0.3,1]`), `Marquee`, `CountUp`, `GlowCard` (mouse-follow glow), `MagneticButton`. Plus a noise overlay in `index.css` and gradient text (`.cl-grad`). Good base — genuinely not generic.

**Concrete flaws to fix:**
| # | Flaw | Fix | §|
|---|------|-----|--|
| 1 | `--muted-foreground` / `--text-muted` = pure `#FFFFFF` → zero hierarchy | White-opacity ramp | §2 |
| 2 | `Instrument Serif` loaded but `display` forced to Inter everywhere → no editorial contrast | Put a display face on headings | §2 |
| 3 | Two competing landing impls (`landing/HomeLanding` live vs `home2/*`) — inline-style heavy, hard to evolve | Consolidate; move to token-driven components | — |
| 4 | Monochromatic mint-green palette, pure-ish flat cards | Add depth: hairline borders + one ambient glow + spotlight cards; reserve a secondary hue | §3–4 |
| 5 | Radius `0.25rem` everywhere (sharp) | Adopt a radius scale 6/8/12/16/999 | §2 |

**Stack confirmed present:** `framer-motion@11`, `three@0.171`, all Radix primitives, `lucide-react`, `clsx`+`tailwind-merge`, `tailwindcss-animate`. Nothing to install.

---

## 2. Design tokens (patch)

### 2.1 Fix text hierarchy + add tokens — `src/index.css`
```css
:root {
  /* keep your green scale; FIX the muted values (were #FFFFFF) */
  --muted-foreground: 150 8% 72%;        /* used by shadcn utils; opacity-feel via HSL lightness */

  /* white-opacity text ramp — hierarchy without grey (Brilliant/Mimo/Boot.dev method) */
  --text-strong: #ffffff;                /* headings / emphasis */
  --text-primary: rgba(255,255,255,0.92);/* body */
  --text-muted:   rgba(255,255,255,0.62);/* captions — OPACITY, not a grey hex */

  /* accent + one secondary (green primary stays; teal secondary for dividers/highlights) */
  --accent:   #5ED29C;                   /* your mint-green */
  --accent-2: #34D0C4;                   /* teal secondary — sparingly */
  --amber:    #F5A524;                   /* streak / terminal prompt ONLY */

  /* radius scale */
  --r-sm: 6px; --r-md: 8px; --r-lg: 12px; --r-xl: 16px;

  /* one motion easing everywhere */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```
Rule: **green is your primary accent; reserve amber for streak + the `>_` prompt only**; keep base a near-black green-charcoal (`#070B0A`, already good — not pure black). Build hierarchy with `--text-strong/primary/muted` + size + weight. Never a grey hex.

### 2.2 Typography — `tailwind.config.js` already has the faces; use them
```css
/* headings get the display treatment (pick ONE display face) */
h1,h2,h3 { font-family:'Plus Jakarta Sans', system-ui; letter-spacing:-0.02em; font-weight:600; }
h1 { line-height:1.05; text-wrap:balance; }         /* even line breaks */
p  { text-wrap:pretty; }
body { font-feature-settings:'cv11','ss01'; font-optical-sizing:auto; } /* lifts Inter above default */
```
Fluid scale: H1 `clamp(2.5rem,6vw,4.5rem)`, H2 `clamp(1.75rem,3.5vw,2.5rem)`, body `1.0625–1.125rem` / `line-height 1.6`. **Cap prose measure at ~68ch / 720px** (LeetCode's unconstrained ~110ch is a real readability failure). Numbers: `tabular-nums`. Serif-display option for hero: put `Instrument Serif` on one hero line for editorial contrast.

### 2.3 Keyframes bundle — append to `src/index.css`
```css
@keyframes aurora   { 0%{background-position:0% 50%} 100%{background-position:100% 50%} }
@keyframes marquee  { to { transform:translateX(-50%); } }
@keyframes shimmer  { to { background-position:200% center; } }
@keyframes beam     { to { stroke-dashoffset:-340; } }
@keyframes meteor   { to { transform:translate(-600px,600px) rotate(215deg); opacity:0; } }
@property --a { syntax:'<angle>'; initial-value:0deg; inherits:false; }
@keyframes spin-border { to { --a:360deg; } }

@media (prefers-reduced-motion: reduce){
  .aurora-anim,.animate-shimmer,.animate-beam,.animate-spin-border,[class*="meteor"]{ animation:none !important; }
}
```

---

## 3. Backgrounds & ambient depth

### 3.1 Grid backdrop with radial fade — *highest ROI, trivial*
Reads "engineered product." The crafted trick is the **radial mask** that fades the grid at the edges so it's not a spreadsheet.
```jsx
export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10
      [background-size:32px_32px]
      [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]
      [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
  );
}
```
Dot-matrix variant (softer): swap the two linear-gradients for `radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)` at `[background-size:16px_16px]`. Optional `+` crosshairs at card corners (2–4 per section) signal precision.

### 3.2 Aurora (upgrade of your `AuroraBackground`) — *GPU-cheap*
Animate only `background-position` under a static blur — never animate `filter:blur` in a loop.
```jsx
export function Aurora({ className = "" }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="aurora-anim absolute inset-0 opacity-60 blur-[70px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#070B0A_75%)]" />
    </div>
  );
}
```
```css
.aurora-anim{
  background-image:
    radial-gradient(at 27% 37%, hsl(153 55% 60% / .30) 0, transparent 45%),
    radial-gradient(at 72% 21%, hsl(170 70% 45% / .25) 0, transparent 50%),
    radial-gradient(at 45% 78%, hsl(153 55% 60% / .20) 0, transparent 55%);
  background-size:200% 200%; animation:aurora 18s ease-in-out infinite alternate;
}
```

### 3.3 Spotlight (cinematic hero beams) — *use INSTEAD of aurora, not with*
```jsx
import { motion } from "framer-motion";
export function Spotlight({ duration = 7 }) {
  const g1 = "radial-gradient(68% 68% at 55% 31%, hsla(153,55%,75%,.10) 0, hsla(153,55%,60%,.04) 50%, transparent 80%)";
  const g2 = "radial-gradient(50% 50% at 50% 50%, hsla(153,55%,75%,.08) 0, transparent 80%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div animate={{ x:[0,100,0] }} transition={{ duration, repeat:Infinity, ease:"easeInOut" }}
        style={{ transform:"translateY(-350px) rotate(-45deg)", background:g1 }}
        className="absolute left-0 top-0 h-[1200px] w-[560px]" />
      <motion.div animate={{ x:[0,-100,0] }} transition={{ duration, repeat:Infinity, ease:"easeInOut" }}
        style={{ transform:"translateY(-350px) rotate(45deg)", background:g2 }}
        className="absolute right-0 top-0 h-[1200px] w-[560px]" />
    </div>
  );
}
```

### 3.4 One hero glow — *depth in one line*
Restraint is everything: **one** glow, heavily blurred, ≤25% opacity. Two+ rainbow blobs = generic AI.
```jsx
<div aria-hidden className="pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[600px] w-[900px]
  -translate-x-1/2 rounded-full opacity-20 blur-[120px]
  bg-[radial-gradient(closest-side,#5ED29C,transparent)]" />
```

### 3.5 Grain overlay — you have one; keep opacity ≤ 0.06. (already in `index.css`, good.)

### 3.6 Meteors — *decorative only, low priority*
```jsx
export function Meteors({ n = 14 }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length:n }).map((_, i) => (
        <span key={i} style={{ left:`${(i*137)%100}%`, animationDelay:`${(i%5)}s`, animationDuration:`${3+(i%4)}s` }}
          className="absolute top-0 h-[2px] w-[2px] rotate-[215deg] rounded-full bg-[#5ED29C]
            animate-[meteor_5s_linear_infinite]
            before:absolute before:top-1/2 before:h-px before:w-16 before:-translate-y-1/2
            before:bg-gradient-to-r before:from-[#5ED29C] before:to-transparent" />
      ))}
    </div>
  );
}
```
(No `Math.random()` — deterministic offsets so it's SSR/re-render stable.)

---

## 4. Hero & marketing blocks

### 4.1 Hero — center-stack (Linear/Resend) or split-with-live-code (Stripe/Clerk)
**For Compilearn, the split hero showcasing the live playground is the stronger differentiator** (you have a real runner — show it running). Center-stack when you want gravitas.
```jsx
export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 md:pt-40 text-center">
      <GridBackdrop />
      <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
          style={{ color:"var(--text-strong)" }}>
        Learn to build<br/>
        <GradientText>real software</GradientText>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg md:text-xl" style={{ color:"var(--text-primary)" }}>
        Interactive lessons, a live code runner, and an AI tutor that actually reads your code.
      </p>
      <div className="mt-9 flex items-center justify-center gap-3">
        <MagneticButton className="rounded-lg bg-[#5ED29C] px-5 py-2.5 text-sm font-medium text-[#06110C]">
          Start learning
        </MagneticButton>
        <a className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
           style={{ color:"var(--text-primary)" }}>Browse curriculum</a>
      </div>
      <div className="relative mx-auto mt-16 max-w-5xl [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]">
        <img src="/app-screenshot.png" alt="Compilearn editor"
             className="rounded-xl border border-white/10 shadow-2xl shadow-black/60" />
      </div>
    </section>
  );
}
```
Headline rules: 2 lines, weight **600** (heavy weights read cheap at display size), `tracking-tight`, break lines manually for rhythm, gradient on **one word only**. Subhead ≤ 560px, `--text-primary` (not grey). Two CTAs, primary solid + left.

### 4.2 Gradient text — vertical white→translucent, or brand green
The expensive move is a **vertical** clip (light falling on type), one word only. Never rainbow horizontal on a headline (#1 AI tell).
```jsx
export function GradientText({ children, className = "" }) {
  return (
    <span className={`bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}
```
Brand variant: `from-[#7FE0B0] to-[#2E8B7A]` (your `--gold-grad`). Animated shimmer: add `animate-[shimmer_4s_linear_infinite] bg-[length:200%_auto]`.

### 4.3 Active bento grid — *the 2026 layout move*
Asymmetric tiles, real screenshots bleeding off corners (not flat icons), hover brightens border + reveals a layer. Cursor-tracked glow via `--x/--y`.
```jsx
import { motion } from "framer-motion";
export function BentoGrid({ children }) {
  return <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:auto-rows-[16rem] md:grid-cols-6">{children}</div>;
}
export function BentoCard({ className = "", title, body, img, span = "" }) {
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX-r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY-r.top}px`); };
  return (
    <motion.div whileHover={{ y:-4 }} transition={{ type:"spring", stiffness:300, damping:24 }} onMouseMove={onMove}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6
                  transition-colors hover:border-[#5ED29C]/40 ${span} ${className}`}>
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100
        bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,0%),rgba(94,210,156,.12),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative z-10">
        <h3 className="text-base font-medium" style={{ color:"var(--text-strong)" }}>{title}</h3>
        <p className="mt-2 max-w-xs text-sm" style={{ color:"var(--text-muted)" }}>{body}</p>
      </div>
      {img && <img src={img} alt="" className="pointer-events-none absolute -bottom-4 -right-4 w-2/3 rounded-tl-xl
        border-l border-t border-white/10 opacity-90 transition-transform duration-500 group-hover:-translate-y-1" />}
    </motion.div>
  );
}
```
Usage: mix spans — `span="md:col-span-4 md:row-span-2"` for the live-runner tile, `md:col-span-2` for AI tutor / streaks. Asymmetry = "designed," not templated. Card treatment: `bg-white/[0.03]` fill, hairline border, **no drop shadow on the card** (shadow goes on the screenshot inside).

### 4.4 Spotlight card — cursor-tracking glow (upgrade of your `GlowCard`)
For pricing/lesson/testimonial cards. Writes CSS vars directly (no React re-render). Same `onMove` as above; glow layer:
```jsx
<div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
  style={{ background:"radial-gradient(500px circle at var(--x) var(--y), rgba(94,210,156,.10), transparent 40%)" }} />
```

### 4.5 Code window — window chrome + syntax + optional typing
Your differentiator is code — show a real editor, not an abstract graphic.
```jsx
export function CodeWindow({ file = "main.py", children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d100e] shadow-2xl shadow-black/60">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs" style={{ color:"var(--text-muted)" }}>{file}</span>
      </div>
      <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed font-mono">{children}</pre>
    </div>
  );
}
```
For the "run" moment: slide an output panel in below with `AnimatePresence` + `height:auto`. Use accent-tinted syntax (VS Code Dark+ tokens: keyword `#569cd6`, string `#ce9178`, fn `#dcdcaa`, comment `#6a9955`, type `#4ec9b0`).

### 4.6 Terminal typewriter — *brand signature, ties to your `>_` logo*
```jsx
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
export function Typewriter({ words }) {
  const reduce = useReducedMotion();
  const [i,setI]=useState(0),[txt,setTxt]=useState(""),[del,setDel]=useState(false);
  useEffect(() => {
    if (reduce) { setTxt(words[0]); return; }
    const full = words[i % words.length], speed = del ? 40 : 90;
    const t = setTimeout(() => {
      setTxt(del ? full.slice(0, txt.length-1) : full.slice(0, txt.length+1));
      if (!del && txt === full) setTimeout(() => setDel(true), 1400);
      else if (del && txt === "") { setDel(false); setI(i+1); }
    }, speed);
    return () => clearTimeout(t);
  }, [txt,del,i,words,reduce]);
  return (
    <span>
      <span className="font-mono text-[#F5A524]">&gt;_ </span>{txt}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-[#F5A524] align-middle" />
    </span>
  );
}
```
Feed it a rotating list of what you can build: `["a chatbot", "an essay grader", "a RAG search"]`.

### 4.7 Logo/tech marquee (you have `Marquee`) — add edge-fade mask + brighten-on-hover
`[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]`, logos `opacity-50 hover:opacity-100`. Duplicate the array once, animate to `-50%` for a seamless loop.

### 4.8 Stat strip + count-up (you have `CountUp`) — white + accent, not grey
```jsx
<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
  <div><div className="text-4xl font-semibold tabular-nums" style={{color:"var(--text-strong)"}}><CountUp to={326}/></div>
       <div className="mt-1 text-sm" style={{color:"var(--text-muted)"}}>lessons</div></div>
</div>
```

### 4.9 Sticky-scroll narrative — how-it-works (write → run on real LLM → auto-graded → level up)
Left column pins, right side swaps visuals per step. Inactive step text uses `text-white/50` (opacity, not grey).
```jsx
import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
export function StickyScroll({ steps }) {
  const ref = useRef(null); const [active,setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start start","end end"] });
  useMotionValueEvent(scrollYProgress, "change", v => setActive(Math.min(steps.length-1, Math.floor(v*steps.length))));
  return (
    <div ref={ref} className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
      <div className="space-y-[40vh] py-[20vh]">
        {steps.map((s,i) => (
          <div key={i} style={{ color: i===active ? "var(--text-strong)" : "rgba(255,255,255,.5)" }}>
            <h3 className="text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="sticky top-0 hidden h-screen items-center md:flex">
        <motion.div key={active} initial={{ opacity:0, scale:.98 }} animate={{ opacity:1, scale:1 }}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8">{steps[active].visual}</motion.div>
      </div>
    </div>
  );
}
```

### 4.10 Animated beam / gradient border / 3D tilt — accent flourishes (use sparingly, one each)
- **Beam** (data-flow diagram "prompt → LLM → graded"): SVG path + a second path with `strokeDasharray="40 300"` `animate-[beam_3s_linear_infinite]`, gradient stroke.
- **Gradient border** (featured tier only): `p-[1.5px]` wrapper, `[background:conic-gradient(from_var(--a),#5ED29C,#34D0C4,#5ED29C)] animate-[spin-border_4s_linear_infinite]`, inner `bg-neutral-950`.
- **3D tilt** (one showcase card): `rotateX/rotateY` springs off pointer, `transformPerspective:900`. Never a grid of these.

---

## 5. Product UI (education-specific — where you beat the SaaS clones)

### 5.1 Lesson reader — two layouts by lesson type
- **Concept lesson** → single narrow column (≤720px), prose interleaved with inline **runnable** prompts (Execute Program / Brilliant / Mimo). Read a few sentences → run → instant feedback → continue.
- **Hands-on** → split pane, prose LEFT / editor RIGHT (~50/50 resizable) (Boot.dev / Coddy).

Reader spec: body `18px / line-height 1.67`, H1 `40/44`, H2 `28`, **cap measure ~68ch**, side gutters 24px. Segmented top progress bar (one segment/step, ~4px, accent fill) — reads more precise than a single continuous fill. Bottom-pinned CTA **Check → Continue**; wrong answer slides a full-width footer up (accent-green / danger-red) with a *specific* hint, then becomes Continue. **Never hard-block** the daily loop.
```jsx
export function LessonReader({ children }) {
  return (
    <article className="mx-auto max-w-[720px] px-6 py-10 text-[18px] leading-[1.67]"
      style={{ color:"var(--text-primary)" }}>{children}</article>
  );
}
```

### 5.2 Editor pane — two-tier Run / Submit (steal from DataCamp/LeetCode/Codewars)
Separate **experimentation from grading**: **Run** (ghost) = visible sample cases, console output, no grade. **Submit** (solid green) = full hidden suite. Monaco `vs-dark` @16px, bracket-pair colorization ON.
```jsx
export function EditorControls({ onRun, onSubmit }) {
  return (
    <div className="flex justify-end gap-2 border-t border-white/10 px-3 py-2">
      <button onClick={onRun} className="rounded-lg px-4 py-2 ring-1 ring-white/10 hover:bg-white/5"
        style={{ color:"var(--text-primary)" }}>Run</button>
      <button onClick={onSubmit} className="rounded-lg bg-[#56BD5B] px-5 py-2 font-medium text-black hover:brightness-105">
        Submit</button>
    </div>
  );
}
```
Result display: **per-test pass/fail rows** with expected vs actual, **show only the first error** (highlighted on its line — non-overwhelming). "Beats X%" runtime bar for a dopamine hit. **AI Analyzer** on submit (readability / maintainability / performance) — this is Compilearn's live-LLM differentiator; go beyond binary pass/fail. Help ladder: **Hint → Reveal solution → Ask AI**. Authoring rules that make lessons feel effortless: ≤15 lines of starter code, ≤120s per step, embed the task prompt as a comment in the starter.

### 5.3 Rank wheel — Codewars-style progress identity
```jsx
export function RankWheel({ pct, rank, next }) {
  const r = 52, c = 2*Math.PI*r;
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg className="absolute -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#26302B" strokeWidth="8"/>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#5ED29C" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c*(1-pct/100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"/>
      </svg>
      <div className="text-center">
        <div className="text-2xl font-semibold" style={{ color:"var(--text-strong)" }}>{rank}</div>
        <div className="text-[13px]" style={{ color:"var(--text-muted)" }}>{pct}% → {next}</div>
      </div>
    </div>
  );
}
```
Pair with **exponential XP** (hard lessons visibly bank more), streaks **with freeze-days** + a 7-day mini-calendar, a daily XP target as the streak gate (DataCamp gates on ~250 XP ≈ one lesson), and an **Exercism concept-graph skill tree** (locked → available → completed) chunked by unit-header banners. Boot.dev polish: a persistent XP+streak inventory strip in the lesson toolbar, league-varying avatar frames (not flat badges), a live global activity feed.

### 5.4 Course card + catalog
Card grid (3-up desktop → 2 → 1, 24px gap), **not** a dense table. Per-track accent color; footer metadata row (`N modules · level · Xh`); faceted filters (language / topic / level) + tag chips + ⌘K search.
```jsx
export function CourseCard({ c }) {
  return (
    <a href={c.href} className="group flex flex-col overflow-hidden rounded-2xl bg-[#0C1210]
        ring-1 ring-white/10 transition hover:ring-[#5ED29C]/50">
      <div className="relative aspect-video" style={{ background:c.trackColor }}>
        <img src={c.thumb} alt="" className="h-full w-full object-cover" />
        {c.badge && <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">{c.badge}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-medium" style={{ color:"var(--text-strong)" }}>{c.title}</h3>
        <p className="text-sm" style={{ color:"var(--text-muted)" }}>{c.modules} modules · {c.level} · {c.hours}h</p>
      </div>
    </a>
  );
}
```

---

## 6. Motion & performance rules

**The one rule:** the compositor animates `transform` and `opacity` for free (off main thread). Everything else costs.
| Tier | Effects | Note |
|------|---------|------|
| Free | translate/scale/rotate, opacity | marquee, meteors, tilt, count-up, spotlight sweep |
| Cheap | `background-position`, CSS-var gradients, `stroke-dashoffset` | one layer/frame; keep element count low |
| Moderate | `filter:blur`, `backdrop-blur`, conic-border | one-shot OK; **never loop `blur`** |
| Heavy | canvas particles, WebGL, animated layout props (`width/top`) | cap count, cap DPR, lazy-mount |

Checklist: animate transform/opacity not layout props · `viewport={{ once:true }}` on all reveals · **one loud background per viewport** (aurora *or* spotlight, never stacked) · bake blur into a static layer, animate position under it · `content-visibility:auto` on long off-screen sections · lazy-mount particles/WebGL below the fold.

**Reduced motion (ship this):** wrap the app in `<MotionConfig reducedMotion="user">`, use `useReducedMotion()` in custom components (typewriter/count-up render final state), and keep the CSS `@media (prefers-reduced-motion)` backstop in §2.3.

Motion character = **short, eased-out, small**: `duration 0.4–0.6s`, `ease [0.16,1,0.3,1]`, travel ≤ 20px. The AI-generic tell is 0.8s ease-in-out over 60px — avoid.

---

## 7. Anti-patterns (banned — this is what makes it read AI-generated)

1. Eyebrow pill badges above headlines · uppercase letter-spaced kicker labels above sections · light-grey body text. (Your hard rules — build hierarchy with size/weight/opacity instead.)
2. Rainbow gradients (purple→pink→blue) on headlines or blobs. Stay 2–3 adjacent hues + one accent.
3. Thick colored `box-shadow` glows on cards. Use hairline borders + one ambient background glow.
4. Emoji as feature icons. Use Lucide line icons or real screenshots.
5. Long slow fades; everything animating at once. Stagger + `once:true`.
6. Pure `#fff` on pure `#000`. Near-black green-charcoal base + off-white text.
7. **Edu-specific:** hearts/energy gating on the daily loop (cash-grab signal) · >2–3 stacked currencies · monospace for body/UI text (dated) · unconstrained prose width · dense zebra problem tables · saturated primary rainbow + mascot logo (childish) · percentile-shame metrics on the reader. Aim for **Exercism's welcome + Codewars' hook**; reject LeetCode's density.

---

## 8. Build order for Compilearn (impact → effort)

**Phase 1 — instant lift (~an afternoon):** fix text-hierarchy tokens (§2.1) · display face + tight tracking on headings (§2.2) · `GridBackdrop` + one hero glow + upgraded `Aurora`/`Spotlight` (§3) · `Reveal` (you have it) around every section.

**Phase 2 — substance:** split hero with live playground (§4.1) + `GradientText` on one word · active `BentoGrid` with real editor screenshots for the tracks (§4.3) · `SpotlightCard` on lesson/pricing (§4.4) · `CodeWindow` demo of the runner (§4.5) · stat strip `CountUp` (§4.8) · tech marquee (§4.7).

**Phase 3 — brand signature + product:** `Typewriter` with `>_` (§4.6) · `StickyScroll` how-it-works (§4.9) · two-tier Run/Submit + AI Analyzer in the playground (§5.2) · `RankWheel` + streak-freeze + concept-tree gamification (§5.3) · card-grid catalog + filters (§5.4).

**Phase 4 — flourish (only with perf budget):** `GradientBorder` on featured tier · one `TiltCard` showcase · `Beam` flow diagram · `Meteors`. Particles last, lazy-mounted, one instance.

Everything shares one `cn()` util (`clsx` + `tailwind-merge`, already installed) and the reduced-motion primitives. No new npm dependencies.

---

## 9. Sources
Dev-tool/SaaS: Vercel Geist grid, Setproduct blueprint-grid guide, CSS-Tricks grainy gradients, Bram.us Stripe gradient, LogRocket Linear design, SaaSFrame bento 2026, Framiq best SaaS landing 2026, Typography.com tight tracking. Motion/libs: Awwwards animation + GSAP collections, Aceternity UI, Magic UI, React Bits, motion-primitives, Cult UI, PkgPulse library comparison 2026, DEV Framer Motion perf patterns, Framer reduced-motion docs. Coding-edu (live computed CSS): Brilliant, Duolingo, Khan, Boot.dev, Scrimba, Execute Program, Codecademy, DataCamp, freeCodeCamp, Exercism, Codewars, LeetCode, Frontend Masters, Mimo, Sololearn, Coddy, Programiz.
