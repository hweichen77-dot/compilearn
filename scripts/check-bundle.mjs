import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', process.env.PRERENDER_DIST || 'dist')

const EAGER_GZIP_BUDGET_KB = Number(process.env.BUNDLE_BUDGET_KB || 260)
const FORBIDDEN_EAGER = /curriculum/

const indexHtml = path.join(DIST, 'index.html')
if (!fs.existsSync(indexHtml)) {
  console.error('[check-bundle] dist/index.html not found, run the build first')
  process.exit(1)
}

const html = fs.readFileSync(indexHtml, 'utf8')
const refs = [...new Set([...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]))]

if (refs.length === 0) {
  console.error('[check-bundle] no eager scripts found in index.html, the parser is probably stale')
  process.exit(1)
}

const failures = []
let totalGzip = 0

for (const ref of refs.sort()) {
  const file = path.join(DIST, ref.replace(/^\//, ''))
  if (!fs.existsSync(file)) {
    failures.push(`index.html references ${ref}, which is missing from the build`)
    continue
  }
  const gzip = zlib.gzipSync(fs.readFileSync(file)).length
  totalGzip += gzip
  console.log(`[check-bundle] ${path.basename(ref).padEnd(34)} ${(gzip / 1024).toFixed(0)}K gzip`)
  if (FORBIDDEN_EAGER.test(ref)) {
    failures.push(`${ref} loads before first paint. Lesson content must stay behind a dynamic import.`)
  }
}

const totalKb = totalGzip / 1024
console.log(`[check-bundle] eager total ${totalKb.toFixed(0)}K gzip against a ${EAGER_GZIP_BUDGET_KB}K budget`)

if (totalKb > EAGER_GZIP_BUDGET_KB) {
  failures.push(
    `eager JavaScript is ${totalKb.toFixed(0)}K gzip, over the ${EAGER_GZIP_BUDGET_KB}K budget. ` +
    'Either move something behind a dynamic import or raise BUNDLE_BUDGET_KB deliberately.',
  )
}

if (failures.length > 0) {
  console.error('\n[check-bundle] failed:')
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}

console.log('[check-bundle] ok')
