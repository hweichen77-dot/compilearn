import React, { useEffect, useState } from "react";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import { createPageUrl } from "../utils";
import { useAuth } from "../lib/AuthContext";
import { summarize, touchStreak } from "../lib/progressStats";
import { Stagger, StaggerItem, AnimatedBar } from "@/lib/motion";
import { Card, StatCard, StatGrid, HeroCard, ProgressBar, PrimaryButton, Eyebrow, KIT } from "@/components/ui/kit";
import { Shield, Flame, BookOpen, FolderGit2 } from "lucide-react";

const LABEL = font.body;
const SERIF = font.display;

export default function AuthHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => { touchStreak(); }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [ps, ls] = await Promise.all([
          api.entities.Project.list("order"),
          api.entities.Lesson.list("order"),
        ]);
        let pr = [];
        if (user?.email) {
          pr = await api.entities.UserProgress.filter({ user_email: user.email });
        }
        if (!active) return;
        setProjects(ps); setLessons(ls); setProgress(pr);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user?.email]);

  const firstName = (user?.name || user?.email?.split("@")[0] || "learner").split(" ")[0];

  const {
    completed, totalXP, lvl, nextLvl, lvlPct, streak,
    projectStats, projectsDone: projectsCompleted, resume,
  } = summarize(progress, projects, lessons);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#15130E" }}>
        <div className="font-sans text-xs tracking-widest uppercase animate-pulse" style={{ color: "#FFFFFF", fontFamily: LABEL }}>
          Loading your progress…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: "#15130E" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <Eyebrow color={KIT.amber} className="mb-2">{greeting}</Eyebrow>
          <h1 style={{ fontFamily: SERIF, fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#F2EDE2", margin: 0, lineHeight: 1.05 }}>
            Welcome back, {firstName}.
          </h1>
          <p className="font-display text-sm mt-3" style={{ color: "#FFFFFF" }}>
            {completed.length > 0
              ? `You've completed ${completed.length} lesson${completed.length === 1 ? "" : "s"} and earned ${totalXP} XP. Keep the streak alive.`
              : "Let's start your first lesson and begin tracking your progress."}
          </p>
        </div>

        <StatGrid className="mb-10">
          <StatCard label="Level" value={lvl.name} sub={`${totalXP} XP total`} icon={Shield} accent={KIT.gold} />
          <StatCard label="Day streak" value={streak} sub={streak > 0 ? "Don't break it" : "Start today"} icon={Flame} accent={KIT.ember} pulse />
          <StatCard label="Lessons done" value={completed.length} sub={`${lessons.length} total`} icon={BookOpen} accent={KIT.amber} />
          <StatCard label="Projects done" value={projectsCompleted} sub={`${projects.length} total`} icon={FolderGit2} accent={KIT.emerald} />
        </StatGrid>

        <Card hover={false} className="p-6 mb-10">
          <div className="flex items-center justify-between mb-3">
            <Eyebrow>Level {lvl.name}</Eyebrow>
            <span className="font-sans text-xs" style={{ color: KIT.dim, fontFamily: LABEL }}>
              {lvl.max === Infinity ? "MAX" : `${lvl.max - totalXP} XP to ${nextLvl.name}`}
            </span>
          </div>
          <ProgressBar pct={lvlPct} />
        </Card>

        {resume && (
          <HeroCard
            eyebrow={resume.done > 0 ? "Continue learning" : "Start here"}
            title={resume.title}
            className="mb-10"
          >
            <div className="font-sans text-xs mt-2" style={{ color: KIT.dim, fontFamily: LABEL }}>
              {resume.done}/{resume.total} lessons · {resume.pct}% complete
            </div>
            <div className="mt-4">
              <ProgressBar pct={resume.pct} color={KIT.emerald} />
            </div>
            <div className="mt-6">
              <PrimaryButton to={`${createPageUrl("ProjectDetail")}?id=${resume.id}`}>
                {resume.done > 0 ? "Resume" : "Begin"}
              </PrimaryButton>
            </div>
          </HeroCard>
        )}

        <div>
          <Eyebrow className="mb-4">Your projects</Eyebrow>
          <Stagger className="space-y-0" as="div">
            {projectStats.map((p, i) => {
              const isDone = p.total > 0 && p.done === p.total;
              return (
                <StaggerItem key={p.id} as="div">
                <Link
                  to={`${createPageUrl("ProjectDetail")}?id=${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-all duration-150"
                  style={{ borderBottom: "1px solid #1F1C15", background: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#131009"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span className="font-sans text-xs w-7 flex-shrink-0" style={{ color: "#FFFFFF", fontFamily: LABEL }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-medium truncate" style={{ color: isDone ? "#E8A33C" : "#ECE7DC" }}>
                      {p.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0" style={{ width: "180px" }}>
                    <div className="flex-1" style={{ height: "5px", background: "#262219", borderRadius: "3px", overflow: "hidden" }}>
                      <AnimatedBar pct={p.pct} color={isDone ? "#E8A33C" : "#9A6A1F"} style={{ height: "100%", borderRadius: "3px" }} />
                    </div>
                    <span className="font-sans text-xs w-12 text-right" style={{ color: "#FFFFFF", fontFamily: LABEL }}>
                      {p.pct}%
                    </span>
                  </div>
                </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </div>
  );
}
