export function dayStamp(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

export function dayIndex(stamp) {
  let hash = 0
  for (const char of String(stamp)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return hash
}

export function pickDailyLab(labs, date = new Date()) {
  if (!Array.isArray(labs) || labs.length === 0) return null
  const stamp = dayStamp(date)
  return { ...labs[dayIndex(stamp) % labs.length], dailyStamp: stamp }
}

export function msUntilNextDay(date = new Date()) {
  const next = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  return Math.max(0, next - date.getTime())
}
