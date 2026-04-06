import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const STATS = [
  { label: "Projects Built", value: "8+", description: "End-to-end working applications" },
  { label: "AI Concepts", value: "37", description: "Lessons across the AI track" },
  { label: "Skill Tracks", value: "2", description: "Coding and AI/ML paths" },
  { label: "Avg Completion", value: "94%", description: "Students who start, finish" },
];

const BARS = [
  { label: "HTML & CSS", width: 95, color: "#b8ff00" },
  { label: "JavaScript", width: 88, color: "#b8ff00" },
  { label: "React", width: 80, color: "#b8ff00" },
  { label: "AI Fundamentals", width: 75, color: "#00d4ff" },
  { label: "Prompt Engineering", width: 70, color: "#00d4ff" },
  { label: "RAG & Embeddings", width: 62, color: "#00d4ff" },
];

// Sub-components to avoid calling hooks inside .map()
function SkillBar({ bar, index, scrollYProgress }) {
  const width = useTransform(
    scrollYProgress,
    [0.1 + index * 0.04, 0.3 + index * 0.04],
    ["0%", `${bar.width}%`]
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-xs" style={{ color: "#555" }}>{bar.label}</span>
        <span className="font-mono text-xs" style={{ color: bar.color }}>{bar.width}%</span>
      </div>
      <div className="h-1 w-full" style={{ background: "#111" }}>
        <motion.div
          className="h-full"
          style={{
            width,
            background: bar.color,
            boxShadow: `0 0 8px ${bar.color}44`,
          }}
        />
      </div>
    </div>
  );
}

function StatCard({ stat, index, scrollYProgress }) {
  const opacity = useTransform(
    scrollYProgress,
    [0.15 + index * 0.06, 0.3 + index * 0.06],
    [0, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0.15 + index * 0.06, 0.3 + index * 0.06],
    [20, 0]
  );
  return (
    <motion.div
      style={{
        opacity,
        y,
        borderRight: index % 2 === 0 ? "1px solid #1a1a1a" : "none",
        borderBottom: index < 2 ? "1px solid #1a1a1a" : "none",
      }}
      className="p-6"
    >
      <div className="font-display font-black mb-1" style={{ fontSize: "2.5rem", letterSpacing: "-0.04em", color: "#b8ff00", lineHeight: 1 }}>
        {stat.value}
      </div>
      <div className="font-display font-bold text-sm mb-1" style={{ color: "#ccc" }}>
        {stat.label}
      </div>
      <div className="font-display text-xs" style={{ color: "#444", fontWeight: 400 }}>
        {stat.description}
      </div>
    </motion.div>
  );
}

export default function ProgressScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.05, 0.88, 1], [0, 1, 1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <div ref={ref} style={{ height: "300vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6"
        style={{ background: "#080808" }}
      >
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 100% 60% at 50% 100%, rgba(184,255,0,0.04) 0%, transparent 70%)" }}
          />
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full max-w-5xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-10 text-center" style={{ color: "#2a2a2a" }}>
            § YOUR GROWTH
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: skill bars */}
            <div>
              <h2
                className="font-display font-black mb-8"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
              >
                Skills you'll gain.<br />
                <span style={{ WebkitTextStroke: "1px #b8ff00", color: "transparent" }}>Measurably.</span>
              </h2>
              <div className="space-y-4">
                {BARS.map((bar, i) => (
                  <SkillBar key={bar.label} bar={bar} index={i} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-0" style={{ border: "1px solid #1a1a1a" }}>
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}