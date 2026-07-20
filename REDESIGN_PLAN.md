# Compilearn Complete Redesign Plan

Grounded in `UI_STANDOUT_KIT.md` (deep research: dev-tool/SaaS landing, motion/component libs, 18 coding-edu platforms) + current-code reality.

## North Star — "Terminal-Premium"
- Canvas near-black green-charcoal `#070B0A`; surfaces via hairline borders + `bg-white/[0.03]`, not shadows.
- Color: green `#5ED29C` primary · teal `#34D0C4` secondary · amber `#F5A524` streak/`>_` prompt ONLY · green = Run/success.
- Type: display face on headings (`-0.02em`, `lh 1.05`); Inter body w/ optical features; mono for code. Text hierarchy = white-opacity ramp (`#fff`/`.92`/`.62`), never grey.
- Motion: short expo-out `[0.16,1,0.3,1]`, ≤20px, one loud bg per view.
- Signature: `>_` typewriter + code windows (terminal flavor = the differentiator).
- Register: Brilliant/Mimo/Boot.dev premium-playful, terminal-flavored. Reject Sololearn childish + LeetCode density.

## Stage 1 — Foundation + Front Door (low risk, high payoff)
- 1a Design-system substrate: token patch (fix pure-white muted bug → opacity ramp), `--accent-2`/`--amber`, radius scale, `--ease-out-expo`, keyframes bundle, type layer (display face, optical features, clamp scale, 68ch measure, tabular-nums), `cn()` util, `<MotionConfig reducedMotion="user">`, global reduced-motion CSS.
- 1b Component library (`src/components/kit/`, off CSS vars): GridBackdrop, Aurora, Spotlight, GradientText, BentoGrid/Card, SpotlightCard, CodeWindow, Marquee, Reveal/Stagger, MagneticButton, CountUp, Typewriter. Reuse existing primitives.jsx.
- 1c Marketing rebuild: consolidate landing/HomeLanding vs home2/* (kill dead + inline soup); split hero w/ live playground + `>_` typewriter + one-word gradient; active bento tracks, sticky-scroll how-it-works, stat strip, tech marquee, testimonial, pricing, hairline framing; condense-on-scroll nav + footer.
- DoD: landing live, build green, Lighthouse ≥90, reduced-motion ok, zero grey/eyebrow/kicker.

## Stage 2 — Core Learning Loop (medium-high risk, touches runners)
- 2a App shell: top bar ~50px + left sidebar app pages + mobile bottom-tab; dashboard scaffold.
- 2b Lesson reader two-layout: concept (≤720px, inline runnable prompts, segmented progress, Check→Continue, specific-hint footer, never hard-block); hands-on (split resizable); progressive disclosure; ARIA regions.
- 2c Editor/playground: Monaco vs-dark @16px + bracket colorization + VS Code Dark+ tokens; two-tier Run(visible)/Submit(hidden→per-test rows, first-error, Beats%); AI Analyzer (Groq) readability/maintainability/perf; Hint→Reveal→Ask-AI ladder.
- 2d Catalog: card-grid 3→2→1, per-track accent, footer metadata; faceted filters (lang/topic/level) + tag chips + ⌘K.
- DoD: all runners work, verify-solutions green, full loop smoke-tested.

## Stage 3 — Retention, Signature & Polish
- 3a Gamification: Codewars rank-wheel + exponential XP; streak w/ freeze-days + 7-day widget + counter-synced celebration + daily XP gate; Exercism concept-tree skill map chunked by unit banners; Boot.dev inventory strip + league avatar frames + activity feed. NO hearts/energy gating; max 2-3 currencies.
- 3b Signature motion: `>_` typewriter, sticky-scroll, animated beams, bento hover, spotlight cards, one gradient-border tier, one tilt showcase, meteors last.
- 3c Hardening: perf (transform/opacity, lazy-mount, content-visibility, 60fps), a11y (keyboard/ARIA/contrast/focus), reduced-motion verified, final polish.
- DoD: gamification live no-hearts, 60fps mid hardware, WCAG AA, build+verify green.

## Cross-cutting
- Branches: redesign/stage-1,-2,-3; PR + deploy per stage.
- Untouched: content data, auth/sync, analytics, Groq edge fns, crons.
- Point nightly Compilearn audit cron at redesign branch to catch regressions.
- Each stage independently revertable.
