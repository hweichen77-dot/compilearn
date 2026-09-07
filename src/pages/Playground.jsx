import React, { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import LABS from '@/content/playgroundLabs'
import ATTACKER_LABS from '@/content/attackerLabs'
import LlmPlayground from '@/components/lesson/LlmPlayground'
import AttackerLab from '@/components/lesson/AttackerLab'
import PromptAudit from '@/components/lesson/PromptAudit'
import useDocumentHead from '@/lib/useDocumentHead'
import { Stagger, StaggerItem, HoverCard } from '@/lib/motion'
import { ProgressBar, KIT } from '@/components/ui/kit'
import { getSolvedLabs, PLAYGROUND_CHANGED_EVENT } from '@/lib/playgroundProgress'
import { readReplayPrompt } from '@/lib/replayLink'
import { pickDailyLab, msUntilNextDay } from '@/lib/dailyLab'

export default function Playground() {

  const initialId = (() => {
    try {
      const q = new URLSearchParams(window.location.search).get('lab')
      if (q && LABS.some((l) => l.id === q)) return q
    } catch {  }
    return LABS[0]?.id
  })()
  const replayPrompt = (() => {
    try {
      return readReplayPrompt(window.location.search)
    } catch {
      return ''
    }
  })()
  const [mode, setMode] = useState('defend')
  const [attackerId, setAttackerId] = useState(ATTACKER_LABS[0].id)
  const activeAttacker = ATTACKER_LABS.find((l) => l.id === attackerId) || ATTACKER_LABS[0]
  const daily = pickDailyLab(LABS)
  const hoursLeft = Math.max(1, Math.round(msUntilNextDay() / 3600000))
  const [activeId, setActiveId] = useState(initialId)
  const active = LABS.find((l) => l.id === activeId) || LABS[0]

  const [solvedIds, setSolvedIds] = useState(() => getSolvedLabs())
  useEffect(() => {
    const refresh = () => setSolvedIds(getSolvedLabs())
    window.addEventListener(PLAYGROUND_CHANGED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener(PLAYGROUND_CHANGED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])
  const solvedCount = LABS.filter((l) => solvedIds.includes(l.id)).length
  const solvedPct = LABS.length ? Math.round((solvedCount / LABS.length) * 100) : 0

  useDocumentHead({
    title: 'Prompt Injection & LLM Security Practice',
    description:
      'Free, no-signup exercises to practice defending LLMs against real attacks. Write a system prompt, run it against a live model over adversarial inputs (prompt injection, jailbreaks, hallucination, RAG grounding), and get a shareable held/broken score.',
    path: '/Playground',
  })

  return (
    <Stagger className="max-w-6xl mx-auto px-5 pt-24 pb-16" as="div">
      <StaggerItem className="mb-8" as="header">
        <h1 className="text-3xl md:text-4xl font-bold" style={{ color: '#ECF3EF' }}>
          Can your prompt survive the attacks?
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
          Write a <strong>defensive system prompt</strong>, run it against a live model over a battery of real
          attacks, prompt injection, jailbreaks, hallucination, and get a <strong>held/broken score</strong> you
          can share. Free, no sign-in. This is prompt engineering the way it actually gets tested in production.
        </p>

        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px]" style={{ color: '#ECF3EF' }}>
              Labs solved
            </span>
            <span className="font-sans text-xs" style={{ color: '#5ED29C' }}>
              {solvedCount}/{LABS.length}
            </span>
          </div>
          <ProgressBar pct={solvedPct} color={KIT.emerald} height={8} glow={false} />
        </div>

        {daily && (
          <div className="mt-6 rounded-xl border p-4 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderColor: '#2f5a25', background: '#12200f' }}>
            <div>
              <div className="text-sm font-bold" style={{ color: '#ECF3EF' }}>
                Today’s lab: {daily.title}
              </div>
              <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>
                Everyone gets the same lab today. It changes at midnight UTC, in about {hoursLeft} {hoursLeft === 1 ? 'hour' : 'hours'}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveId(daily.id)}
              className="px-4 py-2 rounded-lg text-sm font-bold shrink-0"
              style={{ background: KIT.emerald, color: '#07130C' }}
            >
              {activeId === daily.id ? 'You are on it' : 'Play today’s lab'}
            </button>
          </div>
        )}
      </StaggerItem>

      <StaggerItem as="div">
        <p className="mb-6 text-xs" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: '62ch' }}>
          Every run here goes to a real AI language model. Responses are AI-generated and can be
          inaccurate. Your prompt and test inputs are sent to Groq to produce them.
        </p>
      </StaggerItem>

      <StaggerItem className="mb-6 flex gap-2" as="div">
        {[['defend', 'Defend a prompt'], ['attack', 'Break one instead'], ['audit', 'Audit your own']].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold border"
            style={{
              borderColor: mode === key ? '#5a4a20' : '#241f14',
              background: mode === key ? '#211c12' : 'transparent',
              color: mode === key ? '#ECF3EF' : '#D6CDB8',
            }}
          >
            {label}
          </button>
        ))}
      </StaggerItem>

      {mode === 'audit' && (
        <StaggerItem as="div"><PromptAudit /></StaggerItem>
      )}

      {mode !== 'audit' && (
      <StaggerItem className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6" as="div">
        <nav className="flex md:flex-col gap-2 overflow-x-auto">
          {mode === 'attack' && ATTACKER_LABS.map((lab) => (
            <HoverCard
              key={lab.id}
              as="button"
              type="button"
              onClick={() => setAttackerId(lab.id)}
              className="text-left px-3 py-3 rounded-lg border shrink-0 transition-colors"
              style={{
                borderColor: lab.id === attackerId ? '#5a4a20' : '#241f14',
                background: lab.id === attackerId ? '#211c12' : 'transparent',
              }}
            >
              <div className="text-sm font-semibold" style={{ color: lab.id === attackerId ? '#ECF3EF' : '#D6CDB8' }}>{lab.title}</div>
              <div className="text-xs mt-0.5" style={{ color: '#FFFFFF' }}>{lab.tagline}</div>
            </HoverCard>
          ))}
          {mode === 'defend' && LABS.map((lab) => {
            const on = lab.id === active.id
            const done = solvedIds.includes(lab.id)
            return (
              <HoverCard
                key={lab.id}
                as="button"
                type="button"
                onClick={() => setActiveId(lab.id)}
                className="text-left px-3 py-3 rounded-lg border shrink-0 transition-colors"
                style={{
                  borderColor: on ? '#5a4a20' : done ? '#244a1c' : '#241f14',
                  background: on ? '#211c12' : 'transparent',
                }}
              >
                <div className="text-sm font-semibold inline-flex items-center gap-1.5" style={{ color: on ? '#ECF3EF' : '#D6CDB8' }}>
                  {done && <CheckCircle2 size={13} style={{ color: KIT.emerald }} />}
                  {lab.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#FFFFFF' }}>{lab.tagline}</div>
              </HoverCard>
            )
          })}
        </nav>

        <div>
          {mode === 'attack' ? (
            <AttackerLab
              key={activeAttacker.id}
              lab={activeAttacker}
              labIndex={ATTACKER_LABS.findIndex((l) => l.id === activeAttacker.id) + 1}
              labCount={ATTACKER_LABS.length}
            />
          ) : (
          <LlmPlayground
            key={active.id}
            lab={active}
            labIndex={LABS.findIndex((l) => l.id === active.id) + 1}
            labCount={LABS.length}
            initialPrompt={active.id === initialId ? replayPrompt : ''}
          />
          )}
        </div>
      </StaggerItem>
      )}
    </Stagger>
  )
}
