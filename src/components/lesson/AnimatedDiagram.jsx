import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

function Node({ node, active, done, index }) {
  const state = active ? "active" : done ? "done" : "idle";
  const bg = state === "active" ? trace.limeFaint : trace.surface;
  const border = state === "active" ? trace.lime : state === "done" ? trace.limeDim : trace.border;
  const labelColor = state === "idle" ? trace.dim : trace.lime;

  return (
    <motion.div
      animate={{
        scale: state === "active" ? 1.05 : 1,
        borderColor: border,
        backgroundColor: bg,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded px-3 py-2 text-center"
      style={{
        border: `1px solid ${border}`,
        minWidth: "92px",
        flex: "0 0 auto",
      }}
    >
      <div className="font-sans text-xs" style={{ color: '#FFFFFF', fontSize: "0.6rem", letterSpacing: "0.08em" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="font-sans text-xs font-bold" style={{ color: labelColor }}>
        {node.label}
      </div>
      {node.sub && (
        <div className="font-display" style={{ color: '#FFFFFF', fontSize: "0.68rem", marginTop: "2px", lineHeight: 1.3 }}>
          {node.sub}
        </div>
      )}
    </motion.div>
  );
}

function Arrow({ active, loop }) {
  return (
    <motion.span
      className="font-sans"
      animate={{ color: active ? trace.lime : trace.muted, opacity: active ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      style={{ fontSize: "0.9rem", flex: "0 0 auto", padding: "0 2px" }}
    >
      {loop ? "↺" : "→"}
    </motion.span>
  );
}

export default function AnimatedDiagram({ title, nodes = [], caption, loop = false, autoplay = true, interval = 1100 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.5 });
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  const total = nodes.length;

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    setPlaying(false);
  };

  const play = () => {
    stop();
    setStep(0);
    setPlaying(true);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      if (i >= total) {
        if (loop) { i = 0; setStep(0); return; }
        stop();
        setStep(total - 1);
        return;
      }
      setStep(i);
    }, interval);
  };

  useEffect(() => {
    if (inView && autoplay && step === -1 && !playing) play();
    if (!inView) stop();
    return stop;

  }, [inView]);

  if (!total) return null;

  const activeIndex = step;

  return (
    <div
      ref={ref}
      className="my-5 p-4 rounded"
      style={{ background: trace.raised, border: `1px solid ${trace.border}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: '#FFFFFF' }}>
          {title || "How it flows"}
        </div>
        <button
          onClick={playing ? stop : play}
          className="flex items-center gap-1 font-sans text-xs"
          style={{ color: trace.lime, background: "transparent", border: "none", cursor: "pointer" }}
        >
          {playing ? <RotateCcw size={12} /> : <Play size={12} />}
          {playing ? "playing" : "replay"}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <Node node={node} index={i} active={i === activeIndex} done={activeIndex > i} />
            {i < total - 1 && <Arrow active={activeIndex >= i && activeIndex !== -1} />}
            {i === total - 1 && loop && <Arrow active={activeIndex === total - 1} loop />}
          </React.Fragment>
        ))}
      </div>

      {caption && (
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-display mt-4"
          style={{ color: trace.text, fontSize: "0.82rem", lineHeight: 1.55 }}
        >
          {activeIndex >= 0 && nodes[activeIndex]?.detail ? (
            <span><span style={{ color: trace.lime, fontWeight: 700 }}>{nodes[activeIndex].label}: </span>{nodes[activeIndex].detail}</span>
          ) : (
            caption
          )}
        </motion.div>
      )}
    </div>
  );
}
