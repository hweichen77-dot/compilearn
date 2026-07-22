const FALLBACK_ORIGIN = 'https://www.compilearn.com'

function trimEnd(value) {
  return value.replace(/\/+$/, '')
}

export function siteOrigin() {
  const configured = import.meta.env.VITE_SITE_URL
  if (configured) return trimEnd(configured)
  if (typeof window !== 'undefined' && window.location?.origin?.startsWith('http')) {
    return trimEnd(window.location.origin)
  }
  return FALLBACK_ORIGIN
}

export function appOrigin() {
  const base = import.meta.env.BASE_URL || '/'
  return trimEnd(siteOrigin() + (base === '/' ? '' : base))
}

export function appUrl(path = '') {
  if (!path) return `${appOrigin()}/`
  return `${appOrigin()}${path.startsWith('/') ? path : `/${path}`}`
}
