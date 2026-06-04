'use client'
import { useState } from 'react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: { label: string; value: string; icon: string }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is your primary hair concern?',
    options: [
      { label: 'Excessive shedding', value: 'shedding', icon: '💧' },
      { label: 'Thinning & low density', value: 'thinning', icon: '🔍' },
      { label: 'Dry or damaged scalp', value: 'scalp', icon: '🌵' },
      { label: 'Slow growth', value: 'growth', icon: '🌱' },
    ],
  },
  {
    id: 2,
    question: 'How long have you been experiencing this?',
    options: [
      { label: 'Less than 3 months', value: 'short', icon: '⏱' },
      { label: '3–12 months', value: 'medium', icon: '📅' },
      { label: '1–3 years', value: 'long', icon: '📆' },
      { label: 'More than 3 years', value: 'chronic', icon: '🗓' },
    ],
  },
  {
    id: 3,
    question: 'What is your hair type?',
    options: [
      { label: 'Straight & fine', value: 'straight-fine', icon: '〰️' },
      { label: 'Straight & thick', value: 'straight-thick', icon: '➖' },
      { label: 'Wavy or curly', value: 'wavy', icon: '🌊' },
      { label: 'Coily or kinky', value: 'coily', icon: '🔄' },
    ],
  },
  {
    id: 4,
    question: 'Have you tried hair treatments before?',
    options: [
      { label: 'No, this is my first time', value: 'first', icon: '✨' },
      { label: 'Yes, but they did not work', value: 'failed', icon: '❌' },
      { label: 'Yes, some improvement', value: 'partial', icon: '📈' },
      { label: "I use prescription treatments", value: 'rx', icon: '💊' },
    ],
  },
  {
    id: 5,
    question: 'What is your biggest priority?',
    options: [
      { label: 'Stop the shedding fast', value: 'stop-shed', icon: '🛑' },
      { label: 'Regrow thicker hair', value: 'regrow', icon: '💪' },
      { label: 'Natural & plant-based only', value: 'natural', icon: '🌿' },
      { label: 'A simple daily routine', value: 'simple', icon: '🗂' },
    ],
  },
]

interface Result {
  title: string
  subtitle: string
  product: string
  productLabel: string
  emoji: string
  description: string
  benefits: { icon: string; label: string }[]
}

const RESULTS: Record<string, Result> = {
  cleanser: {
    title: 'Stemuvita™ Hair Cleanse',
    subtitle: 'Your scalp needs a deep botanical reset.',
    product: '/products/stemuvita',
    productLabel: 'Shop Hair Cleanse →',
    emoji: '🧴',
    description:
      'The Stemuvita™ Hair Cleanse is your ideal first step. Its plant stem cell actives penetrate the scalp to neutralise DHT buildup, calm inflammation, and stop excessive shedding at the root — with 91% reduction in shedding reported by users in 8 weeks.',
    benefits: [
      { icon: '🛑', label: 'Stops shedding' },
      { icon: '🌿', label: 'Sulfate-free' },
      { icon: '✅', label: 'Clinically tested' },
    ],
  },
  serum: {
    title: 'Stemuvita™ Scalp Serum',
    subtitle: 'Your follicles need deep activation to grow.',
    product: '/products/stemuvita-serum',
    productLabel: 'Shop Scalp Serum →',
    emoji: '💧',
    description:
      'The Stemuvita™ Scalp Serum is a concentrated leave-in treatment designed to supercharge dormant follicles. Packed with phytosterols and bio-actives that signal new growth while you sleep. Users report visible new growth within 6 weeks.',
    benefits: [
      { icon: '🌱', label: 'Activates growth' },
      { icon: '🔬', label: 'Plant-based' },
      { icon: '🌙', label: 'Leave-in overnight' },
    ],
  },
  routine: {
    title: 'The Complete Stemuvita™ Routine',
    subtitle: 'Based on your answers, you need a full-spectrum approach.',
    product: '/products/stemuvita',
    productLabel: 'Start with the Cleanse →',
    emoji: '✨',
    description:
      'Your hair history and goals call for the full Stemuvita™ system. The Cleanse resets the scalp environment, while the Serum activates follicles and drives regrowth. Used together, customers report 2× faster improvement vs. using either product alone.',
    benefits: [
      { icon: '🛑', label: 'Stops shedding' },
      { icon: '🌱', label: 'Activates growth' },
      { icon: '💪', label: '2× faster results' },
    ],
  },
}

function getResult(answers: Record<number, string>): Result {
  const concern = answers[1]
  const duration = answers[2]
  const _hairType = answers[3]
  const history = answers[4]
  const priority = answers[5]

  let cleanserScore = 0
  let serumScore = 0
  let routineScore = 0

  // Primary concern scoring
  if (concern === 'shedding') cleanserScore += 3
  if (concern === 'scalp') cleanserScore += 2
  if (concern === 'growth') serumScore += 3
  if (concern === 'thinning') routineScore += 2

  // Duration scoring
  if (duration === 'long' || duration === 'chronic') routineScore += 2
  if (duration === 'short') cleanserScore += 1

  // History scoring
  if (history === 'failed') routineScore += 2
  if (history === 'first') cleanserScore += 1
  if (history === 'partial') serumScore += 1

  // Priority scoring
  if (priority === 'stop-shed') cleanserScore += 2
  if (priority === 'regrow') serumScore += 2
  if (priority === 'natural') serumScore += 1
  if (priority === 'simple') cleanserScore += 1

  const max = Math.max(cleanserScore, serumScore, routineScore)
  if (max === routineScore || (cleanserScore > 0 && serumScore > 0 && Math.abs(cleanserScore - serumScore) <= 1)) {
    return RESULTS.routine
  }
  if (cleanserScore >= serumScore) return RESULTS.cleanser
  return RESULTS.serum
}

export default function QuizPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [done, setDone] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const current = QUESTIONS[step]
  const progress = ((step) / QUESTIONS.length) * 100

  function select(value: string) {
    const next = { ...answers, [current.id]: value }
    setAnswers(next)
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(step + 1), 220)
    } else {
      setTimeout(() => setDone(true), 220)
    }
  }

  const result = done ? getResult(answers) : null

  if (done && result) {
    return (
      <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#d1dee6] text-4xl mb-6">
            {result.emoji}
          </div>
          <p className="text-[#3a79a9] text-sm font-semibold uppercase tracking-widest mb-3">Your personalised recommendation</p>
          <h1
            className="text-4xl sm:text-5xl font-light text-[#222222] mb-4"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            {result.title}
          </h1>
          <p className="text-[#544d43] text-lg mb-6">{result.subtitle}</p>

          <div className="bg-white rounded-3xl p-8 border border-[#dad7d4]/50 shadow-sm mb-8 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">🌿</div>
              <div>
                <p className="font-semibold text-[#222222] text-lg">{result.title}</p>
                <p className="text-[#3a79a9] text-sm">Clinically proven · Plant-based</p>
              </div>
            </div>
            <p className="text-[#544d43] text-sm leading-relaxed mb-6">{result.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {result.benefits.map((f) => (
                <div key={f.label} className="text-center bg-[#f6f5f3] rounded-2xl py-3 px-2">
                  <p className="text-xl mb-1">{f.icon}</p>
                  <p className="text-xs text-[#544d43] font-medium">{f.label}</p>
                </div>
              ))}
            </div>
            <Link
              href={result.product}
              className="block w-full text-center bg-[#3a79a9] text-white font-semibold py-3.5 rounded-full text-sm hover:bg-[#266396] transition-colors"
            >
              {result.productLabel}
            </Link>
          </div>

          {/* Email capture */}
          {!emailSent ? (
            <div className="mb-6 bg-white rounded-3xl p-6 border border-[var(--sf-border)]/50 text-left">
              <p className="font-semibold text-[var(--sf-text)] mb-1">Get your full results by email</p>
              <p className="text-xs text-[var(--sf-text-muted)] mb-4">
                We'll send your personalised routine guide + an exclusive 10% discount code.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 border border-[var(--sf-border)] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--sf-primary)] text-[var(--sf-text)]"
                />
                <button
                  disabled={emailLoading || !email.includes('@')}
                  onClick={async () => {
                    setEmailLoading(true)
                    try {
                      await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: 'Quiz Lead',
                          email,
                          message: `Quiz result: ${result?.title} | Answers: ${JSON.stringify(answers)}`,
                        }),
                      })
                    } catch {}
                    setEmailSent(true)
                    setEmailLoading(false)
                  }}
                  className="px-5 py-2.5 bg-[var(--sf-primary)] text-white rounded-full text-sm font-semibold hover:bg-[var(--sf-primary-dark)] disabled:opacity-50 transition-colors"
                >
                  {emailLoading ? '…' : 'Send'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-[var(--sf-accent-light)] rounded-2xl p-4 text-center border border-[var(--sf-border)]/50">
              <p className="text-sm font-semibold text-[var(--sf-primary)]">✓ Check your inbox for your guide + discount code!</p>
            </div>
          )}

          <button
            onClick={() => { setStep(0); setAnswers({}); setDone(false); setEmail(''); setEmailSent(false) }}
            className="text-sm text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] underline underline-offset-2"
          >
            Retake the quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f5f3] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-[#544d43] uppercase tracking-widest">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <p className="text-xs text-[#544d43]">{Math.round(progress)}% complete</p>
          </div>
          <div className="h-1 bg-[#dad7d4] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3a79a9] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={step} style={{ animation: 'hero-fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>
          <h2
            className="text-3xl sm:text-4xl font-light text-[#222222] mb-8 leading-tight"
            style={{ fontFamily: 'var(--sf-font-display)' }}
          >
            {current.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => select(opt.value)}
                className={`group flex items-center gap-4 bg-white border-2 rounded-2xl px-5 py-4 text-left transition-all hover:border-[#3a79a9] hover:shadow-sm active:scale-[0.98] ${
                  answers[current.id] === opt.value
                    ? 'border-[#3a79a9] bg-[#d1dee6]/30'
                    : 'border-[#dad7d4]'
                }`}
              >
                <span className="text-2xl flex-shrink-0">{opt.icon}</span>
                <span className="text-sm font-medium text-[#222222] group-hover:text-[#3a79a9] transition-colors">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Back */}
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-8 text-sm text-[#544d43] hover:text-[#222222] flex items-center gap-1 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
