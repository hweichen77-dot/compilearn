export async function runPlayground({ systemPrompt, inputs, maxTokens = 200, model }) {
  const { supabase } = await import('@/api/supabaseClient')
  if (!supabase) {
    return { ok: false, configured: false, error: 'Live grading needs a Supabase connection (not configured in this build).' }
  }
  if (!systemPrompt?.trim()) return { ok: false, error: 'Write a system prompt first.' }
  if (!Array.isArray(inputs) || inputs.length === 0) return { ok: false, error: 'No test inputs.' }

  try {
    const { data, error } = await supabase.functions.invoke('llm-playground', {
      body: { systemPrompt, inputs, maxTokens, ...(model ? { model } : {}) },
    })
    if (error) {

      const msg = error.message || 'Request failed.'
      if (/failed to send|edge function|not found|404/i.test(msg)) {
        return { ok: false, configured: false, error: 'Live grading is being switched on, check back soon.' }
      }
      return { ok: false, error: msg }
    }
    if (data?.configured === false) return { ok: false, configured: false, error: data.error }
    if (data?.error) return { ok: false, error: data.error }
    return { ok: true, results: data.results || [], model: data.model, models: data.models || [] }
  } catch (e) {
    return { ok: false, error: String(e?.message || e) }
  }
}

export const COMPARE_MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'gpt-oss-120b' },
  { id: 'llama-3.3-70b-versatile', label: 'llama-3.3-70b' },
]

export function compareRuns(runA, runB) {
  const rows = runA.graded.map((a, i) => {
    const b = runB.graded[i] || {}
    return { input: a.input, a, b, agree: a.pass === b.pass }
  })
  return {
    rows,
    disagreements: rows.filter((r) => !r.agree).length,
    passedA: runA.passed,
    passedB: runB.passed,
    total: runA.graded.length,
  }
}

const normalize = (s) =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[‘’ʼ′]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―]/g, '-')

function excerptAround(raw, term) {
  const text = normalize(raw)
  const at = text.indexOf(normalize(term))
  if (at === -1) return ''
  const start = Math.max(0, at - 30)
  const end = Math.min(text.length, at + normalize(term).length + 30)
  return `${start > 0 ? '…' : ''}${String(raw).slice(start, end).trim()}${end < text.length ? '…' : ''}`
}

export function gradeOutput(output, rules = {}) {
  const text = normalize(output)
  const reasons = []
  const findings = []
  let pass = true

  for (const term of rules.mustInclude || []) {
    if (!text.includes(normalize(term))) {
      pass = false
      reasons.push(`missing “${term}”`)
      findings.push({ kind: 'missing', term, label: `the reply never says “${term}”` })
    }
  }
  for (const term of rules.mustExclude || []) {
    if (text.includes(normalize(term))) {
      pass = false
      reasons.push(`should not contain “${term}”`)
      findings.push({ kind: 'leaked', term, excerpt: excerptAround(output, term), label: `it gave up “${term}”` })
    }
  }
  if (rules.includeAny && rules.includeAny.length) {
    const hit = rules.includeAny.some((t) => text.includes(normalize(t)))
    if (!hit) {
      pass = false
      reasons.push(`expected one of: ${rules.includeAny.join(', ')}`)
      findings.push({ kind: 'noRefusal', term: rules.includeAny.join(', '), label: `no wording from: ${rules.includeAny.join(', ')}` })
    }
  }
  return { pass, reasons, findings }
}

export function gradePlayground(results, cases) {
  const graded = results.map((r, i) => {
    const rules = cases[i]?.rules || cases[i] || {}
    return { ...r, ...gradeOutput(r.output, rules) }
  })
  const passed = graded.filter((g) => g.pass).length
  return { graded, passed, total: graded.length, allPass: passed === graded.length && graded.length > 0 }
}
