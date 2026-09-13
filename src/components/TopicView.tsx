import { useMemo, useState } from 'react'
import type { Topic, TopicProgress } from '../types'

type Stage = 'lesson' | 'quiz' | 'challenge' | 'summary'

interface Props {
  topic: Topic
  progress: TopicProgress
  onAnswerQuestion: (questionId: string, correct: boolean, xp: number) => void
  onCompleteChallenge: (xp: number) => void
  onMarkCompleted: () => void
  onBack: () => void
}

export function TopicView({
  topic,
  progress,
  onAnswerQuestion,
  onCompleteChallenge,
  onMarkCompleted,
  onBack,
}: Props) {
  const allQuizAnswered = useMemo(
    () => topic.quiz.every((q) => q.id in progress.questionResults),
    [topic, progress],
  )
  const initialStage: Stage = progress.completed
    ? 'summary'
    : allQuizAnswered
      ? progress.challengeDone
        ? 'summary'
        : 'challenge'
      : 'lesson'

  const [stage, setStage] = useState<Stage>(initialStage)
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showModelAnswer, setShowModelAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')

  const question = topic.quiz[qIndex]
  const alreadyAnswered = question ? question.id in progress.questionResults : false

  function selectOption(idx: number) {
    if (revealed || alreadyAnswered) return
    setSelected(idx)
    setRevealed(true)
    onAnswerQuestion(question.id, idx === question.correctIndex, question.xp)
  }

  function nextQuestion() {
    if (qIndex + 1 < topic.quiz.length) {
      setQIndex(qIndex + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setStage('challenge')
    }
  }

  function finishChallenge() {
    if (!progress.challengeDone) onCompleteChallenge(topic.challenge.xp)
    onMarkCompleted()
    setStage('summary')
  }

  const correctCount = Object.values(progress.questionResults).filter(Boolean).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <button
        onClick={onBack}
        className="mb-6 text-sm text-slate-400 hover:text-white"
      >
        ← Back to map
      </button>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-3xl">{topic.icon}</span>
        <div>
          <h1 className="text-xl font-bold text-white">{topic.title}</h1>
          <p className="text-sm text-slate-400">{topic.tagline}</p>
        </div>
      </div>

      {stage === 'lesson' && (
        <div className="animate-pop-in rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 rounded-lg border border-indigo-400/20 bg-indigo-400/5 p-3 text-sm text-indigo-200">
            <strong>Why it matters as an FDE:</strong> {topic.fdeRelevance}
          </div>
          <div className="space-y-4 text-sm leading-relaxed text-slate-300">
            {topic.lesson.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <button
            onClick={() => setStage('quiz')}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
          >
            Start Quiz →
          </button>
        </div>
      )}

      {stage === 'quiz' && question && (
        <div className="animate-pop-in rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Question {qIndex + 1} / {topic.quiz.length}
            </span>
            <span>{question.xp} XP</span>
          </div>
          <p className="mb-4 font-medium text-white">{question.prompt}</p>
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correctIndex
              const isSelected = idx === selected
              const showState = revealed || alreadyAnswered
              let cls =
                'w-full rounded-lg border px-4 py-2.5 text-left text-sm transition border-white/10 bg-white/[0.02] hover:border-indigo-400/40'
              if (showState) {
                if (isCorrect) {
                  cls =
                    'w-full rounded-lg border px-4 py-2.5 text-left text-sm border-emerald-400/50 bg-emerald-400/10 text-emerald-200'
                } else if (isSelected) {
                  cls =
                    'w-full rounded-lg border px-4 py-2.5 text-left text-sm border-red-400/50 bg-red-400/10 text-red-200'
                } else {
                  cls =
                    'w-full rounded-lg border px-4 py-2.5 text-left text-sm border-white/5 bg-white/[0.01] text-slate-500'
                }
              }
              return (
                <button key={idx} onClick={() => selectOption(idx)} className={cls} disabled={showState}>
                  {opt}
                </button>
              )
            })}
          </div>

          {(revealed || alreadyAnswered) && (
            <div className="mt-4 animate-pop-in rounded-lg bg-black/20 p-3 text-sm text-slate-300">
              <p className="mb-1 font-semibold text-white">
                {selected === question.correctIndex ? '✅ Correct' : alreadyAnswered ? 'Reviewed' : '❌ Not quite'}
              </p>
              <p>{question.explanation}</p>
              <button
                onClick={nextQuestion}
                className="mt-4 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {qIndex + 1 < topic.quiz.length ? 'Next question →' : 'Continue to challenge →'}
              </button>
            </div>
          )}

          <p className="mt-4 text-right text-xs text-slate-500">
            {correctCount} / {topic.quiz.length} correct so far
          </p>
        </div>
      )}

      {stage === 'challenge' && (
        <div className="animate-pop-in rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-3 inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            Scenario challenge · {topic.challenge.xp} XP
          </div>
          <p className="mb-4 font-medium text-white">{topic.challenge.prompt}</p>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Sketch your answer here (this is for your own thinking — it isn't graded)…"
            rows={4}
            className="mb-3 w-full rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-slate-200 outline-none focus:border-indigo-400/50"
          />

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowHint((v) => !v)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-white/30"
            >
              {showHint ? 'Hide hint' : '💡 Show hint'}
            </button>
            <button
              onClick={() => setShowModelAnswer((v) => !v)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-white/30"
            >
              {showModelAnswer ? 'Hide model answer' : '📖 Reveal model answer'}
            </button>
          </div>

          {showHint && (
            <p className="mt-3 animate-pop-in rounded-lg bg-black/20 p-3 text-sm text-slate-400">
              {topic.challenge.hint}
            </p>
          )}
          {showModelAnswer && (
            <p className="mt-3 animate-pop-in rounded-lg border border-indigo-400/20 bg-indigo-400/5 p-3 text-sm text-indigo-100">
              {topic.challenge.modelAnswer}
            </p>
          )}

          <button
            onClick={finishChallenge}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
          >
            Mark topic complete →
          </button>
        </div>
      )}

      {stage === 'summary' && (
        <div className="animate-pop-in rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
          <p className="text-4xl">🏆</p>
          <h2 className="mt-2 text-lg font-bold text-white">Topic complete: {topic.title}</h2>
          <p className="mt-1 text-sm text-slate-400">
            {correctCount} / {topic.quiz.length} quiz questions correct · challenge{' '}
            {progress.challengeDone ? 'done' : 'skipped'}
          </p>
          <button
            onClick={onBack}
            className="mt-6 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-2.5 font-semibold text-white hover:opacity-90"
          >
            Back to map
          </button>
        </div>
      )}
    </div>
  )
}
