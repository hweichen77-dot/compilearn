import { LEVELS, getLevel } from "@/lib/levels"
export { LEVELS, getLevel }
import React from "react";
import { motion } from "framer-motion";

export default function XPLevelBar({ totalXP = 0, earnedThisLesson = 0 }) {
  const lvl = getLevel(totalXP);
  const next = LEVELS.find(l => l.min > lvl.min) || lvl;
  const pct = lvl.max === Infinity ? 100 : Math.min(100, Math.round(((totalXP - lvl.min) / (lvl.max - lvl.min)) * 100));

  return (
    <div
      className="flex items-center gap-4 px-5 py-3"
      style={{ background: "#070B0A", border: "1px solid #17201C", borderRadius: "4px" }}
    >
      <div
        className="font-sans font-bold text-center flex-shrink-0"
        style={{
          width: "38px", height: "38px", borderRadius: "4px",
          background: lvl.color + "22", border: `1px solid ${lvl.color}44`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "0.6rem", color: lvl.color, letterSpacing: "0.08em" }}>LVL</div>
        <div style={{ fontSize: "1rem", color: lvl.color, lineHeight: 1 }}>{lvl.level}</div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="font-sans text-xs" style={{ color: lvl.color }}>
            {lvl.name}
          </div>
          <div className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
            {totalXP} / {lvl.max === Infinity ? "∞" : lvl.max} XP
          </div>
        </div>
        <div style={{ height: "3px", background: "#17201C", borderRadius: "2px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: lvl.color, borderRadius: "2px" }}
          />
        </div>
      </div>

      {earnedThisLesson > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-sans text-xs flex-shrink-0"
          style={{ color: "#5ED29C", background: "#5ED29C10", border: "1px solid #5ED29C33", padding: "3px 8px" }}
        >
          +{earnedThisLesson} this lesson
        </motion.div>
      )}
    </div>
  );
}