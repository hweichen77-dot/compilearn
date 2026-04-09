import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function LessonExpander() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u?.role === "admin") {
        base44.entities.Lesson.list("order").then(ls => {
          setLessons(ls);
          setLoaded(true);
        });
      }
    }).catch(() => {});
  }, []);

  const runAll = async () => {
    setRunning(true);
    setStatuses({});
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      setCurrentIndex(i);
      setStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
      try {
        await base44.functions.invoke("expandSingleLesson", { lessonId: lesson.id });
        setStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
      } catch (e) {
        setStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
      }
    }
    setCurrentIndex(-1);
    setRunning(false);
  };

  const runOne = async (lesson) => {
    setStatuses(prev => ({ ...prev, [lesson.id]: "running" }));
    try {
      await base44.functions.invoke("expandSingleLesson", { lessonId: lesson.id });
      setStatuses(prev => ({ ...prev, [lesson.id]: "done" }));
    } catch (e) {
      setStatuses(prev => ({ ...prev, [lesson.id]: "error" }));
    }
  };

  const done = Object.values(statuses).filter(s => s === "done").length;
  const errors = Object.values(statuses).filter(s => s === "error").length;

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <p className="font-mono text-sm" style={{ color: "#888" }}>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-16" style={{ background: "#0a0a0a" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>
            ADMIN TOOL
          </span>
          <h1 className="font-display font-bold text-3xl mt-2 mb-1" style={{ color: "#f0f0f0" }}>
            AI Lesson Expander
          </h1>
          <p className="font-display text-sm" style={{ color: "#888" }}>
            Processes every lesson with Claude Sonnet — adds detailed explanations with bold keywords, code examples, quizzes, and participation activities.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-8 p-6" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
          <button
            onClick={runAll}
            disabled={running || !loaded}
            className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all"
            style={{
              background: running ? "#1a1a1a" : "#b8ff00",
              color: running ? "#555" : "#0a0a0a",
              border: "1px solid transparent",
              fontWeight: 700,
              cursor: running ? "not-allowed" : "pointer",
            }}
          >
            {running ? `⏳ Expanding ${currentIndex + 1}/${lessons.length}...` : "🤖 Expand All Lessons"}
          </button>

          {Object.keys(statuses).length > 0 && (
            <div className="font-mono text-xs" style={{ color: "#888" }}>
              <span style={{ color: "#b8ff00" }}>{done} done</span>
              {errors > 0 && <span style={{ color: "#ef4444", marginLeft: "12px" }}>{errors} errors</span>}
              {" / "}{lessons.length} total
            </div>
          )}
        </div>

        {/* Lesson list */}
        {loaded && (
          <div style={{ border: "1px solid #1a1a1a" }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#555" }}>
                {lessons.length} Lessons
              </span>
            </div>
            {lessons.map((lesson, i) => {
              const status = statuses[lesson.id];
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid #111" }}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs w-6 text-right flex-shrink-0" style={{ color: "#333" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-display text-sm font-medium" style={{ color: "#e0e0e0" }}>
                        {lesson.title}
                      </div>
                      {lesson.concept && (
                        <div className="font-mono text-xs" style={{ color: "#555" }}>{lesson.concept}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {status === "running" && (
                      <span className="font-mono text-xs animate-pulse" style={{ color: "#60a5fa" }}>⏳ running...</span>
                    )}
                    {status === "done" && (
                      <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>✓ done</span>
                    )}
                    {status === "error" && (
                      <span className="font-mono text-xs" style={{ color: "#ef4444" }}>✗ error</span>
                    )}
                    {!running && (
                      <button
                        onClick={() => runOne(lesson)}
                        disabled={status === "running"}
                        className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 transition-all"
                        style={{
                          color: "#888", border: "1px solid #1e1e1e",
                          background: "transparent", cursor: "pointer",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#b8ff00"; e.currentTarget.style.borderColor = "#b8ff0033"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
                      >
                        Expand
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}