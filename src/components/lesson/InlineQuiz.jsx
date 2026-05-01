import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A quick inline "check your understanding" mini quiz
 * that can be embedded inside lesson explanations.
 */
export default function InlineQuiz({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const answered = revealed && selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div
      className="my-6 rounded"
      style={{ border: "1px solid #1e1e1e", background: "#0a0a0a" }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#888" }}>
          ✦ Check Your Understanding
        </span>
      </div>

      <div className="px-4 py-4">
        <p className="font-display text-sm font-semibold mb-3" style={{ color: "#d0d0d0" }}>
          {question}
        </p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            let bg = "#111";
            let border = "#1e1e1e";
            let color = "#888";

            if (revealed) {
              if (i === correctIndex) {
                bg = "#0f1a00"; border = "#b8ff0060"; color = "#b8ff00";
              } else if (i === selected && i !== correctIndex) {
                bg = "#1a0800"; border = "#ff440060"; color = "#ff6644";
              }
            } else if (selected === i) {
              border = "#666"; color = "#ccc";
            }

            return (
              <button
                key={i}
                onClick={() => !revealed && setSelected(i)}
                className="w-full text-left px-3 py-2.5 rounded transition-all duration-150 font-display text-sm"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: revealed ? "default" : "pointer" }}
              >
                <span className="font-mono text-xs mr-2" style={{ color: "#444" }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
            style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
          >
            Check Answer
          </button>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 px-3 py-2.5 rounded"
              style={{
                background: isCorrect ? "#0f1a00" : "#1a0800",
                border: `1px solid ${isCorrect ? "#b8ff0040" : "#ff440040"}`,
              }}
            >
              <div
                className="font-mono text-xs font-bold mb-1"
                style={{ color: isCorrect ? "#b8ff00" : "#ff6644" }}
              >
                {isCorrect ? "✓ Correct!" : "✗ Not quite"}
              </div>
              {explanation && (
                <p className="font-display text-xs leading-relaxed" style={{ color: "#888" }}>
                  {explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}