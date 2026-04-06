import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const STEPS = [
  {
    label: "STEP 01 — CONCEPT",
    title: "Understand the theory",
    body: "Every lesson starts with clear explanations. No jargon. No assumptions.",
    code: `# What is a neural network?
# A function that learns from data

def predict(inputs, weights):
    return sum(i * w for i, w in
               zip(inputs, weights))`,
    outputLabel: null,
  },
  {
    label: "STEP 02 — CODE",
    title: "Write real code",
    body: "Starter code, inline hints, AI tutor available. The editor runs in the browser.",
    code: `import openai

client = openai.OpenAI()

response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[{"role": "user",
             "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    outputLabel: "OUTPUT",
    output: `> "Hello! How can I help you today?"`,
  },
  {
    label: "STEP 03 — RESULT",
    title: "See the output",
    body: "Run code, see results instantly. AI grades your solution and gives feedback.",
    code: `✓ Test 1 passed — API returns string
✓ Test 2 passed — message not empty
✓ Test 3 passed — response < 1s

Score: 100/100
XP earned: +25`,
    outputLabel: "LESSON COMPLETE",
    isResult: true,
  },
];

// Sub-component so hooks are called at top level, not inside .map()
function StepIndicator({ index, step, scrollYProgress }) {
  const bg = useTransform(
    scrollYProgress,
    [index * 0.33 - 0.1, index * 0.33 + 0.1],
    ["#1e1e1e", "#b8ff00"]
  );
  const color = useTransform(
    scrollYProgress,
    [index * 0.33 - 0.1, index * 0.33 + 0.1],
    ["#333", "#0a0a0a"]
  );
  return (
    <div className="flex items-center gap-2">
      <motion.div
        style={{ background: bg, color }}
        className="w-6 h-6 flex items-center justify-center font-mono text-xs font-bold"
      >
        {index + 1}
      </motion.div>
      <span className="font-mono text-xs hidden sm:block" style={{ color: "#333" }}>
        {step.label.split("—")[1]?.trim()}
      </span>
    </div>
  );
}

function StepCard({ index, step, scrollYProgress }) {
  const isLast = index === STEPS.length - 1;
  const opacity = useTransform(
    scrollYProgress,
    [index * 0.33 - 0.06, index * 0.33 + 0.06, (index + 1) * 0.33 - 0.06, (index + 1) * 0.33 + 0.06],
    [0, 1, 1, isLast ? 1 : 0]
  );
  const y = useTransform(
    scrollYProgress,
    [index * 0.33 - 0.06, index * 0.33 + 0.06],
    [20, 0]
  );

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none" }}
    >
      <div className="p-6">
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b8ff00" }}>
          {step.label}
        </div>
        <div className="mb-5">
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}>
            {step.title}
          </h3>
          <p className="font-display text-sm" style={{ color: "#555", fontWeight: 400 }}>
            {step.body}
          </p>
        </div>
        <div className="p-4 mb-4" style={{ background: "#080808", border: "1px solid #1a1a1a" }}>
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto" style={{ color: step.isResult ? "#b8ff00" : "#888" }}>
            {step.code}
          </pre>
        </div>
        {step.outputLabel && (
          <div className="flex items-center gap-3 px-3 py-2" style={{ border: "1px solid #1e1e1e" }}>
            <span
              className="font-mono text-xs tracking-widest uppercase px-2 py-0.5"
              style={{
                color: step.isResult ? "#b8ff00" : "#888",
                border: `1px solid ${step.isResult ? "#b8ff0033" : "#2a2a2a"}`,
                background: step.isResult ? "#b8ff0010" : "transparent",
              }}
            >
              {step.outputLabel}
            </span>
            {step.output && (
              <span className="font-mono text-xs" style={{ color: "#555" }}>{step.output}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LearningScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.88, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: "400vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ background: "#080808" }}
      >
        <motion.div style={{ opacity: sceneOpacity }} className="w-full max-w-5xl mx-auto px-6">
          <div className="font-mono text-xs tracking-widest uppercase mb-8 text-center" style={{ color: "#2a2a2a" }}>
            § THE LEARNING EXPERIENCE
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-8 mb-10">
            {STEPS.map((s, i) => (
              <StepIndicator key={i} index={i} step={s} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* Main editor frame */}
          <div
            className="relative mx-auto"
            style={{ border: "1px solid #1e1e1e", background: "#0d0d0d", maxWidth: "680px" }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#b8ff00" }} />
              <span className="font-mono text-xs ml-4" style={{ color: "#2a2a2a" }}>lesson_01.py</span>
            </div>
            <div className="relative" style={{ minHeight: "320px" }}>
              {STEPS.map((s, i) => (
                <StepCard key={i} index={i} step={s} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}