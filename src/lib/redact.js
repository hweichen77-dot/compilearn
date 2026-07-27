export const SENSITIVE_PARAMS = [
  'access_token',
  'refresh_token',
  'provider_token',
  'provider_refresh_token',
  'id_token',
  'token',
  'code',
]

const REDACTIONS = [
  [/\b(access_token|refresh_token|provider_token|provider_refresh_token|id_token|token|code|apikey|api_key)=[^&\s#"']+/gi, '$1=[REDACTED]'],
  [/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]'],
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]'],
]

export function scrubString(s) {
  let out = s
  for (const [re, rep] of REDACTIONS) out = out.replace(re, rep)
  return out
}

export function deepScrub(value, depth = 0, seen = new Set()) {
  if (depth > 6 || value == null) return value
  if (typeof value === 'string') return scrubString(value)
  if (typeof value !== 'object' || seen.has(value)) return value
  seen.add(value)
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = deepScrub(value[i], depth + 1, seen)
  } else {
    for (const k of Object.keys(value)) value[k] = deepScrub(value[k], depth + 1, seen)
  }
  return value
}

export function sanitizeUrl(value, origin) {
  if (typeof value !== 'string' || !value) return value
  try {
    const u = new URL(value, origin)
    u.hash = ''
    for (const p of SENSITIVE_PARAMS) u.searchParams.delete(p)
    return u.toString()
  } catch {
    return value.split('#')[0]
  }
}
