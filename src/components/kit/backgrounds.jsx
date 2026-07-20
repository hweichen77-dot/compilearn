import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GridBackdrop({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 [background-size:32px_32px]",
        "[background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
        "[mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,#000_40%,transparent_100%)]",
        className
      )}
    />
  );
}

export function DotBackdrop({ className }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 [background-size:16px_16px]",
        "[background-image:radial-gradient(circle,rgba(255,255,255,0.10)_1px,transparent_1px)]",
        "[mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]",
        className
      )}
    />
  );
}

export function Aurora({ className }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="kit-aurora-anim absolute inset-0 opacity-60 blur-[70px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,#070B0A_75%)]" />
    </div>
  );
}

export function HeroGlow({ color = "#5ED29C", className }) {
  return (
    <div
      aria-hidden
      style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
      className={cn(
        "pointer-events-none absolute left-1/2 top-[-10%] -z-10 h-[600px] w-[900px]",
        "-translate-x-1/2 rounded-full opacity-20 blur-[120px]",
        className
      )}
    />
  );
}

export function Spotlight({ duration = 7 }) {
  const g1 =
    "radial-gradient(68% 68% at 55% 31%, hsla(153,55%,75%,.10) 0, hsla(153,55%,60%,.04) 50%, transparent 80%)";
  const g2 = "radial-gradient(50% 50% at 50% 50%, hsla(153,55%,75%,.08) 0, transparent 80%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 100, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateY(-350px) rotate(-45deg)", background: g1 }}
        className="absolute left-0 top-0 h-[1200px] w-[560px]"
      />
      <motion.div
        animate={{ x: [0, -100, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        style={{ transform: "translateY(-350px) rotate(45deg)", background: g2 }}
        className="absolute right-0 top-0 h-[1200px] w-[560px]"
      />
    </div>
  );
}

export function Meteors({ n = 14 }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: n }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${(i * 137) % 100}%`,
            animationDelay: `${i % 5}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
          className={cn(
            "absolute top-0 h-[2px] w-[2px] rotate-[215deg] rounded-full bg-[#5ED29C]",
            "[animation-name:kit-meteor] [animation-iteration-count:infinite] [animation-timing-function:linear]",
            "before:absolute before:top-1/2 before:h-px before:w-16 before:-translate-y-1/2",
            "before:bg-gradient-to-r before:from-[#5ED29C] before:to-transparent before:content-['']"
          )}
        />
      ))}
    </div>
  );
}
