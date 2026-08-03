import { writeFileSync, mkdtempSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONTENT = join(ROOT, 'src', 'content')
const TARGET = Number(process.env.TARGET_CASES || 5)
const APPLY = process.argv.includes('--apply')
const LIMIT = Number(process.env.LIMIT || 0)

const mod = await import('../src/content/index.js')
const LESSONS = mod.LESSONS

const langOf = (l) => {
  const sol = l.challenge_solution_code || ''
  return l.challenge_language || l.language ||
    (sol.includes('#include') ? 'cpp' : sol.includes('public class') ? 'java' : 'py')
}

const isInt = (t) => /^-?\d+$/.test(t)
const isFloat = (t) => /^-?\d*\.\d+$/.test(t)

function shapeOf(input) {
  return String(input).split('\n').map((line) => line.split(' ').length).join(',')
}

function frozenPositions(lines) {
  const frozen = new Set()
  const multi = lines.length > 1
  lines.forEach((line, i) => {
    line.split(' ').forEach((tok, j) => {
      if (multi && i === 0) { frozen.add(`${i}:${j}`); return }
      if (!isInt(tok)) return
      const v = Number(tok)
      const after = lines.length - i - 1
      if (v === after || v === after - 1 || v === after - 2) frozen.add(`${i}:${j}`)
      if (v === lines.length) frozen.add(`${i}:${j}`)
      if (lines[i + 1] && v === lines[i + 1].split(' ').length) frozen.add(`${i}:${j}`)
    })
  })
  return frozen
}

function observedValues(inputs) {
  const ints = new Map()
  const floats = new Map()
  const words = new Map()
  for (const raw of inputs) {
    String(raw).split('\n').forEach((line, i) => {
      line.split(' ').forEach((tok, j) => {
        const key = `${i}:${j}`
        if (isInt(tok)) {
          if (!ints.has(key)) ints.set(key, [])
          ints.get(key).push(Number(tok))
        } else if (isFloat(tok)) {
          if (!floats.has(key)) floats.set(key, [])
          floats.get(key).push(Number(tok))
        } else {
          if (!words.has(key)) words.set(key, [])
          words.get(key).push(tok)
        }
      })
    })
  }
  return { ints, floats, words }
}

const isPlainWord = (t) => /^[A-Za-z0-9]+$/.test(t)

function allWords(inputs) {
  const set = new Set()
  for (const raw of inputs) {
    for (const tok of String(raw).split(/[\s\n]+/)) {
      if (isPlainWord(tok) && !isInt(tok)) set.add(tok)
    }
  }
  return [...set]
}

function mutate(template, obs, vocab, rng) {
  const lines = String(template).split('\n')
  const frozen = frozenPositions(lines)
  const out = lines.map((line, i) =>
    line
      .split(' ')
      .map((tok, j) => {
        const key = `${i}:${j}`
        if (frozen.has(key)) return tok
        if (isInt(tok)) {
          const seen = obs.ints.get(key) || [Number(tok)]
          const lo = Math.min(...seen, Number(tok))
          const hi = Math.max(...seen, Number(tok))
          if (lo === hi) {
            const deltas = lo === 0 ? [0, 1] : [lo, Math.max(lo - 1, lo < 0 ? lo - 1 : 0), lo + 1]
            return String(deltas[Math.floor(rng() * deltas.length)])
          }
          return String(lo + Math.floor(rng() * (hi - lo + 1)))
        }
        if (isFloat(tok)) {
          const seen = obs.floats.get(key) || [Number(tok)]
          const lo = Math.min(...seen, Number(tok))
          const hi = Math.max(...seen, Number(tok))
          const places = (tok.split('.')[1] || '').length
          const v = lo === hi ? lo : lo + rng() * (hi - lo)
          return v.toFixed(places)
        }
        if (!isPlainWord(tok)) return tok
        const seen = (obs.words.get(key) || []).filter(isPlainWord)
        const pool = seen.length > 1 ? seen : []
        if (!pool.length) return tok
        return pool[Math.floor(rng() * pool.length)]
      })
      .join(' '),
  )
  return out.join('\n')
}

function makeRng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const dir = mkdtempSync(join(tmpdir(), 'cfexpand-'))
let javaOk = false
try { execFileSync('javac', ['-version'], { stdio: 'ignore' }); javaOk = true } catch { }

function runner(lesson) {
  const sol = lesson.challenge_solution_code
  const lang = langOf(lesson)
  if (lang === 'py' || lang === 'python') {
    const file = join(dir, `s_${Math.random().toString(36).slice(2)}.py`)
    writeFileSync(file, sol)
    return (input) => execFileSync('python3', [file], { input: `${input}\n`, timeout: 8000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
  }
  if (lang === 'java') {
    if (!javaOk) return null
    const sub = mkdtempSync(join(dir, 'j_'))
    writeFileSync(join(sub, 'Main.java'), sol)
    execFileSync('javac', [join(sub, 'Main.java')], { cwd: sub, timeout: 40000, stdio: 'pipe' })
    return (input) => execFileSync('java', ['-cp', sub, 'Main'], { input: `${input}\n`, timeout: 10000, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
  }
  return null
}

const norm = (s) => String(s).replace(/[ \t]+$/gm, '').replace(/\n+$/, '')

const targets = LESSONS.filter(
  (l) => l.challenge_solution_code && Array.isArray(l.challenge_test_cases) &&
    l.challenge_test_cases.length > 0 && l.challenge_test_cases.length < TARGET &&
    langOf(l) !== 'cpp',
)

const work = LIMIT ? targets.slice(0, LIMIT) : targets
const generated = new Map()
const stats = { done: 0, short: 0, skipped: 0, added: 0 }

for (const lesson of work) {
  const existing = lesson.challenge_test_cases
  const need = TARGET - existing.length
  let run
  try { run = runner(lesson) } catch { run = null }
  if (!run) { stats.skipped++; continue }

  const inputs = existing.map((c) => String(c.input))
  const obs = observedValues(inputs)
  const vocab = allWords(inputs)
  const seenInputs = new Set(inputs.map(norm))
  const seenOutputs = new Set(existing.map((c) => norm(c.expected_output)))
  const accepted = []
  const rng = makeRng(lesson.id.split('').reduce((a, c) => a + c.charCodeAt(0), 7))

  for (let attempt = 0; attempt < 60 && accepted.length < need; attempt++) {
    const template = inputs[attempt % inputs.length]
    const candidate = mutate(template, obs, vocab, rng)
    if (seenInputs.has(norm(candidate))) continue
    if (shapeOf(candidate) !== shapeOf(template)) continue
    let out
    try { out = run(candidate) } catch { continue }
    out = norm(out)
    if (!out) continue
    const preferNew = attempt < 40
    if (preferNew && seenOutputs.has(out)) continue
    seenInputs.add(norm(candidate))
    seenOutputs.add(out)
    accepted.push({ input: candidate, expected_output: out })
  }

  if (accepted.length) {
    generated.set(lesson.id, accepted)
    stats.added += accepted.length
  }
  if (accepted.length < need) stats.short++
  stats.done++
  if (stats.done % 25 === 0) console.log(`[expand] ${stats.done}/${work.length} lessons, ${stats.added} cases`)
}

console.log(`[expand] lessons processed ${stats.done}, cases generated ${stats.added}, short ${stats.short}, skipped ${stats.skipped}`)

function contentFiles(d) {
  return readdirSync(d).flatMap((f) => {
    const p = join(d, f)
    if (statSync(p).isDirectory()) return contentFiles(p)
    return p.endsWith('.js') ? [p] : []
  })
}

function serializeCase(c, { quoted, singleLine, indent, trailingComma }) {
  const k = (name) => (quoted ? `"${name}"` : name)
  const inner = `${k('input')}: ${JSON.stringify(c.input)}, ${k('expected_output')}: ${JSON.stringify(c.expected_output)}`
  if (singleLine) return `${indent}{ ${inner} }`
  const pad = `${indent}  `
  return `${indent}{\n${pad}${k('input')}: ${JSON.stringify(c.input)},\n${pad}${k('expected_output')}: ${JSON.stringify(c.expected_output)}${trailingComma ? ',' : ''}\n${indent}}`
}

const signatures = new Map()
for (const [id] of generated) {
  const lesson = LESSONS.find((l) => l.id === id)
  signatures.set(id, {
    count: lesson.challenge_test_cases.length,
    parts: lesson.challenge_test_cases.flatMap((c) => [
      JSON.stringify(String(c.input)),
      JSON.stringify(String(c.expected_output)),
    ]),
  })
}
const applied = new Set()

function applyToFile(file) {
  let text = readFileSync(file, 'utf8')
  let changed = 0
  let cursor = 0
  const marker = /(["']?)challenge_test_cases\1\s*:\s*\[/g
  const edits = []
  let m
  while ((m = marker.exec(text))) {
    const openIdx = m.index + m[0].length - 1
    let depth = 0
    let i = openIdx
    for (; i < text.length; i++) {
      const ch = text[i]
      if (ch === '"' || ch === "'" || ch === '`') {
        const quote = ch
        i++
        while (i < text.length && text[i] !== quote) { if (text[i] === '\\') i++; i++ }
        continue
      }
      if (ch === '[') depth++
      else if (ch === ']') { depth--; if (depth === 0) break }
    }
    const closeIdx = i
    const body = text.slice(openIdx + 1, closeIdx)
    const entryCount = (body.match(/["']?input["']?\s*:/g) || []).length
    const matches = [...signatures.entries()].filter(
      ([id, sig]) => !applied.has(id) && sig.count === entryCount && sig.parts.every((p) => body.includes(p)),
    )
    if (matches.length !== 1) { cursor = closeIdx; continue }
    const lessonId = matches[0][0]
    const firstBrace = body.indexOf('{')
    if (firstBrace < 0) continue
    const lineStart = body.lastIndexOf('\n', firstBrace) + 1
    const indent = body.slice(lineStart, firstBrace)
    const closeBrace = body.indexOf('}', firstBrace)
    const singleLine = !body.slice(firstBrace, closeBrace).includes('\n')
    const quoted = /"input"\s*:/.test(body)
    const tail = body.slice(0, body.lastIndexOf('}') + 1)
    const trailingComma = /,\s*$/.test(body.slice(0, body.lastIndexOf('}')).trimEnd().slice(-200).replace(/[^,\s]*$/, '')) || /},\s*\]?\s*$/.test(body.trimEnd() + ']')
    const lastNonSpace = body.replace(/\s+$/, '').slice(-1)
    const needsComma = lastNonSpace !== ',' && lastNonSpace !== '['
    const opts = { quoted, singleLine, indent, trailingComma: false }
    const additions = generated.get(lessonId).map((c) => serializeCase(c, opts)).join(',\n')
    let k = closeIdx - 1
    while (k > openIdx && /\s/.test(text[k])) k--
    const insertion = `${needsComma ? ',' : ''}\n${additions}`
    edits.push({ at: k + 1, insertion, lessonId })
    applied.add(lessonId)
    changed++
    cursor = closeIdx
    void tail
  }
  if (!edits.length) return 0
  for (const e of edits.reverse()) {
    text = text.slice(0, e.at) + e.insertion + text.slice(e.at)
  }
  if (APPLY) writeFileSync(file, text)
  return changed
}

if (APPLY) {
  let files = 0, arrays = 0
  for (const f of contentFiles(CONTENT)) {
    const n = applyToFile(f)
    if (n) { files++; arrays += n }
  }
  console.log(`[expand] wrote ${arrays} arrays across ${files} files`)
} else {
  if (process.env.DUMP) {
    writeFileSync(process.env.DUMP, JSON.stringify([...generated.entries()], null, 1))
    console.log(`[expand] dumped candidates to ${process.env.DUMP}`)
  }
  console.log('[expand] dry run, pass --apply to write')
}
