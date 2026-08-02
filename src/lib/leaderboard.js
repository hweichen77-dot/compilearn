import { supabase, auth } from '@/api/supabaseClient'

export const HANDLE_PATTERN = /^[A-Za-z0-9_-]{2,20}$/

async function currentUserId() {
  if (!auth.isConfigured) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export async function submitLabScore({ labId, systemPrompt, handle }) {
  const userId = await currentUserId()
  if (!userId || !labId || !systemPrompt?.trim()) return { stored: false }
  return submitVerifiedScore({ labId, systemPrompt, handle })
}

async function submitVerifiedScore({ labId, systemPrompt, handle }) {
  if (!supabase) return { ok: false, error: 'The board is not reachable in this build.' }
  try {
    const { data, error } = await supabase.functions.invoke('lab-score', {
      body: { labId, systemPrompt, handle, claimToken: claimToken() },
    })
    if (error) return { ok: false, error: 'Could not reach the board right now.' }
    if (data?.error) return { ok: false, error: data.error, held: data.held, total: data.total }
    return { ok: true, stored: Boolean(data?.stored), kept: data?.kept, held: data?.held, total: data?.total }
  } catch {
    return { ok: false, error: 'Could not reach the board right now.' }
  }
}

export async function fetchLeaderboard(labId, limit = 10) {
  if (!auth.isConfigured || !labId) return []
  try {
    const { data, error } = await supabase.rpc('lab_leaderboard', { p_lab_id: labId, p_limit: limit })
    if (error || !Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export async function getMyEntry(labId) {
  const userId = await currentUserId()
  if (!userId || !labId) return null
  try {
    const { data } = await supabase
      .from('lab_scores')
      .select('prompt_chars, attacks_held, handle, published')
      .eq('user_id', userId)
      .eq('lab_id', labId)
      .maybeSingle()
    return data ?? null
  } catch {
    return null
  }
}

export async function publishEntry(labId, handle, systemPrompt) {
  if (!HANDLE_PATTERN.test(handle || '')) {
    return { ok: false, error: 'Pick 2 to 20 letters, numbers, dashes or underscores. Please do not use your real name.' }
  }
  if (!systemPrompt?.trim()) {
    return { ok: false, error: 'Solve the lab again so your prompt can be checked before it goes on the board.' }
  }
  return submitVerifiedScore({ labId, systemPrompt, handle })
}

export async function unpublishEntry(labId) {
  const userId = await currentUserId()
  if (!userId || !labId) return { ok: false }
  try {
    await supabase.from('lab_scores').delete().eq('user_id', userId).eq('lab_id', labId)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

const CLAIM_KEY = 'compilearn_board_claim'

export function claimToken() {
  if (typeof window === 'undefined') return ''
  let token = window.localStorage.getItem(CLAIM_KEY)
  if (!token) {
    const bytes = new Uint8Array(24)
    crypto.getRandomValues(bytes)
    token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
    window.localStorage.setItem(CLAIM_KEY, token)
  }
  return token
}

export async function submitAnonScore({ labId, handle, systemPrompt }) {
  if (!HANDLE_PATTERN.test(handle || '')) {
    return { ok: false, error: 'Pick 2 to 20 letters, numbers, dashes or underscores. Please do not use your real name.' }
  }
  return submitVerifiedScore({ labId, systemPrompt, handle })
}
