
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { LESSON_ROUTES } from '../src/content/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.resolve(ROOT, process.env.PRERENDER_DIST || 'dist')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://compilearn.vercel.app').replace(/\/+$/, '')
const BASE = (process.env.VITE_BASE || '/').replace(/\/+$/, '')
const ORIGIN = `${SITE_URL}${BASE}`

const NOINDEX = process.env.PRERENDER_NOINDEX === '1'

const TOP_PAGES = ['/', '/AITrack', '/Playground', '/Projects', '/Challenges', '/Competitive', '/APCS', '/Privacy', '/Terms']

const TOP_PAGE_META = {
  AITrack: {
    title: 'Learn to Build AI Apps',
    description: 'A hands-on track that teaches you to build real LLM applications — prompting, RAG, tool use, agents, and evaluation — by writing and running code in the browser.',
    blurb: 'Learn to build AI apps by actually building them: prompting, RAG, tool use, agents, and evaluation, hands-on in your browser.',
  },
  Playground: {
    title: 'Live LLM Playground',
    description: 'Write real prompts, run them against a live language model, and get graded on the model’s actual behavior. Practice prompt engineering, RAG grounding, injection defense, and structured output.',
    blurb: 'Write a system prompt, run it against a live model over adversarial inputs, and get graded on what the model actually does. No sign-in required.',
  },
  Projects: {
    title: 'AI Build Projects',
    description: 'Guided, hands-on projects that walk you through building real AI-powered applications step by step, with live code execution.',
    blurb: 'Guided, hands-on projects for building real AI-powered applications, with live code execution in the browser.',
  },
  Challenges: {
    title: 'Coding Challenges',
    description: 'Practice with graded coding challenges that run in the browser — build the skills behind real AI and software engineering.',
    blurb: 'Graded coding challenges that run in the browser.',
  },
  Competitive: {
    title: 'Competitive Programming',
    description: 'USACO/Codeforces-style competitive programming problems with a real judge, in the browser.',
    blurb: 'Competitive programming problems with a real in-browser judge.',
  },
  APCS: {
    title: 'AP Computer Science',
    description: 'AP Computer Science Principles and A curriculum with interactive lessons and runnable code.',
    blurb: 'AP CS Principles and A curriculum with interactive, runnable lessons.',
  },
  Privacy: { title: 'Privacy', description: 'Compilearn privacy policy.', blurb: 'Privacy policy.' },
  Terms: { title: 'Terms', description: 'Compilearn terms of service.', blurb: 'Terms of service.' },
}

const HOME_META = {
  title: 'Compilearn: learn how AI works by defending one',
  blurb:
    'Compilearn teaches you how language models actually behave by putting you on the defending side. Write the system prompt that guards an AI, watch real attacks try to break it, then build the projects and work through the AP Computer Science curriculum behind it. Free, in your browser, no signup to start.',
}

const esc = (s) =>
  String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const stripMd = (s) =>
  String(s || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const withNoindex = (html) =>
  NOINDEX ? html.replace('</head>', '<meta name="robots" content="noindex" />\n  </head>') : html

function replaceHead(html, { title, description, url }) {
  const t = esc(`${title} · Compilearn`)
  const d = esc(description)
  const u = esc(url)
  return withNoindex(html)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`)
    .replace(/<meta name="description" content="[\s\S]*?" \/>/, `<meta name="description" content="${d}" />`)
    .replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${u}" />`)
    .replace(/<meta property="og:title" content="[\s\S]*?" \/>/, `<meta property="og:title" content="${t}" />`)
    .replace(/<meta property="og:description" content="[\s\S]*?" \/>/, `<meta property="og:description" content="${d}" />`)
    .replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${u}" />`)
    .replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/, `<meta name="twitter:title" content="${t}" />`)
    .replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/, `<meta name="twitter:description" content="${d}" />`)
}

function seoBlock(r) {
  const intro = stripMd(r.explanation).slice(0, 1200)
  const parts = [
    `<h1>${esc(r.title)}</h1>`,
    r.concept ? `<p>${esc(stripMd(r.concept))}</p>` : '',
    r.projectTitle ? `<p><strong>Part of:</strong> ${esc(r.projectTitle)}</p>` : '',
    intro ? `<p>${esc(intro)}</p>` : '',
    r.challengeTitle ? `<p><strong>Challenge:</strong> ${esc(r.challengeTitle)}</p>` : '',
  ]

  return `<article style="max-width:720px;margin:64px auto;padding:0 24px;font-family:system-ui,sans-serif;color:#e8e2d5;line-height:1.6">${parts.join('')}</article>`
}

function run() {
  if (!fs.existsSync(DIST)) {
    console.error('[prerender] dist/ not found — run `vite build` first')
    process.exit(1)
  }
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  const routes = LESSON_ROUTES.filter((r) => r.path)
  let written = 0

  for (const r of routes) {
    const url = `${ORIGIN}${r.path}`
    const description = stripMd(r.concept || r.explanation).slice(0, 155)
    let html = replaceHead(template, { title: r.title, description, url })
    html = html.replace('<div id="root"></div>', `<div id="root">${seoBlock(r)}</div>`)
    const outDir = path.join(DIST, r.path.replace(/^\//, ''))
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
    written++
  }

  let topWritten = 0
  for (const [page, meta] of Object.entries(TOP_PAGE_META)) {
    const url = `${ORIGIN}/${page}`
    let html = replaceHead(template, { title: meta.title, description: meta.description, url })
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root"><article style="max-width:720px;margin:64px auto;padding:0 24px;font-family:system-ui,sans-serif;color:#e8e2d5;line-height:1.6"><h1>${esc(meta.title)}</h1><p>${esc(meta.blurb)}</p></article></div>`,
    )
    const outDir = path.join(DIST, page)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html)
    topWritten++
  }

  const homeHtml = withNoindex(template)
    .replace(/<link rel="canonical" href="[\s\S]*?" \/>/, `<link rel="canonical" href="${ORIGIN}/" />`)
    .replace(/<meta property="og:url" content="[\s\S]*?" \/>/, `<meta property="og:url" content="${ORIGIN}/" />`)
    .replace(
      '<div id="root"></div>',
      `<div id="root"><article style="max-width:720px;margin:64px auto;padding:0 24px;font-family:system-ui,sans-serif;color:#e8e2d5;line-height:1.6"><h1>${esc(HOME_META.title)}</h1><p>${esc(HOME_META.blurb)}</p>${Object.entries(TOP_PAGE_META)
        .map(
          ([page, meta]) =>
            `<h2><a href="${BASE}/${page}">${esc(meta.title)}</a></h2><p>${esc(meta.blurb)}</p>`,
        )
        .join('')}</article></div>`,
    )
  fs.writeFileSync(path.join(DIST, 'index.html'), homeHtml)

  const notFound = replaceHead(template, {
    title: 'Page not found',
    description: 'That page could not be found.',
    url: ORIGIN,
  }).replace('</head>', '<meta name="robots" content="noindex" />\n  </head>')
  fs.writeFileSync(path.join(DIST, '404.html'), notFound)

  const urls = [
    ...TOP_PAGES.map((p) => `${BASE}${p === '/' ? '/' : p}`),
    ...routes.map((r) => `${BASE}${r.path}`),
  ]
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`)
      .join('\n') +
    `\n</urlset>\n`
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap)

  fs.writeFileSync(
    path.join(DIST, 'robots.txt'),
    NOINDEX
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  )

  console.log(`[prerender] wrote ${written} lesson pages + ${topWritten} top pages + sitemap (${urls.length} urls)`)
}

run()
