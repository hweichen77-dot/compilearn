import React, { useState } from 'react'
import { Swords, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { runPlayground, gradeOutput } from '@/lib/llmPlayground'
import { track } from '@/lib/analytics'

export default function AttackerLab({ lab, labIndex, labCount }) {
  const [attack, setAttack] = useState('')
  const [state, setState] = useState({ status: 'idle' })
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const run = async () => {
    setState({ status: 'running' })
    setResult(null)
    const res = await runPlayground({ systemPrompt: lab.defense, inputs: [attack], maxTokens: 220 })
    if (!res.ok) {
      if (res.configured === false) { setState({ status: 'unconfigured', error: res.error }); return }
      setState({ status: 'error', error: res.error }); return
    }
    const output = res.results?.[0]?.output || ''
    const { pass: leaked, findings } = gradeOutput(output, { mustInclude: [lab.target] })
    const broke = leaked
    setResult({ output, broke, findings })
    setState({ status: 'done' })
    setAttempts((n) => n + 1)
    try { track('attacker_run', { lab: lab.id, broke }) } catch {  }
  }

  const amber = '#5ED29C'
  const held = '#4CC98A'
  const broken = '#FF6B5C'

  return (
    <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#2a2519', background: '#0C1210' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold inline-flex items-center gap-1.5" style={{ color: amber }}>
            <Swords size={12} /> {labIndex && labCount ? `Target ${labIndex} of ${labCount}` : 'Attacker mode'}
          </div>
          <h3 className="text-xl font-bold mt-1" style={{ color: '#ECF3EF' }}>{lab.title}</h3>
          <p className="text-sm mt-1" style={{ color: '#FFFFFF' }}>{lab.tagline}</p>
        </div>
        <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide"
          style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>{lab.difficulty}</span>
      </div>

      <p className="text-sm mt-4 leading-relaxed" style={{ color: '#FFFFFF' }}>{lab.brief}</p>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#FFFFFF' }}>
          The defense you are attacking
        </div>
        <pre className="text-xs rounded-lg p-3 whitespace-pre-wrap font-mono" style={{ background: '#050807', color: '#9FE0A8', border: '1px solid #244a1c' }}>
          {lab.defense}
        </pre>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="attack-input" className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
            Your attack
          </label>
          <button type="button" onClick={() => setShowHint((v) => !v)} className="text-xs underline" style={{ color: amber }}>
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        </div>
        {showHint && (
          <p className="text-xs mb-2 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>{lab.hint}</p>
        )}
        <textarea
          id="attack-input"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          placeholder={lab.placeholder}
          rows={4}
          className="w-full rounded-lg p-3 text-sm font-mono resize-y focus:outline-none focus:border-[#5ED29C]"
          style={{ background: '#050807', color: '#ECF3EF', border: '1px solid #2a2519' }}
        />
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={run}
          disabled={state.status === 'running' || !attack.trim()}
          className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          style={{ background: amber, color: '#1a1509' }}
        >
          {state.status === 'running' ? 'Sending the attack…' : 'Send the attack ▶'}
        </button>
        {attempts > 0 && (
          <span className="text-xs" style={{ color: '#FFFFFF' }}>{attempts} {attempts === 1 ? 'attempt' : 'attempts'}</span>
        )}
      </div>

      {state.status === 'error' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#2a1512', color: '#F0A89C' }}>{state.error}</p>
      )}
      {state.status === 'unconfigured' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>{state.error}</p>
      )}

      {result && (
        <div className="mt-5 rounded-xl p-4" style={{ background: result.broke ? '#12200f' : '#1B1913', border: `1px solid ${result.broke ? '#2f5a25' : '#26302B'}` }}>
          <div className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: result.broke ? held : broken }}>
            {result.broke ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            {result.broke ? 'You broke it' : 'It held'}
          </div>
          <pre className="text-sm mt-3 whitespace-pre-wrap font-mono rounded-lg p-3" style={{ background: '#050807', color: '#FFFFFF', border: '1px solid #221d12' }}>
            {result.output || '(empty)'}
          </pre>
          {result.broke ? (
            <p className="text-sm mt-3" style={{ color: '#9FE0A8' }}>{lab.winNote}</p>
          ) : (
            <p className="text-sm mt-3" style={{ color: '#FFFFFF' }}>
              The reply never contained what you were after. Change the framing rather than the wording and send it again.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
