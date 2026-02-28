import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, BookOpen } from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => { base44.auth.redirectToLogin(); });
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => base44.entities.Project.list("order"),
  });

  if (!user) return null;

  const completedProgress = progress.filter((p) => p.completed);
  const completedLessons = completedProgress.length;

  // Activity heatmap data (last 52 weeks)
  const activityMap = {};
  completedProgress.forEach((p) => {
    if (p.completed_date) {
      const day = p.completed_date.slice(0, 10);
      activityMap[day] = (activityMap[day] || 0) + 1;
    }
  });

  const weeks = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 364);
  // align to Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let cur = new Date(startDate);
  while (cur <= now) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().slice(0, 10);
      week.push({ date: dateStr, count: activityMap[dateStr] || 0 });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const monthLabels = [];
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).toLocaleString("default", { month: "short" });
    if (i === 0 || month !== monthLabels[monthLabels.length - 1]?.label) {
      monthLabels.push({ label: month, index: i });
    }
  });

  // Project stats
  const notStartedProjects = projects.filter((proj) => {
    return !progress.some((p) => p.project_id === proj.id);
  });

  const inProgressProjects = projects
    .filter((proj) => {
      const pp = progress.filter((p) => p.project_id === proj.id && p.completed);
      return pp.length > 0 && (!proj.lessons_count || pp.length < proj.lessons_count);
    })
    .map((proj) => ({
      ...proj,
      doneCount: progress.filter((p) => p.project_id === proj.id && p.completed).length,
    }));

  const completedProjects = projects.filter((proj) => {
    const pp = progress.filter((p) => p.project_id === proj.id && p.completed);
    return proj.lessons_count && pp.length >= proj.lessons_count;
  });

  const statColor = (val) => {
    if (val === 0) return "text-gray-400";
    return "text-gray-900";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Welcome, {user.full_name?.split(" ")[0] || "Learner"}!
          </h2>
          <p className="text-[#6C5CE7] text-sm font-medium">
            Continue where you left off, or start a new project.
          </p>
        </div>
        <Link to={createPageUrl("Projects")}>
          <Button className="bg-[#1a1a2e] hover:bg-[#16213e] text-white font-semibold px-6 rounded-md">
            Browse Projects →
          </Button>
        </Link>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Activity</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Month labels */}
            <div className="flex mb-1 ml-8">
              {monthLabels.map((m) => (
                <div
                  key={m.label + m.index}
                  className="text-xs text-gray-400"
                  style={{ marginLeft: `${m.index === 0 ? 0 : (m.index - (monthLabels[monthLabels.indexOf(m) - 1]?.index || 0)) * 14}px` }}
                >
                  {m.label}
                </div>
              ))}
            </div>
            <div className="flex gap-0.5">
              {/* Day labels */}
              <div className="flex flex-col gap-0.5 mr-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                  <div key={d} className="h-3 w-6 text-[10px] text-gray-400 flex items-center">
                    {i % 2 === 1 ? d.slice(0,3) : ""}
                  </div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-0.5">
                  {week.map((day) => {
                    const intensity = day.count === 0 ? "bg-gray-100" : day.count === 1 ? "bg-[#A29BFE]" : day.count <= 3 ? "bg-[#6C5CE7]" : "bg-[#5A4BD1]";
                    const isFuture = day.date > now.toISOString().slice(0, 10);
                    return (
                      <div
                        key={day.date}
                        title={day.count ? `${day.date}: ${day.count} lesson${day.count > 1 ? "s" : ""}` : day.date}
                        className={`w-3 h-3 rounded-sm ${isFuture ? "opacity-0" : intensity} cursor-pointer hover:ring-1 hover:ring-[#6C5CE7]/60 transition-all`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Lessons completed per day.</p>
      </div>

      {/* Statistics */}
      <h2 className="text-xl font-bold mb-4">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Project Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-5">Project Progress</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "COMPLETED", value: completedProjects.length, color: "text-green-600 bg-green-50" },
              { label: "IN PROGRESS", value: inProgressProjects.length, color: "text-yellow-600 bg-yellow-50" },
              { label: "NOT STARTED", value: notStartedProjects.length, color: "text-gray-500 bg-gray-50" },
              { label: "TOTAL", value: projects.length, color: "text-gray-800 bg-gray-50" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${s.color}`}>
                  {s.value}
                </div>
                <span className="text-[9px] font-semibold text-gray-400 tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: projects.length ? `${(completedProjects.length / projects.length) * 100}%` : "0%" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{projects.length} total</p>
        </div>

        {/* Lessons Progress */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-5">Lessons Progress</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: "COMPLETED", value: completedLessons, color: "text-green-600 bg-green-50" },
              { label: "IN PROGRESS", value: inProgressProjects.length, color: "text-yellow-600 bg-yellow-50" },
              { label: "PROJECTS DONE", value: completedProjects.length, color: "text-blue-600 bg-blue-50" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${s.color}`}>
                  {s.value}
                </div>
                <span className="text-[9px] font-semibold text-gray-400 tracking-wide">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6C5CE7] rounded-full"
              style={{ width: completedLessons > 0 ? `${Math.min((completedLessons / Math.max(projects.reduce((s,p) => s + (p.lessons_count||0), 0), 1)) * 100, 100)}%` : "0%" }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 text-right">{completedLessons} completed</p>
        </div>
      </div>

      {/* In Progress */}
      {inProgressProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Continue Learning</h2>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {inProgressProjects.map((project) => {
              const pct = project.lessons_count ? Math.round((project.doneCount / project.lessons_count) * 100) : 0;
              return (
                <Link key={project.id} to={createPageUrl(`ProjectDetail?id=${project.id}`)} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 group-hover:text-[#6C5CE7] transition-colors truncate">{project.title}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                        <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{project.doneCount}/{project.lessons_count} lessons</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#6C5CE7] transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {progress.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">No activity yet</h3>
          <p className="text-sm text-gray-400 mb-5">Start your first project to track progress here.</p>
          <Link to={createPageUrl("Projects")}>
            <Button className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-md px-6">
              Browse Projects <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}