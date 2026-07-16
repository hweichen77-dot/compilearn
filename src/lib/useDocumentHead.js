import { useEffect } from 'react'

const SITE = 'Compilearn'
const ORIGIN = 'https://hweichen77-dot.github.io/codeflow'

function setMeta(selector, attr, value) {
  if (typeof document === 'undefined' || value == null) return null
  let el = document.head.querySelector(selector)
  let created = false
  if (!el) {
    el = document.createElement('meta')
    const [, name] = selector.match(/\[(?:name|property)="([^"]+)"\]/) || []
    if (selector.includes('property=')) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
    created = true
  }
  const prev = el.getAttribute(attr)
  el.setAttribute(attr, value)
  return { el, prev, created }
}

const LD_ID = 'compilearn-jsonld'

function setJsonLd(data) {
  if (typeof document === 'undefined') return null
  const existed = document.getElementById(LD_ID)
  const prev = existed?.textContent ?? null
  const el = existed || document.createElement('script')
  el.type = 'application/ld+json'
  el.id = LD_ID
  el.textContent = JSON.stringify(data)
  if (!existed) document.head.appendChild(el)
  return { el, prev, created: !existed }
}

export function useDocumentHead({ title, description, path, schemaType = 'LearningResource' } = {}) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const fullTitle = title ? `${title} · ${SITE}` : SITE
    const prevTitle = document.title
    document.title = fullTitle

    const canonical = path ? `${ORIGIN}${path}` : `${ORIGIN}/`
    let linkEl = document.head.querySelector('link[rel="canonical"]')
    let linkCreated = false
    const prevHref = linkEl?.getAttribute('href')
    if (!linkEl) {
      linkEl = document.createElement('link')
      linkEl.setAttribute('rel', 'canonical')
      document.head.appendChild(linkEl)
      linkCreated = true
    }
    linkEl.setAttribute('href', canonical)

    const changes = [
      setMeta('meta[name="description"]', 'content', description),
      setMeta('meta[property="og:title"]', 'content', fullTitle),
      setMeta('meta[property="og:description"]', 'content', description),
      setMeta('meta[property="og:url"]', 'content', canonical),
      setMeta('meta[name="twitter:title"]', 'content', fullTitle),
      setMeta('meta[name="twitter:description"]', 'content', description),
    ].filter(Boolean)

    const ld = setJsonLd({
      '@context': 'https://schema.org',
      '@type': schemaType,
      name: fullTitle,
      description: description || 'Learn to code in your browser with a live AI tutor.',
      url: canonical,
      provider: { '@type': 'Organization', name: SITE, url: `${ORIGIN}/` },
      isAccessibleForFree: true,
      inLanguage: 'en',
      learningResourceType: 'Interactive lesson',
    })

    return () => {
      document.title = prevTitle
      changes.forEach(({ el, prev, created }) => {
        if (created) el.remove()
        else if (prev != null) el.setAttribute('content', prev)
      })
      if (linkCreated) linkEl.remove()
      else if (prevHref != null) linkEl.setAttribute('href', prevHref)
      if (ld) {
        if (ld.created) ld.el.remove()
        else if (ld.prev != null) ld.el.textContent = ld.prev
      }
    }
  }, [title, description, path, schemaType])
}

export default useDocumentHead
