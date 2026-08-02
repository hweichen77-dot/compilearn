import { readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve('src/content')
const GROUPS = { ai: 'curriculum', products: 'products', csp: 'csp', csa: 'csa' }
const FAILURE_HEADING = /^##\s+What usually goes wrong/im

const rows = []
for (const [track, dir] of Object.entries(GROUPS)) {
  for (const file of readdirSync(path.join(ROOT, dir)).filter((f) => f.startsWith('module') || f.startsWith('product-'))) {
    const mod = await import(pathToFileURL(path.join(ROOT, dir, file)).href)
    for (const lesson of (mod.default || mod).lessons || []) {
      rows.push({
        track,
        file: `${dir}/${file}`,
        id: lesson.id,
        hints: (lesson.hints || []).length + (lesson.challenge_hints || []).length,
        tests: (lesson.challenge_test_cases || []).length,
        failures: FAILURE_HEADING.test(lesson.explanation || '') ? 1 : 0,
      })
    }
  }
}

const pct = (list, fn) => (list.length ? Math.round((list.filter(fn).length / list.length) * 100) : 0)
console.log(`lessons: ${rows.length}\n`)
console.log('track      n    %hints  %failure-section  avg tests  %tests>=5')
for (const track of [...Object.keys(GROUPS), 'ALL']) {
  const list = track === 'ALL' ? rows : rows.filter((r) => r.track === track)
  const avg = (list.reduce((a, r) => a + r.tests, 0) / (list.length || 1)).toFixed(1)
  console.log(
    `${track.padEnd(9)} ${String(list.length).padStart(4)} ${String(pct(list, (r) => r.hints > 0)).padStart(8)}` +
    `${String(pct(list, (r) => r.failures)).padStart(18)} ${avg.padStart(10)} ${String(pct(list, (r) => r.tests >= 5)).padStart(10)}`
  )
}

const gaps = rows.filter((r) => r.hints === 0)
if (gaps.length) {
  const byFile = {}
  for (const r of gaps) byFile[r.file] = (byFile[r.file] || 0) + 1
  console.log(`\nlessons with no hints: ${gaps.length}`)
  for (const [file, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${file}`)
}
