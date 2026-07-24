import React, { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CountUp({ to, suffix = "", className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = to.toLocaleString() + suffix;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, reduce]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      0{suffix}
    </span>
  );
}

export function Typewriter({ words = [], className, promptClassName }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    if (reduce) {
      setTxt(words[0] || "");
      return;
    }
    if (!words.length) return;
    const full = words[i % words.length];
    const speed = del ? 40 : 90;
    const t = setTimeout(() => {
      setTxt(del ? full.slice(0, txt.length - 1) : full.slice(0, txt.length + 1));
      if (!del && txt === full) setTimeout(() => setDel(true), 1400);
      else if (del && txt === "") {
        setDel(false);
        setI(i + 1);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [txt, del, i, words, reduce]);
  return (
    <span className={className}>
      <span className={cn("u-mono text-[#F5A524]", promptClassName)}>&gt;_ </span>
      {txt}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-[#F5A524] align-middle" />
    </span>
  );
}
