import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getStreakInfo } from "@/lib/progressStats";

export default function StreakBadge({ completedCount }) {
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    try {
      setStreakDays(getStreakInfo().current);
    } catch {
      setStreakDays(0);
    }
  }, []);

  const hot = streakDays >= 3;

  return (
    <div className="flex items-center gap-4 mb-5">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-3 py-1.5"
        style={{ border: "1px solid #17201C", background: "#070B0A" }}
      >
        <span style={{ fontSize: "0.75rem", color: hot ? "#5ED29C" : "#5A5346" }}>✦</span>
        <div className="font-sans text-xs font-bold" style={{ color: hot ? "#5ED29C" : "#CBD6D0" }}>
          {streakDays}d streak
        </div>
      </motion.div>

      <div className="flex items-center gap-2 px-3 py-1.5" style={{ border: "1px solid #17201C", background: "#070B0A" }}>
        <div className="font-sans text-xs font-bold" style={{ color: "#FFFFFF" }}>
          {completedCount} done
        </div>
      </div>
    </div>
  );
}