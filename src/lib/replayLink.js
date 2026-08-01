const MAX_PROMPT_CHARS = 4000

export function encodePrompt(prompt) {
  const text = String(prompt || '').slice(0, MAX_PROMPT_CHARS)
  if (!text.trim()) return ''
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodePrompt(encoded) {
  if (!encoded) return ''
  try {
    const padded = String(encoded).replace(/-/g, '+').replace(/_/g, '/')
    const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes).slice(0, MAX_PROMPT_CHARS)
  } catch {
    return ''
  }
}

export function buildReplayUrl({ origin, labId, prompt }) {
  const encoded = encodePrompt(prompt)
  const base = `${origin}/Playground?lab=${encodeURIComponent(labId)}`
  return encoded ? `${base}&p=${encoded}` : base
}

export function readReplayPrompt(search) {
  try {
    return decodePrompt(new URLSearchParams(search).get('p'))
  } catch {
    return ''
  }
}
