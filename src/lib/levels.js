export const LEVELS = [
  { level: 1, name: "Novice", min: 0, max: 50, color: "#FFFFFF" },
  { level: 2, name: "Learner", min: 50, max: 150, color: "#C2643C" },
  { level: 3, name: "Builder", min: 150, max: 300, color: "#D9A441" },
  { level: 4, name: "Developer", min: 300, max: 500, color: "#f59e0b" },
  { level: 5, name: "Engineer", min: 500, max: 800, color: "#f97316" },
  { level: 6, name: "Architect", min: 800, max: 1200, color: "#FF6B5C" },
  { level: 7, name: "Master", min: 1200, max: Infinity, color: "#5ED29C" },
]

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1]
}
