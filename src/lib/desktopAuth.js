
import { supabase, auth } from '@/api/supabaseClient'

export const isDesktop =
  typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__)

let listenerReady = false

const PENDING_STATE_KEY = 'codeflow.desktopAuthState'

function issuePendingState() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  const value = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
  try { window.sessionStorage.setItem(PENDING_STATE_KEY, value) } catch {  }
  return value
}

function consumePendingState() {
  try {
    const value = window.sessionStorage.getItem(PENDING_STATE_KEY)
    window.sessionStorage.removeItem(PENDING_STATE_KEY)
    return value
  } catch {
    return null
  }
}

export async function startGoogleDesktop() {
  const { data, error } = await auth.signInWithGoogle()
  if (error) return { error }
  const url = data?.url
  if (!url) return { error: new Error('No sign-in URL was returned.') }
  let target
  try {
    target = new URL(url)
  } catch {
    return { error: new Error('The sign-in URL was not valid.') }
  }
  target.searchParams.set('state', issuePendingState())
  try {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(target.toString())
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e : new Error('Could not open the browser for sign-in.') }
  }
}

async function handleCallback(url) {
  if (typeof url !== 'string' || !url.startsWith('codeflow://')) return
  const hashIdx = url.indexOf('#')
  const queryIdx = url.indexOf('?')
  const query = queryIdx >= 0 ? url.slice(queryIdx + 1, hashIdx >= 0 ? hashIdx : undefined) : ''
  const qp = new URLSearchParams(query)
  const code = qp.get('code')
  const expected = consumePendingState()
  if (!code || !expected || qp.get('state') !== expected) return
  try {
    await supabase.auth.exchangeCodeForSession(code)
  } catch {

  }
}

export async function initDeepLinkAuth() {
  if (!isDesktop || listenerReady) return
  listenerReady = true
  try {
    const dl = await import('@tauri-apps/plugin-deep-link')
    try {
      const initial = await dl.getCurrent()
      if (Array.isArray(initial)) for (const u of initial) await handleCallback(u)
    } catch {  }
    await dl.onOpenUrl((urls) => { for (const u of urls) handleCallback(u) })
  } catch {

  }
}
