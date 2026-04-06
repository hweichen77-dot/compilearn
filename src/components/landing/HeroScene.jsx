import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function HeroScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);

  return (
    <div ref={ref} style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#080808" }}>

        {/* Animated grid */}
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184,255,0,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184,255,0,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(184,255,0,0.07) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 3 + 1 + "px",
                height: Math.random() * 3 + 1 + "px",
                background: "#b8ff00",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.3,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <motion.div
          style={{ scale, opacity, y }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs tracking-widest uppercase mb-6"
            style={{ color: "#b8ff00" }}
          >
            § CodeFlow — The Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-none mb-6"
            style={{
              fontSize: "clamp(3rem, 8vw, 7rem)",
              letterSpacing: "-0.03em",
              color: "#e8e8e8",
            }}
          >
            Master Coding<br />
            <span style={{ WebkitTextStroke: "2px #b8ff00", color: "transparent" }}>
              and AI
            </span>{" "}
            in One Place.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-lg md:text-xl mb-10 mx-auto"
            style={{ color: "#555", maxWidth: "50ch", fontWeight: 400, lineHeight: 1.6 }}
          >
            Not courses. Not theory dumps. A hands-on progression from first principles to deployed AI — with code at every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to={createPageUrl("Projects")}>
              <button
                className="font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-200"
                style={{
                  background: "#b8ff00",
                  color: "#0a0a0a",
                  fontWeight: 700,
                  border: "1px solid #b8ff00",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(184,255,0,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Start Learning →
              </button>
            </Link>
            <Link to={createPageUrl("AITrack")}>
              <button
                className="font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-200"
                style={{ color: "#555", border: "1px solid #1e1e1e" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#e8e8e8";
                  e.currentTarget.style.borderColor = "#333";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#555";
                  e.currentTarget.style.borderColor = "#1e1e1e";
                }}
              >
                View AI Track
              </button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-[-80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-xs tracking-widest" style={{ color: "#2a2a2a" }}>SCROLL</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-8"
              style={{ background: "linear-gradient(to bottom, #b8ff00, transparent)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}