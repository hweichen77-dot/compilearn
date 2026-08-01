import React, { useState } from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'
import { runPlayground } from '@/lib/llmPlayground'
import { AUDIT_ATTACKS, staticReview, scoreAudit } from '@/lib/promptAudit'
import { track } from '@/lib/analytics'

export default function PromptAudit() {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [state, setState] = useState({ status: 'idle' })
  const [report, setReport] = useState(null)

  const notes = systemPrompt.trim() ? staticReview(systemPrompt) : []

  const run = async () => {
    setState({ status: 'running' })
    setReport(null)
    const res = await runPlayground({
      systemPrompt,
      inputs: AUDIT_ATTACKS.slice(0, 5).map((a) => a.text),
      maxTokens: 220,
    })
    if (!res.ok) {
      if (res.configured === false) { setState({ status: 'unconfigured', error: res.error }); return }
      setState({ status: 'error', error: res.error }); return
    }
    const results = AUDIT_ATTACKS.slice(0, 5).map((attack, i) => {
      const output = res.results?.[i]?.output || ''
      return { attack, output, broke: Boolean(attack.detect(output, systemPrompt)) }
    })
    setReport({ results, ...scoreAudit(results) })
    setState({ status: 'done' })
    try { track('prompt_audit_run', { held: scoreAudit(results).held, total: results.length }) } catch {  }
  }

  const amber = '#5ED29C'
  const held = '#4CC98A'
  const broken = '#FF6B5C'

  return (
    <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#2a2519', background: '#0C1210' }}>
      <h3 className="text-xl font-bold" style={{ color: '#ECF3EF' }}>Audit your own system prompt</h3>
      <p className="text-sm mt-2 leading-relaxed" style={{ color: '#FFFFFF' }}>
        Paste the system prompt from something you are actually building. It runs against the same attack battery
        the labs use, and the report tells you which ones got through. Nothing is stored, and the prompt only
        leaves your browser to reach the model.
      </p>

      <div className="mt-4">
        <label htmlFor="audit-prompt" className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
          Your system prompt
        </label>
        <textarea
          id="audit-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="You are a support assistant for..."
          rows={7}
          className="w-full mt-2 rounded-lg p-3 text-sm font-mono resize-y focus:outline-none focus:border-[#5ED29C]"
          style={{ background: '#050807', color: '#ECF3EF', border: '1px solid #2a2519' }}
        />
        <span className="text-[11px]" style={{ color: '#FFFFFF' }}>{systemPrompt.trim().length} characters</span>
      </div>

      {notes.length > 0 && (
        <div className="mt-3 rounded-lg p-3" style={{ background: '#1B1913', border: '1px solid #3a331f' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: '#ECF3EF' }}>Read before you run</div>
          {notes.map((n, i) => (
            <div key={i} className="text-xs flex items-start gap-2 mt-1" style={{ color: '#FFFFFF' }}>
              <AlertTriangle size={12} className="mt-0.5 shrink-0" style={{ color: n.level === 'danger' ? broken : amber }} />
              <span>{n.text}</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={run}
        disabled={state.status === 'running' || systemPrompt.trim().length < 10}
        className="mt-4 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
        style={{ background: amber, color: '#1a1509' }}
      >
        {state.status === 'running' ? 'Running 5 attacks…' : 'Audit this prompt ▶'}
      </button>

      {state.status === 'error' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#2a1512', color: '#F0A89C' }}>{state.error}</p>
      )}
      {state.status === 'unconfigured' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>{state.error}</p>
      )}

      {report && (
        <div className="mt-5">
          <div className="rounded-xl p-4" style={{ background: report.allHeld ? '#12200f' : '#1B1913', border: `1px solid ${report.allHeld ? '#2f5a25' : '#26302B'}` }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
              Held {report.held}/{report.total} attacks
            </div>
            <p className="text-sm mt-2" style={{ color: '#FFFFFF' }}>
              {report.allHeld
                ? 'Nothing got through this battery. That is a good sign rather than a guarantee, since these are five known shapes and an attacker is not limited to five.'
                : 'Each failure below is a change you can make to the prompt today.'}
            </p>
          </div>

          <div className="space-y-3 mt-3">
            {report.results.map((r, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: '#050807', border: '1px solid #221d12' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded inline-flex items-center gap-1"
                    style={{ background: r.broke ? '#301616' : '#16301c', color: r.broke ? broken : held }}>
                    {r.broke ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                    {r.broke ? 'GOT THROUGH' : 'HELD'}
                  </span>
                  <span className="text-xs font-semibold" style={{ color: '#ECF3EF' }}>{r.attack.label}</span>
                </div>
                <div className="text-xs font-mono mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.attack.text}</div>
                <pre className="text-sm mt-2 whitespace-pre-wrap font-mono" style={{ color: '#FFFFFF' }}>{r.output || '(empty)'}</pre>
                {r.broke && (
                  <p className="text-xs mt-2" style={{ color: '#FFC9C1' }}>{r.attack.failNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
