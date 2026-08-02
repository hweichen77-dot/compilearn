import React, { useState } from 'react'
import { Shield, ShieldAlert, CheckCircle2, Link2, Check } from 'lucide-react'
import { runPlayground, gradePlayground, COMPARE_MODELS, compareRuns } from '@/lib/llmPlayground'
import { markLabSolved, isLabSolved, getSolvedLabs } from '@/lib/playgroundProgress'
import { track, trackFunnel } from '@/lib/analytics'
import { buildReplayUrl } from '@/lib/replayLink'
import { diffPrompts } from '@/lib/promptDiff'
import ShareResult from './ShareResult'
import SaveProgressPrompt from './SaveProgressPrompt'
import LabLeaderboard from './LabLeaderboard'

const FIRST_WAVE = 3

export default function LlmPlayground({ lab, labIndex, labCount, initialPrompt = '' }) {
  const [systemPrompt, setSystemPrompt] = useState(initialPrompt)
  const [state, setState] = useState({ status: 'idle' })
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(() => isLabSolved(lab.id))
  const [hasRun, setHasRun] = useState(false)
  const [boardKey, setBoardKey] = useState(0)
  const [unlocked, setUnlocked] = useState(() => (isLabSolved(lab.id) ? lab.inputs.length : Math.min(FIRST_WAVE, lab.inputs.length)))
  const [lastAttempt, setLastAttempt] = useState(null)
  const [diff, setDiff] = useState(null)
  const [copied, setCopied] = useState(false)
  const [compare, setCompare] = useState(false)
  const [comparison, setComparison] = useState(null)
  const [solvedPrompt, setSolvedPrompt] = useState('')

  const activeInputs = lab.inputs.slice(0, unlocked)
  const locked = lab.inputs.length - unlocked

  const copyReplay = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.compilearn.com'
    try {
      await navigator.clipboard.writeText(buildReplayUrl({ origin, labId: lab.id, prompt: systemPrompt }))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track('playground_replay_copied', { lab: lab.id })
    } catch {  }
  }

  const run = async () => {
    if (!hasRun) {
      setHasRun(true)
      try { trackFunnel('playStart', { lab: lab.id }) } catch {  }
    }
    setState({ status: 'running' })
    setResult(null)

    if (lastAttempt && lastAttempt.prompt !== systemPrompt) {
      setDiff({ ...diffPrompts(lastAttempt.prompt, systemPrompt), previousPassed: lastAttempt.passed, previousTotal: lastAttempt.total })
    } else {
      setDiff(null)
    }

    setComparison(null)
    const texts = activeInputs.map((i) => i.text)
    const res = await runPlayground({ systemPrompt, inputs: texts, model: compare ? COMPARE_MODELS[0].id : undefined })
    if (!res.ok) {
      if (res.configured === false) { setState({ status: 'unconfigured', error: res.error }); return }
      setState({ status: 'error', error: res.error }); return
    }
    const graded = gradePlayground(res.results, activeInputs)

    if (compare) {
      const alt = await runPlayground({ systemPrompt, inputs: texts, model: COMPARE_MODELS[1].id })
      if (alt.ok) {
        const gradedAlt = gradePlayground(alt.results, activeInputs)
        setComparison(compareRuns(graded, gradedAlt))
        track('playground_compared', { lab: lab.id, disagreements: compareRuns(graded, gradedAlt).disagreements })
      }
    }
    setResult({ ...graded, model: res.model, wave: unlocked })
    setState({ status: 'done' })
    setLastAttempt({ prompt: systemPrompt, passed: graded.passed, total: graded.total })

    const clearedEverything = graded.allPass && unlocked === lab.inputs.length
    if (graded.allPass && locked > 0) setUnlocked(lab.inputs.length)

    if (clearedEverything) {
      markLabSolved(lab.id)
      setSolved(true)
      setSolvedPrompt(systemPrompt)
    }
    try {
      track('playground_run', { lab: lab.id, passed: graded.passed, total: graded.total })
      if (clearedEverything) {
        track('playground_solved', { lab: lab.id, prompt_chars: systemPrompt.trim().length })
        trackFunnel('challengeComplete', { lab: lab.id, prompt_chars: systemPrompt.trim().length })
        setBoardKey((k) => k + 1)
      }
    } catch {  }
  }

  const amber = '#5ED29C'
  const held = '#4CC98A'
  const broken = '#FF6B5C'

  return (
    <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#2a2519', background: '#0C1210' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-semibold" style={{ color: amber }}>
            {labIndex && labCount ? `Lab ${labIndex} of ${labCount}` : 'Red-team lab'}
          </div>
          <h3 className="text-xl font-bold mt-1 inline-flex items-center gap-2" style={{ color: '#ECF3EF' }}>
            {lab.title}
            {solved && <CheckCircle2 size={18} style={{ color: held }} aria-label="Solved" />}
          </h3>
          <p className="text-sm mt-1" style={{ color: '#FFFFFF' }}>{lab.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          {lab.difficulty && (
            <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide"
              style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>{lab.difficulty}</span>
          )}
          <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide inline-flex items-center gap-1"
            style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>
            <ShieldAlert size={11} style={{ color: amber }} /> {unlocked} of {lab.inputs.length} attacks
          </span>
        </div>
      </div>

      <p className="text-sm mt-4 leading-relaxed" style={{ color: '#FFFFFF' }}>{lab.brief}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="llm-system-prompt" className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
            Your defensive system prompt
          </label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={copyReplay} disabled={!systemPrompt.trim()}
              className="text-xs inline-flex items-center gap-1 disabled:opacity-40" style={{ color: amber }}>
              {copied ? <Check size={12} /> : <Link2 size={12} />}
              {copied ? 'Link copied' : 'Copy replay link'}
            </button>
            <button type="button" onClick={() => setShowHint((v) => !v)}
              className="text-xs underline" style={{ color: amber }}>
              {showHint ? 'Hide hint' : 'Need a hint?'}
            </button>
          </div>
        </div>
        {showHint && (
          <p className="text-xs mb-2 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>{lab.hint}</p>
        )}
        <textarea
          id="llm-system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder={lab.placeholder}
          rows={5}
          className="w-full rounded-lg p-3 text-sm font-mono resize-y focus:outline-none focus:border-[#5ED29C]"
          style={{ background: '#050807', color: '#ECF3EF', border: '1px solid #2a2519' }}
        />
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px]" style={{ color: '#FFFFFF' }}>{systemPrompt.trim().length} characters</span>
          {locked > 0 && (
            <span className="text-[11px]" style={{ color: '#FFFFFF' }}>
              Hold these {unlocked} to unlock {locked} harder {locked === 1 ? 'attack' : 'attacks'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={run}
          disabled={state.status === 'running' || !systemPrompt.trim()}
          className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          style={{ background: amber, color: '#1a1509' }}
        >
          {state.status === 'running' ? 'Running the attacks…' : `Run ${unlocked} attacks ▶`}
        </button>
        <label className="text-xs inline-flex items-center gap-2 cursor-pointer" style={{ color: '#FFFFFF' }}>
          <input type="checkbox" checked={compare} onChange={(e) => setCompare(e.target.checked)} />
          Compare two models
        </label>
      </div>

      {state.status === 'error' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#2a1512', color: '#F0A89C' }}>{state.error}</p>
      )}
      {state.status === 'unconfigured' && (
        <div className="text-sm mt-3 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>
          <strong>Live grading isn’t switched on yet.</strong> {state.error} Once the site owner sets the
          <code className="mx-1 px-1 rounded" style={{ background: '#050807' }}>GROQ_API_KEY</code>
          on the <code className="mx-1 px-1 rounded" style={{ background: '#050807' }}>llm-playground</code> function, this lab runs against a real model.
        </div>
      )}

      {result && (
        <div className="mt-5">
          <div className="rounded-xl p-4 mb-4" style={{ background: result.allPass ? '#12200f' : '#1B1913', border: `1px solid ${result.allPass ? '#2f5a25' : '#26302B'}` }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: result.allPass ? held : amber }}>
                  {result.allPass ? 'All attacks held' : 'Score'}
                </div>
                <div className="mt-1" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                  Held {result.passed}/{result.total} attacks
                </div>
              </div>
              <ShareResult lab={lab} passed={result.passed} total={result.total} allPass={result.allPass} />
            </div>

            {diff && diff.changed && (
              <div className="mt-3 rounded-lg p-3" style={{ background: '#050807', border: '1px solid #221d12' }}>
                <div className="text-[11px] font-semibold mb-1" style={{ color: '#FFFFFF' }}>
                  What changed since your last run, {diff.previousPassed}/{diff.previousTotal} then, {result.passed}/{result.total} now
                </div>
                <p className="text-xs font-mono leading-relaxed" style={{ color: '#FFFFFF' }}>
                  {diff.parts.map((p, i) => (
                    <span key={i} style={
                      p.type === 'added' ? { background: 'rgba(76,201,138,0.18)', color: held }
                        : p.type === 'removed' ? { background: 'rgba(255,107,92,0.14)', color: broken, textDecoration: 'line-through' }
                          : { color: 'rgba(255,255,255,0.75)' }
                    }>{p.value}</span>
                  ))}
                </p>
                <div className="text-[11px] mt-1" style={{ color: '#FFFFFF' }}>
                  {diff.added} words added, {diff.removed} removed
                </div>
              </div>
            )}

            {result.allPass && result.wave < lab.inputs.length && (
              <p className="text-sm mt-3 font-semibold" style={{ color: amber }}>
                That wave held. {lab.inputs.length - result.wave} harder {lab.inputs.length - result.wave === 1 ? 'attack is' : 'attacks are'} now unlocked, run again to finish the lab.
              </p>
            )}

            {result.allPass && result.wave === lab.inputs.length && (
              <SaveProgressPrompt labId={lab.id} solvedCount={getSolvedLabs().length} totalLabs={labCount || 0} />
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {result.graded.map((g, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
                  style={{ background: g.pass ? '#16301c' : '#301616', color: g.pass ? held : broken, border: `1px solid ${g.pass ? '#244a1c' : '#4a2020'}` }}>
                  {g.pass ? <Shield size={12} /> : <ShieldAlert size={12} />}
                  Attack {i + 1}
                </div>
              ))}
            </div>
            {result.allPass && result.wave === lab.inputs.length && (
              <p className="text-sm mt-3" style={{ color: '#9FE0A8' }}>{lab.successNote}</p>
            )}
          </div>

          {comparison && (
            <div className="rounded-xl p-4 mb-4" style={{ background: '#050807', border: '1px solid #26302B' }}>
              <div className="text-sm font-bold" style={{ color: '#ECF3EF' }}>
                {COMPARE_MODELS[0].label} held {comparison.passedA}/{comparison.total}, {COMPARE_MODELS[1].label} held {comparison.passedB}/{comparison.total}
              </div>
              <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>
                {comparison.disagreements === 0
                  ? 'Both models behaved the same on every attack, so this prompt is not model specific.'
                  : `They disagreed on ${comparison.disagreements} of ${comparison.total}. A prompt that only holds on one model is not a fix.`}
              </p>
              <div className="mt-3 space-y-2">
                {comparison.rows.filter((r) => !r.agree).map((r, i) => (
                  <div key={i} className="rounded-md p-2 text-xs" style={{ background: '#1B1913', border: '1px solid #3a331f' }}>
                    <div className="font-mono mb-1" style={{ color: '#FFFFFF' }}>{r.input}</div>
                    <div style={{ color: r.a.pass ? held : broken }}>{COMPARE_MODELS[0].label}: {r.a.pass ? 'HELD' : 'BROKEN'}</div>
                    <div style={{ color: r.b.pass ? held : broken }}>{COMPARE_MODELS[1].label}: {r.b.pass ? 'HELD' : 'BROKEN'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {result.graded.map((g, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: '#050807', border: '1px solid #221d12' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: g.pass ? '#16301c' : '#301616', color: g.pass ? held : broken }}>
                    {g.pass ? 'HELD' : 'BROKEN'}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#FFFFFF' }}>attack {i + 1}: {g.input}</span>
                </div>
                <pre className="text-sm mt-2 whitespace-pre-wrap font-mono" style={{ color: '#FFFFFF' }}>
                  {g.output || g.error || '(empty)'}
                </pre>
                {!g.pass && g.findings?.length > 0 && (
                  <div className="mt-2 rounded-md p-2" style={{ background: '#1a0f0f', border: '1px solid #4a2020' }}>
                    {g.findings.map((f, k) => (
                      <div key={k} className="text-xs" style={{ color: '#FFFFFF' }}>
                        <span style={{ color: broken, fontWeight: 700 }}>
                          {f.kind === 'leaked' ? 'Leaked' : f.kind === 'missing' ? 'Missing' : 'No refusal'}
                        </span>{' '}
                        {f.label}
                        {f.excerpt && (
                          <span className="block font-mono mt-1" style={{ color: '#FFC9C1' }}>“{f.excerpt}”</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <LabLeaderboard lab={lab} refreshKey={boardKey} solvedPrompt={solvedPrompt} />
    </div>
  )
}
