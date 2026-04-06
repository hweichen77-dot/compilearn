import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const FEATURES = [
  {
    num: "01",
    title: "Structured Curriculum",
    body: "Every topic is sequenced for maximum retention. No random YouTube rabbit holes. Just a clear path from zero to deployed.",
    tag: "LEARNING",
    accent: "#b8ff00",
  },
  {
    num: "02",
    title: "Hands-On Projects",
    body: "Build real things. Every module ends with a working project you can put in your portfolio. No toy examples.",
    tag: "BUILDING",
    accent: "#00d4ff",
  },
  {
    num: "03",
    title: "AI Tutor Built In",
    body: "Stuck? An AI tutor is watching your code and ready to guide — not give away the answer, but push you toward it.",
    tag: "SUPPORT",
    accent: "#b8ff00",
  },
  {
    num: "04",
    title: "Clear Skill Paths",
    body: "Coding or AI? Beginner or advanced? Follow a track or mix and match. The platform adapts to where you are.",
    tag: "DIRECTION",
    accent: "#00d4ff",
  },
];

function FeatureCard({ feature, index, scrollYProgress }) {
  const threshold = index * 0.22;

  const cardOpacity = useTransform(
    scrollYProgress,
    [threshold, threshold + 0.12, threshold + 0.22 + 0.1],
    [0, 1, index === FEATURES.length - 1 ? 1 : 0.7]
  );
  const cardY = useTransform(
    scrollYProgress,
    [threshold, threshold + 0.12],
    [60, 0]
  );
  const cardScale = useTransform(
    scrollYProgress,
    [threshold + 0.15, threshold + 0.22 + 0.1],
    [1, index === FEATURES.length - 1 ? 1 : 0.95]
  );

  return (
    <motion.div
      style={{
        opacity: cardOpacity,
        y: cardY,
        scale: cardScale,
        zIndex: index + 1,
      }}
      className="absolute inset-x-0 mx-auto"
      key={feature.num}
    >
      <div
        className="max-w-2xl mx-auto p-8 md:p-12"
        style={{
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          boxShadow: `0 0 60px rgba(0,0,0,0.6), 0 0 1px ${feature.accent}22`,
        }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <div
              className="font-mono font-bold mb-3"
              style={{ fontSize: "3rem", color: "#1a1a1a", letterSpacing: "-0.05em", lineHeight: 1 }}
            >
              {feature.num}
            </div>
            <span
              className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
              style={{ color: feature.accent, border: `1px solid ${feature.accent}33`, background: `${feature.accent}10` }}
            >
              {feature.tag}
            </span>
          </div>
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ border: `1px solid ${feature.accent}22` }}
          >
            <div className="w-2 h-2" style={{ background: feature.accent }} />
          </div>
        </div>

        <h3
          className="font-display font-black mb-4"
          style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
        >
          {feature.title}
        </h3>
        <p
          className="font-display text-base leading-relaxed"
          style={{ color: "#555", fontWeight: 400, maxWidth: "50ch" }}
        >
          {feature.body}
        </p>

        {/* Progress bar hint */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex gap-1">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className="h-0.5 transition-all duration-500"
                style={{
                  width: i <= index ? "24px" : "8px",
                  background: i <= index ? feature.accent : "#1e1e1e",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: "#2a2a2a" }}>
            {index + 1} / {FEATURES.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: "500vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0a0a" }}
      >
        <motion.div style={{ opacity: sceneOpacity }} className="w-full">
          <div className="font-mono text-xs tracking-widest uppercase mb-4 text-center" style={{ color: "#2a2a2a" }}>
            § WHAT YOU GET
          </div>
          <div className="relative" style={{ minHeight: "420px" }}>
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.num}
                feature={feature}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}