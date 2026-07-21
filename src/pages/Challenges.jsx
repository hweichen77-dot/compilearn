import React, { useState, useMemo } from "react";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import { CATEGORY_LABELS } from "@/content/categories";
import { Reveal } from "@/components/kit";
import {
  CatalogPage, CatalogHero, FilterToolbar, SearchInput, Facet, TagChips,
  CardGrid, CourseCard, EmptyState, CardSkeleton, TRACK_ACCENT,
} from "@/components/catalog/CatalogKit";

const LEVELS = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SORTS = [
  { value: "difficulty", label: "Easiest first" },
  { value: "order", label: "Curriculum order" },
];

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sort, setSort] = useState("difficulty");
  const [topic, setTopic] = useState(null);

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges", sort],
    queryFn: () => api.entities.Challenge.list(sort),
  });

  const topics = useMemo(() => {
    const set = new Set();
    challenges.forEach((c) => { const t = c.topic || c.category; if (t) set.add(t); });
    return [...set];
  }, [challenges]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return challenges.filter((c) => {
      const matchSearch = !search || c.title?.toLowerCase().includes(q);
      const matchDifficulty = difficulty === "all" || c.difficulty === difficulty;
      const matchTopic = !topic || (c.topic || c.category) === topic;
      return matchSearch && matchDifficulty && matchTopic;
    });
  }, [challenges, search, difficulty, topic]);

  return (
    <CatalogPage>
      <CatalogHero
        title="One problem at a time."
        lead="Focused problems. No setup. Pure coding."
        accent={TRACK_ACCENT.challenges}
      />

      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10">
        <FilterToolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Filter challenges…" />
          <Facet label="Level" options={LEVELS} value={difficulty} onChange={setDifficulty} />
          <div className="sm:ml-auto">
            <Facet label="Sort" options={SORTS} value={sort} onChange={setSort} />
          </div>
        </FilterToolbar>
        {topics.length > 0 && (
          <div className="mb-8">
            <TagChips
              tags={topics.map((t) => CATEGORY_LABELS[t] || t)}
              active={topic ? CATEGORY_LABELS[topic] || topic : null}
              onToggle={(label) => {
                if (!label) return setTopic(null);
                const found = topics.find((t) => (CATEGORY_LABELS[t] || t) === label);
                setTopic(found || null);
              }}
            />
          </div>
        )}

        {isLoading ? (
          <CardSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState>No challenges match your filters.</EmptyState>
        ) : (
          <Reveal>
            <CardGrid>
              {filtered.map((challenge, i) => (
                <CourseCard
                  key={challenge.id}
                  to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}
                  accent={TRACK_ACCENT.challenges}
                  index={String(i + 1).padStart(2, "0")}
                  title={challenge.title}
                  description={challenge.description || challenge.project_title}
                  tags={[CATEGORY_LABELS[challenge.topic] || challenge.topic || challenge.category].filter(Boolean)}
                  meta={[
                    challenge.difficulty,
                    `+${challenge.xp || 15} XP`,
                  ]}
                />
              ))}
            </CardGrid>
          </Reveal>
        )}
      </div>
    </CatalogPage>
  );
}
