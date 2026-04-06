import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

const CODING_TOPICS = ["Variables & Functions", "DOM & Browser APIs", "React & Components", "Data Structures", "Algorithms"];
const AI_TOPICS = ["How Models Work", "Prompt Engineering", "Embeddings & Vectors", "RAG Systems", "Fine-Tuning"];

export default function PathSplitScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const leftX = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "-8%"]);
  const rightX = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "8%"]);
  const dividerOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.45], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: "300vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <motion.div style={{ opacity: sceneOpacity }} className="w-full h-full relative">

          {/* Center divider */}
          <motion.div
            style={{ opacity: dividerOpacity }}
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-20"
            >
            <div className="w-full h-full" style={{ background: "linear-gradient(to bottom, transparent, #b8ff0044, #b8ff00, #b8ff0044, transparent)" }} />
          </motion.div>

          {/* Centered intro label */}
          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0.05, 0.2, 0.3], [0, 1, 0]) }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
          >
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#b8ff00" }}>§ CHOOSE YOUR PATH</div>
            <h2
              className="font-display font-black text-center"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
            >
              Two tracks.<br />One platform.
            </h2>
          </motion.div>

          {/* LEFT — Coding */}
          <motion.div
            style={{ x: leftX }}
            className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-12 lg:px-20"
          >
            <motion.div style={{ opacity: labelOpacity }}>
              {/* Big background text */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                style={{
                  fontSize: "clamp(6rem, 15vw, 14rem)",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "1px #1a1a1a",
                  letterSpacing: "-0.05em",
                  opacity: 0.4,
                }}
              >
                CODE
              </div>

              <div className="relative z-10 text-left max-w-xs">
                <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#555" }}>PATH 01</div>
                <h3
                  className="font-display font-black mb-4"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
                >
                  Coding
                </h3>
                <p className="font-display text-base mb-6" style={{ color: "#444", fontWeight: 400 }}>
                  From HTML & JavaScript to React and algorithms. Build real projects, not toy examples.
                </p>
                <motion.div style={{ opacity: contentOpacity }} className="space-y-2 mb-8">
                  {CODING_TOPICS.map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3"
                    >
                      <span className="font-mono text-xs" style={{ color: "#b8ff0066" }}>→</span>
                      <span className="font-mono text-xs" style={{ color: "#444" }}>{t}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div style={{ opacity: contentOpacity }}>
                  <Link to={createPageUrl("Projects")}>
                    <button
                      className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200"
                      style={{ border: "1px solid #b8ff0033", color: "#b8ff00", background: "#b8ff0010" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#b8ff0020"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#b8ff0010"; }}
                    >
                      View Projects →
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — AI */}
          <motion.div
            style={{ x: rightX }}
            className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 lg:px-20"
          >
            <motion.div style={{ opacity: labelOpacity }}>
              {/* Big background text */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
                style={{
                  fontSize: "clamp(6rem, 15vw, 14rem)",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 900,
                  color: "transparent",
                  WebkitTextStroke: "1px #1a1a1a",
                  letterSpacing: "-0.05em",
                  opacity: 0.4,
                }}
              >
                AI
              </div>

              <div className="relative z-10 text-right max-w-xs ml-auto">
                <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#555" }}>PATH 02</div>
                <h3
                  className="font-display font-black mb-4"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
                >
                  AI / ML
                </h3>
                <p className="font-display text-base mb-6" style={{ color: "#444", fontWeight: 400 }}>
                  From neural network basics to fine-tuning LLMs. Deploy real AI-powered apps.
                </p>
                <motion.div style={{ opacity: contentOpacity }} className="space-y-2 mb-8">
                  {AI_TOPICS.map((t, i) => (
                    <motion.div
                      key={t}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-end gap-3"
                    >
                      <span className="font-mono text-xs" style={{ color: "#444" }}>{t}</span>
                      <span className="font-mono text-xs" style={{ color: "#b8ff0066" }}>→</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div style={{ opacity: contentOpacity }} className="flex justify-end">
                  <Link to={createPageUrl("AITrack")}>
                    <button
                      className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200"
                      style={{ border: "1px solid #b8ff0033", color: "#b8ff00", background: "#b8ff0010" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#b8ff0020"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#b8ff0010"; }}
                    >
                      View AI Track →
                    </button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}