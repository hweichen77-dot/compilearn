import { writeFileSync, readFileSync } from 'node:fs'
import LABS from '../src/content/playgroundLabs.js'

const OUT = 'supabase/functions/_shared/labRules.json'

const payload = Object.fromEntries(
  LABS.map((lab) => [lab.id, lab.inputs.map((i) => ({ text: i.text, rules: i.rules || {} }))])
)

const next = JSON.stringify(payload, null, 2) + '\n'

if (process.argv.includes('--check')) {
  let current = ''
  try { current = readFileSync(OUT, 'utf8') } catch { }
  if (current !== next) {
    console.error('[lab-rules] supabase/functions/_shared/labRules.json is out of date')
    console.error('[lab-rules] the leaderboard verifies scores against this file, so it must match the labs')
    console.error('[lab-rules] run: node scripts/gen-lab-rules.mjs')
    process.exit(1)
  }
  console.log(`[lab-rules] ok, ${Object.keys(payload).length} labs in sync`)
} else {
  writeFileSync(OUT, next)
  console.log(`[lab-rules] wrote ${Object.keys(payload).length} labs to ${OUT}`)
}
