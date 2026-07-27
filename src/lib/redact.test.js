import { test } from 'node:test'
import assert from 'node:assert/strict'
import { scrubString, deepScrub, sanitizeUrl } from './redact.js'

const ORIGIN = 'https://www.compilearn.com'
const JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSJ9.abcDEF-123_xyz'

test('scrubString removes oauth tokens from a callback fragment', () => {
  const out = scrubString(`${ORIGIN}/#access_token=${JWT}&refresh_token=r1-secret&expires_in=3600`)
  assert.ok(!out.includes('r1-secret'))
  assert.ok(!out.includes(JWT))
  assert.match(out, /access_token=\[REDACTED\]/)
  assert.match(out, /refresh_token=\[REDACTED\]/)
  assert.ok(out.includes('expires_in=3600'))
})

test('scrubString redacts a bare JWT with no surrounding parameter', () => {
  assert.equal(scrubString(`Bearer ${JWT}`), 'Bearer [REDACTED_JWT]')
})

test('scrubString redacts the pkce code parameter', () => {
  assert.match(scrubString('?code=abc123def&state=xyz'), /code=\[REDACTED\]/)
})

test('scrubString redacts email addresses', () => {
  assert.equal(scrubString('failed for learner@example.com'), 'failed for [REDACTED_EMAIL]')
})

test('scrubString leaves ordinary text alone', () => {
  const msg = 'TypeError: cannot read property length of undefined'
  assert.equal(scrubString(msg), msg)
})

test('deepScrub reaches tokens nested inside a Sentry-shaped event', () => {
  const event = {
    message: 'auth failed',
    request: { url: `${ORIGIN}/?code=secret-code-value` },
    breadcrumbs: [{ data: { href: `${ORIGIN}/#access_token=${JWT}` } }],
  }
  const out = deepScrub(event)
  assert.ok(!JSON.stringify(out).includes('secret-code-value'))
  assert.ok(!JSON.stringify(out).includes(JWT))
})

test('deepScrub survives a circular reference', () => {
  const a = { token: `access_token=${JWT}` }
  a.self = a
  assert.doesNotThrow(() => deepScrub(a))
})

test('deepScrub stops descending past the depth cap', () => {
  let leaf = { v: `access_token=${JWT}` }
  for (let i = 0; i < 9; i++) leaf = { nested: leaf }
  const out = JSON.stringify(deepScrub(leaf))
  assert.ok(out.includes(JWT), 'depth cap is what leaves this un-redacted')
})

test('sanitizeUrl strips the fragment and every sensitive query param', () => {
  const out = sanitizeUrl(`${ORIGIN}/Playground?code=abc&token=def&lesson=7#access_token=${JWT}`, ORIGIN)
  assert.equal(out, `${ORIGIN}/Playground?lesson=7`)
})

test('sanitizeUrl resolves a relative path against the origin', () => {
  assert.equal(sanitizeUrl('/Dashboard?token=abc', ORIGIN), `${ORIGIN}/Dashboard`)
})

test('sanitizeUrl still drops the fragment when the url will not parse', () => {
  assert.equal(sanitizeUrl('not a url#access_token=zzz', undefined), 'not a url')
})

test('sanitizeUrl passes through empty and non-string input', () => {
  assert.equal(sanitizeUrl('', ORIGIN), '')
  assert.equal(sanitizeUrl(null, ORIGIN), null)
})
