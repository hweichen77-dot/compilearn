import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, animate, useInView } from "framer-motion";

export function AuroraBackground() {
  return (
    <>
      <div className="cl-aurora" aria-hidden="true" />
      <div className="cl-grain" aria-hidden="true" />
    </>
  );
}

export function Reveal({ children, delay = 0, y = 18, as = "div", className, style }) {
  const rm = useReducedMotion();
  const M = motion[as] || motion.div;
  if (rm) return <div className={className} style={style}>{children}</div>;
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </M>
  );
}

export function Marquee({ rows }) {
  return (
    <div className="cl-marquee">
      {rows.map((cards, i) => (
        <div key={i} className={`cl-mrow ${i % 2 === 0 ? "left" : "right"}`}>
          {[...cards, ...cards].map((c, j) => (
            <React.Fragment key={j}>{c}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CountUp({ to, duration = 1.4, suffix = "", className, style }) {
  const rm = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(rm ? to : 0);
  useEffect(() => {
    if (rm || !inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration, rm]);
  return <span ref={ref} className={className} style={style}>{val.toLocaleString()}{suffix}</span>;
}

export function GlowCard({ children, className = "", style, ...rest }) {
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", e.clientX - r.left + "px");
    el.style.setProperty("--my", e.clientY - r.top + "px");
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={`cl-glow-card cl-lift ${className}`} style={style} {...rest}>
      <div className="cl-glow" aria-hidden="true" />
      {children}
    </div>
  );
}

export function MagneticButton({ children, strength = 0.35, className, style, ...rest }) {
  const rm = useReducedMotion();
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  function onMove(e) {
    if (rm) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    setT({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
  }
  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      animate={{ x: t.x, y: t.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
