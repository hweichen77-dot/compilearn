import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

const store = new Map()
const localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
globalThis.localStorage = localStorage
globalThis.window = { localStorage }

const { getStreak, touchStreak, getStreakInfo, summarize, namespacedKey } =
  await import('./progressStats.js')

const KEY = namespacedKey('codeflow_streak', 'guest')
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toDateString()
const seed = (data) => store.set(KEY, JSON.stringify(data))
const read = () => JSON.parse(store.get(KEY))

beforeEach(() => store.clear())

test('a first visit starts the streak at one', () => {
  assert.equal(touchStreak(), 1)
  assert.equal(read().streak, 1)
})

test('a second visit the same day does not advance the streak', () => {
  seed({ lastVisit: daysAgo(0), streak: 4 })
  assert.equal(touchStreak(), 4)
})

test('a visit the next day advances the streak', () => {
  seed({ lastVisit: daysAgo(1), streak: 4 })
  assert.equal(touchStreak(), 5)
})

test('missing two days without a freeze resets the streak', () => {
  seed({ lastVisit: daysAgo(3), streak: 9, freezes: 0 })
  assert.equal(touchStreak(), 1)
})

test('a freeze covers a single missed day and is spent', () => {
  seed({ lastVisit: daysAgo(2), streak: 7, freezes: 2 })
  assert.equal(touchStreak(), 8)
  assert.equal(read().freezes, 1, 'the freeze should be consumed')
})

test('spending a freeze on a milestone day earns one straight back', () => {
  seed({ lastVisit: daysAgo(2), streak: 9, freezes: 2 })
  assert.equal(touchStreak(), 10)
  assert.equal(read().freezes, 2, 'one spent on the gap, one granted at streak 10')
})

test('without a freeze a missed day resets the streak', () => {
  seed({ lastVisit: daysAgo(2), streak: 9, freezes: 0 })
  assert.equal(touchStreak(), 1)
})

test('every fifth day of streak grants a freeze', () => {
  seed({ lastVisit: daysAgo(1), streak: 4, freezes: 0 })
  assert.equal(touchStreak(), 5)
  assert.equal(read().freezes, 1)
})

test('freezes are capped at three', () => {
  seed({ lastVisit: daysAgo(1), streak: 9, freezes: 3 })
  touchStreak()
  assert.equal(read().freezes, 3)
})

test('longest streak is remembered after a reset', () => {
  seed({ lastVisit: daysAgo(5), streak: 12, longest: 12 })
  touchStreak()
  assert.equal(read().streak, 1)
  assert.equal(read().longest, 12)
})

test('getStreak reports zero once the streak has lapsed', () => {
  seed({ lastVisit: daysAgo(4), streak: 7, freezes: 0 })
  assert.equal(getStreak(), 0)
})

test('getStreak holds the streak while a freeze can still cover the gap', () => {
  seed({ lastVisit: daysAgo(2), streak: 7, freezes: 1 })
  assert.equal(getStreak(), 7)
})

test('getStreakInfo flags a streak that is at risk today', () => {
  seed({ lastVisit: daysAgo(1), streak: 3, freezes: 0 })
  const info = getStreakInfo()
  assert.equal(info.current, 3)
  assert.equal(info.activeToday, false)
  assert.equal(info.atRisk, true)
})

test('getStreakInfo does not flag risk on a day already counted', () => {
  seed({ lastVisit: daysAgo(0), streak: 3 })
  const info = getStreakInfo()
  assert.equal(info.activeToday, true)
  assert.equal(info.atRisk, false)
})

test('summarize totals xp and derives the level', () => {
  const progress = [
    { lesson_id: 'a', completed: true, points_earned: 40 },
    { lesson_id: 'b', completed: true, points_earned: 30 },
    { lesson_id: 'c', completed: false, points_earned: 999 },
  ]
  const out = summarize(progress, [], [])
  assert.equal(out.totalXP, 70, 'incomplete lessons must not count')
  assert.equal(out.lvl.level, 2)
  assert.equal(out.completedCount, 2)
})

test('summarize defaults missing points to ten', () => {
  const out = summarize([{ lesson_id: 'a', completed: true }], [], [])
  assert.equal(out.totalXP, 10)
})

test('summarize computes per-project completion', () => {
  const projects = [{ id: 'p1' }, { id: 'p2' }]
  const lessons = [
    { id: 'l1', project_id: 'p1' },
    { id: 'l2', project_id: 'p1' },
    { id: 'l3', project_id: 'p2' },
  ]
  const progress = [
    { lesson_id: 'l1', completed: true },
    { lesson_id: 'l2', completed: true },
  ]
  const out = summarize(progress, projects, lessons)
  const p1 = out.projectStats.find((p) => p.id === 'p1')
  const p2 = out.projectStats.find((p) => p.id === 'p2')
  assert.equal(p1.pct, 100)
  assert.equal(p2.pct, 0)
  assert.equal(out.projectsDone, 1)
  assert.equal(out.projectsStarted, 1)
})

test('summarize does not divide by zero for an empty project', () => {
  const out = summarize([], [{ id: 'p1' }], [])
  assert.equal(out.projectStats[0].pct, 0)
  assert.equal(out.projectsDone, 0)
})
