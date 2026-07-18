import React from "react";
import "@/styles/landing.css";
import { Reveal, Marquee, CountUp, GlowCard, MagneticButton } from "@/components/landing/primitives";
import LivePlayground from "@/components/home2/LivePlayground";
import HomeNav from "@/components/home2/HomeNav";
import Footer from "@/components/home2/Footer";

const display = "'Bricolage Grotesque Variable', system-ui, sans-serif";
const body = "'Hanken Grotesk Variable', system-ui, sans-serif";
const mono = "'Spline Sans Mono Variable', ui-monospace, monospace";

const A = "#E8A33C";
const A2 = "#F6BE63";
const INK = "#F4EEE2";
const DIM = "#EFE7D8";
const LINE = "#29211A";
const LINE2 = "#3A2E22";
const GREEN = "#63C486";
const CORAL = "#E8705F";
const PANEL = "#15100B";

const wrap = { position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "0 24px" };
const secH = { fontFamily: display, fontWeight: 700, letterSpacing: "-0.028em", lineHeight: 1.04, fontSize: "clamp(28px,3.9vw,46px)", maxWidth: "18ch", marginTop: 14, textWrap: "balance", color: INK };
const secL = { color: DIM, fontSize: 17, lineHeight: 1.6, maxWidth: "56ch", marginTop: 16, fontWeight: 350 };

function Btn({ primary, children, ...rest }) {
  const base = { fontFamily: body, fontWeight: 600, borderRadius: 10, padding: "13px 26px", fontSize: 16, cursor: "pointer", border: "1px solid transparent", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 };
  const style = primary
    ? { ...base, background: A, color: "#1c1305", boxShadow: "0 8px 30px -10px rgba(232,163,60,.7)" }
    : { ...base, border: `1px solid ${LINE2}`, color: INK, background: "transparent" };
  return <MagneticButton style={style} {...rest}>{children}</MagneticButton>;
}

const PATH = ["AI basics", "Prompting", "Agents", "RAG", "Vision", "Production"];
const nodeStyle = { fontFamily: mono, fontSize: 13, color: INK, border: `1px solid ${LINE2}`, borderRadius: 8, padding: "6px 12px", background: "rgba(255,255,255,.03)", whiteSpace: "nowrap" };
const apNode = { ...nodeStyle, borderColor: "rgba(232,163,60,.42)", color: A2, background: "rgba(232,163,60,.06)" };

const TRACKS = [
  [
    [">_", "Foundations", "Python, how LLMs work, your first API calls", "102 lessons"],
    ["✎", "Prompting", "Get a model to do exactly what you want", "48 lessons"],
    ["◍", "Chatbots & Agents", "Build chatbots and tool-using agents", "48 lessons"],
    ["⌕", "RAG & Search", "Embeddings, vector search, and retrieval", "56 lessons"],
    ["◉", "Vision & Multimodal", "Image, audio, and multimodal models", "40 lessons"],
  ],
  [
    ["⚙", "Production & Ops", "Deploy, evaluate, monitor, and control cost", "64 lessons"],
    ["CSP", "AP CS Principles", "Full curriculum + Create Task practice", "48 lessons"],
    ["CSA", "AP CS A", "Java, MCQs, and free-response prep", "80 lessons"],
    ["⚡", "Competitive", "USACO / Codeforces-style problems in C++", "18 problems"],
  ],
];

function TrackCard({ t }) {
  const [glyph, name, desc, count] = t;
  return (
    <GlowCard style={{ flex: "0 0 auto", width: 272, background: PANEL, border: `1px solid ${LINE}`, borderRadius: 14, padding: "17px 19px", display: "flex", gap: 13, alignItems: "flex-start" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", fontFamily: mono, fontSize: 14, fontWeight: 600, background: "rgba(232,163,60,.1)", border: "1px solid rgba(232,163,60,.24)", color: A2, flex: "0 0 auto" }}>{glyph}</div>
      <div>
        <h4 style={{ fontFamily: display, fontSize: 16, fontWeight: 700, marginBottom: 2, color: INK }}>{name}</h4>
        <p style={{ color: DIM, fontSize: 12.5, lineHeight: 1.45 }}>{desc}</p>
        <span style={{ color: A2, fontSize: 11, fontFamily: mono, marginTop: 6, display: "block" }}>{count}</span>
      </div>
    </GlowCard>
  );
}

function PgWhy({ title, children }) {
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 13, padding: "17px 19px", background: "rgba(255,255,255,.02)" }}>
      <b style={{ fontFamily: display, fontWeight: 700, fontSize: 15.5, display: "block", marginBottom: 5, color: INK }}>{title}</b>
      <span style={{ color: DIM, fontSize: 13, lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

export default function HomeLanding() {
  const heroBg = {
    background: "#0B0906",
    backgroundImage:
      "radial-gradient(1100px 620px at 78% -8%,rgba(232,163,60,.10),transparent 62%)," +
      "radial-gradient(760px 520px at 4% 32%,rgba(224,113,74,.07),transparent 60%)",
    color: INK, fontFamily: body, minHeight: "100vh", position: "relative", overflowX: "hidden",
  };

  return (
    <div style={heroBg}>
      <HomeNav />

      <div style={wrap}>
        <div style={{ textAlign: "center", padding: "88px 0 40px" }}>
          <Reveal as="h1" style={{ fontFamily: display, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 0.98, fontSize: "clamp(44px,7.4vw,92px)", maxWidth: "15ch", margin: "0 auto", textWrap: "balance" }}>
            Learn to build AI by <span className="cl-grad">building&nbsp;products.</span>
          </Reveal>
          <Reveal delay={0.08} as="p" style={{ color: DIM, fontSize: "clamp(16.5px,1.35vw,19px)", lineHeight: 1.6, maxWidth: "58ch", margin: "24px auto 0", fontWeight: 350 }}>
            From your first line of code to shipping real AI apps, all in the browser. A live tutor explains every break, and <b style={{ color: INK, fontWeight: 600 }}>480+ lessons</b> are free to start.
          </Reveal>

          <Reveal delay={0.13} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 8, margin: "24px auto 0", maxWidth: 700 }}>
            {PATH.map((p, i) => (
              <React.Fragment key={p}>
                <span style={nodeStyle}>{p}</span>
                {i < PATH.length - 1 && <span style={{ color: A, opacity: 0.7, fontFamily: mono, fontSize: 13 }}>→</span>}
              </React.Fragment>
            ))}
          </Reveal>
          <Reveal delay={0.17} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10, marginTop: 11 }}>
            <span style={apNode}>AP Computer Science</span>
            <span style={apNode}>Competitive C++</span>
          </Reveal>

          <Reveal delay={0.22} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 32 }}>
            <Btn primary as="a" onClick={() => (window.location.hash = "")}>Start free, no signup</Btn>
            <span style={{ color: DIM, fontSize: 13.5, fontFamily: mono }}>or <a href="#playground" style={{ color: INK, borderBottom: `1px dashed ${LINE2}`, paddingBottom: 1 }}>try the AI playground ↓</a></span>
          </Reveal>

          <Reveal delay={0.28} style={{ display: "flex", justifyContent: "center", gap: 34, marginTop: 40, flexWrap: "wrap" }}>
            <div><b style={{ fontFamily: display, fontWeight: 700, fontSize: 26, display: "block", lineHeight: 1 }}><CountUp to={3} /></b><span style={{ color: DIM, fontSize: 12.5, fontFamily: mono }}>languages, in-browser</span></div>
            <div><b style={{ fontFamily: display, fontWeight: 700, fontSize: 26, display: "block", lineHeight: 1 }}><CountUp to={128} /></b><span style={{ color: DIM, fontSize: 12.5, fontFamily: mono }}>AP CS lessons</span></div>
            <div><b style={{ fontFamily: display, fontWeight: 700, fontSize: 26, display: "block", lineHeight: 1 }}><CountUp to={480} suffix="+" /></b><span style={{ color: DIM, fontSize: 12.5, fontFamily: mono }}>lessons &amp; challenges</span></div>
            <div><b style={{ fontFamily: display, fontWeight: 700, fontSize: 26, display: "block", lineHeight: 1 }}>Live</b><span style={{ color: DIM, fontSize: 12.5, fontFamily: mono }}>AI tutor + playground</span></div>
          </Reveal>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "16px 0", margin: "16px 0 0", background: "rgba(0,0,0,.2)", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div className="cl-mrow left" style={{ fontFamily: mono }}>
          {[...Array(2)].flatMap((_, k) => ["Python", "Java", "C++", "AP CSP", "AP CSA", "Prompting", "RAG & Search", "Agents", "Build AI apps"].map((t, i) => (
            <span key={k + "-" + i} style={{ color: DIM, fontSize: 15, margin: "0 26px", fontWeight: 500 }}>{t}</span>
          )))}
        </div>
      </div>

      <div style={{ background: "radial-gradient(1000px 460px at 50% -6%,rgba(232,163,60,.09),transparent 60%)", borderBottom: `1px solid ${LINE}` }}>
        <div style={wrap}>
          <section id="playground" style={{ padding: "84px 0" }}>
            <Reveal as="h2" style={secH}>The one thing no other coding site has: <span className="cl-grad">a model you have to defend.</span></Reveal>
            <Reveal delay={0.08} as="p" style={secL}>This is the part you'll lose an afternoon to. We hand you a live model and a room full of people trying to hijack it: jailbreaks, prompt-injection, off-topic bait. Your only defense is the system prompt you write. Run the attacks, see what gets through, tighten your wording, and run them again until nothing holds. It turns prompt-writing into a real game of building the toughest instructions you can, and no other place to learn coding lets you play it.</Reveal>
            <Reveal delay={0.1} style={{ marginTop: 30 }}><LivePlayground /></Reveal>
            <Reveal delay={0.14} style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 22 }} className="cl-pgwhy">
              <PgWhy title="A real model">Attacks run live against an actual LLM, not a canned script.</PgWhy>
              <PgWhy title="Real attacks">Genuine jailbreaks and injections, scored automatically.</PgWhy>
              <PgWhy title="You vs. the room">One prompt is your whole defense. Make it unbreakable.</PgWhy>
            </Reveal>
          </section>
        </div>
      </div>

      <div style={wrap}>
        <section style={{ padding: "84px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 54, alignItems: "center" }} className="cl-wedge">
          <Reveal>
            <div style={{ border: `1px solid ${LINE2}`, borderRadius: 16, background: `linear-gradient(180deg,${PANEL},#100C07)`, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ alignSelf: "flex-end", background: "rgba(232,163,60,.1)", border: "1px solid rgba(232,163,60,.24)", borderRadius: 13, padding: "12px 15px", fontFamily: mono, fontSize: 12.5, color: "#ecdfc9", maxWidth: "88%" }}>for i in range(len(nums)):<br />&nbsp;&nbsp;total =+ nums[i]</div>
              <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,.03)", border: `1px solid ${LINE}`, borderRadius: 13, padding: "12px 15px", fontSize: 14, lineHeight: 1.55, maxWidth: "88%", color: INK }}>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: A, display: "block", marginBottom: 6 }}>tutor</span>
                Your total never adds up because <code style={{ fontFamily: mono, background: "rgba(0,0,0,.35)", padding: "1px 5px", borderRadius: 5, color: A2, fontSize: 12.5 }}>=+</code> is not what you think. Python reads it as <code style={{ fontFamily: mono, background: "rgba(0,0,0,.35)", padding: "1px 5px", borderRadius: 5, color: A2, fontSize: 12.5 }}>total = (+nums[i])</code>, so each loop overwrites total with the current number. You meant <code style={{ fontFamily: mono, background: "rgba(0,0,0,.35)", padding: "1px 5px", borderRadius: 5, color: A2, fontSize: 12.5 }}>+=</code>. Flip the two characters and it accumulates.
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={secH}>A tutor that reads your actual code, not a canned hint.</h2>
            <p style={secL}>When something breaks, the tutor looks at the exact code you wrote and explains the failure in plain English, then points at the one line to change. No forum, no waiting. It is the teacher who is there when nobody else is.</p>
          </Reveal>
        </section>
      </div>

      <div style={wrap}>
        <section style={{ padding: "40px 0 20px" }}>
          <Reveal as="h2" style={secH}>One place for everything you'd actually want to learn.</Reveal>
          <Reveal delay={0.08} as="p" style={secL}>From your first line of Python to shipping with AI and prepping for the AP exam. Pick a lane, or wander across all of them.</Reveal>
        </section>
      </div>
      <Reveal style={{ ...wrap, maxWidth: 1360 }}>
        <Marquee rows={TRACKS.map((row) => row.map((t) => <TrackCard key={t[1]} t={t} />))} />
      </Reveal>

      <div style={wrap}>
        <section style={{ padding: "84px 0" }}>
          <Reveal as="h2" style={secH}>Open a lesson. Run code. Know it stuck.</Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, marginTop: 44, border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden", background: LINE }} className="cl-steps">
            {[["01", "Pick a lesson", "Jump into a language, a concept, or straight into the AP track. Nothing to install and no account to begin."], ["02", "Write & run", "Code in the browser, hit run, see output instantly. Stuck? The tutor explains what broke and where."], ["03", "Get graded", "Challenges and the playground grade your work against real rubrics, so a win is a real win."]].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.08} style={{ background: "#100C08", padding: "30px 26px" }}>
                <div style={{ fontFamily: mono, fontSize: 13, color: A, letterSpacing: ".1em" }}>step {n}</div>
                <h4 style={{ fontFamily: display, fontWeight: 700, fontSize: 20, margin: "14px 0 8px", letterSpacing: "-0.01em", color: INK }}>{t}</h4>
                <p style={{ color: DIM, fontSize: 14.5, lineHeight: 1.55 }}>{d}</p>
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      <div style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, padding: "52px 0", background: "radial-gradient(700px 300px at 50% 0%,rgba(232,163,60,.06),transparent 70%)" }}>
        <div style={{ ...wrap, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="cl-nums">
          {[[<CountUp key="a" to={480} suffix="+" />, "lessons & challenges"], [<CountUp key="b" to={128} />, "AP CS lessons"], [<CountUp key="c" to={3} />, "languages run in-browser"], ["$0", "to start, no card"]].map(([v, l], i) => (
            <Reveal key={i} delay={i * 0.07}>
              <b style={{ fontFamily: display, fontWeight: 700, fontSize: "clamp(34px,4.4vw,52px)", display: "block", letterSpacing: "-0.03em", lineHeight: 1, color: INK }}>{v}</b>
              <span style={{ color: DIM, fontFamily: mono, fontSize: 12.5, marginTop: 8, display: "block" }}>{l}</span>
            </Reveal>
          ))}
        </div>
      </div>

      <div style={wrap}>
        <section style={{ textAlign: "center", padding: "110px 0" }}>
          <Reveal as="h2" style={{ fontFamily: display, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1, fontSize: "clamp(38px,6.4vw,82px)", textWrap: "balance", maxWidth: "16ch", margin: "0 auto", color: INK }}>Start coding in the next 30 seconds.</Reveal>
          <Reveal delay={0.08} as="p" style={{ color: DIM, fontSize: 18, margin: "22px auto 34px", maxWidth: "46ch" }}>Free, runs in your browser, no signup to begin. Open a lesson and run your first line.</Reveal>
          <Reveal delay={0.16}><Btn primary as="a" onClick={() => (window.location.hash = "")} style={{ fontSize: 17, padding: "15px 32px" }}>Start learning free</Btn></Reveal>
        </section>
      </div>

      <Footer />
    </div>
  );
}
