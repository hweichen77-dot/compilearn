import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { CheckCircle2, Circle, Clock, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const SECTIONS = [
  { key: "beginner", label: "Beginner", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
  { key: "intermediate", label: "Intermediate", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-500" },
  { key: "advanced", label: "Advanced", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
];

const CATEGORIES = [
  { value: "all", label: "All Topics" },
  { value: "html_css", label: "HTML & CSS" },
  { value: "javascript", label: "JavaScript" },
  { value: "react", label: "React" },
  { value: "python", label: "Python" },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.Project.list("order"),
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["progress", user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email, completed: true }),
    enabled: !!user,
  });

  const getStatus = (project) => {
    const pp = progress.filter((p) => p.project_id === project.id);
    if (pp.length === 0) return "not_started";
    if (project.lessons_count && pp.length >= project.lessons_count) return "completed";
    return "in_progress";
  };

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  const statusIcon = (status) => {
    if (status === "completed") return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
    if (status === "in_progress") return <Circle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
    return <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />;
  };

  return (
    <div className="flex min-h-screen bg-[#f7f8fa]">
      {/* Left sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 flex-shrink-0 border-r border-gray-200 bg-white sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">Topics</p>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                  category === cat.value
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7] font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2 mt-6">Difficulty</p>
          <div className="space-y-0.5">
            {SECTIONS.map((s) => (
              <a key={s.key} href={`#section-${s.key}`} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl">
        {/* Search */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projects</h1>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-9 rounded-md border-gray-200 bg-white text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
          </div>
        ) : (
          <div className="space-y-10">
            {SECTIONS.map((section) => {
              const sectionProjects = filtered.filter((p) => p.difficulty === section.key);
              if (sectionProjects.length === 0) return null;
              return (
                <div key={section.key} id={`section-${section.key}`}>
                  {/* Section header */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${section.bg} ${section.color} border ${section.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${section.dot}`} />
                    {section.label}
                  </div>

                  {/* Project rows */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100">
                    {sectionProjects.map((project) => {
                      const status = getStatus(project);
                      const pp = progress.filter((p) => p.project_id === project.id);
                      const pct = project.lessons_count ? Math.round((pp.length / project.lessons_count) * 100) : 0;
                      return (
                        <Link
                          key={project.id}
                          to={createPageUrl(`ProjectDetail?id=${project.id}`)}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group"
                        >
                          {statusIcon(status)}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 group-hover:text-[#6C5CE7] transition-colors">
                              {project.title}
                            </span>
                            {status === "in_progress" && (
                              <div className="mt-1 flex items-center gap-2">
                                <div className="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#6C5CE7] rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="text-xs text-gray-400">{pct}%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {project.estimated_time && (
                              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="w-3 h-3" /> {project.estimated_time}m
                              </span>
                            )}
                            {project.lessons_count && (
                              <span className="text-xs text-gray-400">{project.lessons_count} lessons</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p>No projects found</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}