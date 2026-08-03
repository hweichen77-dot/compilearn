import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const HOST = process.env.INDEXNOW_HOST || 'www.compilearn.com'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const keyFile = readdirSync(path.join(ROOT, 'public')).find((f) => /^[0-9a-f]{16,128}\.txt$/.test(f))
if (!keyFile) {
  console.error('[indexnow] no key file in public/')
  process.exit(1)
}
const key = keyFile.replace(/\.txt$/, '')

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => (r.ok ? r.text() : ''))
const prefix = `https://${HOST}/`
const urlList = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]))]
  .filter((u) => u.startsWith(prefix))

if (!urlList.length) {
  console.error(`[indexnow] no urls on ${HOST} in the live sitemap`)
  process.exit(1)
}

const keyLocation = `https://${HOST}/${keyFile}`
const live = await fetch(keyLocation).then((r) => (r.ok ? r.text() : null)).catch(() => null)
if (live?.trim() !== key) {
  console.error(`[indexnow] key file not readable at ${keyLocation}; deploy before submitting`)
  process.exit(1)
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
})

console.log(`[indexnow] submitted ${urlList.length} urls -> ${res.status} ${res.statusText}`)
process.exit(res.ok || res.status === 202 ? 0 : 1)
