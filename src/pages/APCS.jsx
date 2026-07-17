import React, { useState } from "react";
import "@/styles/landing.css";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/apiClient";
import ProgressRing from "../components/gamification/ProgressRing";
import { Stagger, StaggerItem } from "@/lib/motion";
import { Reveal } from "@/components/landing/primitives";

const eyebrow = { color: "#f4b95a", fontFamily: font.mono, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 };

const TRACKS = [
  { key: "apcsp", label: "AP CSP", title: "Computer Science Principles", lang: "Python · pseudocode",
    blurb: "The five Big Ideas of computing, creative development, data, algorithms & programming, systems & networks, and the impact of computing. Runnable Python plus exam-style practice." },
  { key: "apcsa", label: "AP CSA", title: "Computer Science A", lang: "Java",
    blurb: "Object-oriented Java across all ten units, from primitive types to recursion. Every concept comes with autograded Java drills and FRQ-style practice." },
];

const DIFF_COLOR = {
  beginner: { color: "#E8A33C", border: "#E8A33C33", bg: "#E8A33C10" },
  intermediate: { color: "#f4b95a", border: "#f4b95a33", bg: "#f4b95a10" },
  advanced: { color: "#FF6B5C", border: "#FF6B5C33", bg: "#FF6B5C10" },
};

export default function APCS() {
  const [track, setTrack] = useState("apcsp");

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.auth.me().catch(() => null),
  });
  const { data: lessons = [] } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: () => api.entities.Lesson.list("order"),
  });
  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const completedIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
  const modulePct = (projectId) => {
    const ls = lessons.filter((l) => l.project_id === projectId);
    if (ls.length === 0) return 0;
    const done = ls.filter((l) => completedIds.has(l.id)).length;
    return Math.round((done / ls.length) * 100);
  };

  const active = TRACKS.find((t) => t.key === track);
  const trackProjects = projects.filter((p) => p.track === track);

  const units = [];
  const byUnit = new Map();
  for (const p of trackProjects) {
    const u = p.unit || "Modules";
    if (!byUnit.has(u)) { byUnit.set(u, []); units.push(u); }
    byUnit.get(u).push(p);
  }

  return (
    <div className="min-h-screen" style={{ background: "#0c0a08" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-12" style={{ borderBottom: "1px solid #2a231a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div style={{ ...eyebrow, marginBottom: 14 }}>AP COMPUTER SCIENCE</div>
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "#F2EDE2", lineHeight: 1.08, margin: "0 0 20px" }}>
              Pass the AP exam.<br />
              <span className="cl-grad">And understand it.</span>
            </h1>
            <p style={{ fontFamily: font.body, color: "#a99f8f", fontSize: 18, maxWidth: 560, lineHeight: 1.55 }}>
              CSP in Python, CSA in Java. Both follow the AP exam, and you write code the whole way, with practice on the multiple choice and FRQs.
            </p>
            <p style={{ fontFamily: font.mono, fontSize: 12, maxWidth: 560, marginTop: 20, color: "#6f665a", lineHeight: 1.6 }}>
              Compilearn is an independent project, not affiliated with or endorsed by the College Board. AP® and Advanced Placement® are registered trademarks of the College Board.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 pt-10">
        <div className="flex gap-2 mb-2">
          {TRACKS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTrack(t.key)}
              className="transition-all duration-150"
              style={{
                fontFamily: font.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
                padding: "12px 20px", borderRadius: 10,
                color: track === t.key ? "#1a1206" : "#a99f8f",
                background: track === t.key ? "#E8A33C" : "transparent",
                border: `1px solid ${track === t.key ? "#E8A33C" : "#2a231a"}`,
                fontWeight: 700,
                boxShadow: track === t.key ? "0 6px 24px -8px rgba(232,163,60,.6)" : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p style={{ fontFamily: font.body, fontSize: 14, marginTop: 16, marginBottom: 4, color: "#a99f8f", lineHeight: 1.55 }}>
          <span style={{ fontFamily: font.mono, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "#E8A33C" }}>{active.lang}</span>
          &nbsp;·&nbsp; {active.blurb}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12 space-y-12">
        {trackProjects.length === 0 ? (
          <div style={{ fontFamily: font.body, fontSize: 15, color: "#a99f8f", textAlign: "center", padding: "80px 0" }}>
            {active.label} curriculum is coming soon.
          </div>
        ) : (
          units.map((unit) => (
            <div key={unit}>
              <Reveal><div style={{ ...eyebrow, marginBottom: 18 }}>{unit}</div></Reveal>
              <Stagger as="div" style={{ borderTop: "1px solid #2a231a" }}>
                {byUnit.get(unit).map((p, i) => {
                  const dc = DIFF_COLOR[p.difficulty] || DIFF_COLOR.beginner;
                  const pct = modulePct(p.id);
                  const done = pct === 100;
                  return (
                    <StaggerItem key={p.id} as="div">
                    <Link
                      to={createPageUrl(`ProjectDetail?id=${p.id}`)}
                      className="group block"
                    >
                      <div
                        className="grid gap-8 px-6 py-6 transition-all duration-200"
                        style={{ gridTemplateColumns: "3rem 1fr auto", borderBottom: "1px solid #1C1A14" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#17130e"; e.currentTarget.style.paddingLeft = "1.75rem"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.paddingLeft = "1.5rem"; }}
                      >
                        <div className="flex items-center" style={{ minWidth: "3rem" }}>
                          {pct > 0 ? (
                            <ProgressRing percent={pct} size={38} color="#E8A33C" />
                          ) : (
                            <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "1.5rem", color: "#6f665a", letterSpacing: "-0.05em" }}>
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-display font-bold text-base group-hover:text-white transition-colors duration-150" style={{ color: done ? "#E8A33C" : "#F2EDE2", letterSpacing: "-0.02em" }}>
                              {p.title}
                            </span>
                            {done && (
                              <span style={{ fontFamily: font.mono, fontSize: 11, color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10", borderRadius: 6, padding: "1px 8px" }}>
                                DONE
                              </span>
                            )}
                          </div>
                          <p style={{ fontFamily: font.body, fontSize: 14, color: "#a99f8f", marginBottom: 12, lineHeight: 1.5 }}>
                            {p.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(p.tags || []).slice(0, 4).map((c) => (
                              <span key={c} style={{ fontFamily: font.mono, fontSize: 11, color: "#a99f8f", border: "1px solid #2a231a", borderRadius: 6, padding: "1px 8px" }}>
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span
                            style={{ fontFamily: font.mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: dc.color, border: `1px solid ${dc.border}`, background: dc.bg, borderRadius: 6, padding: "3px 10px" }}
                          >
                            {p.difficulty}
                          </span>
                        </div>
                      </div>
                    </Link>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
