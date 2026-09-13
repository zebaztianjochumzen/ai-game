import type { Topic, TopicProgress } from '../types'

interface Props {
  topic: Topic
  progress: TopicProgress
  unlocked: boolean
  onSelect: () => void
}

function topicXpEarned(topic: Topic, progress: TopicProgress): number {
  const quizXp = topic.quiz.reduce(
    (sum, q) => sum + (progress.questionResults[q.id] ? q.xp : 0),
    0,
  )
  const challengeXp = progress.challengeDone ? topic.challenge.xp : 0
  return quizXp + challengeXp
}

function topicXpTotal(topic: Topic): number {
  return topic.quiz.reduce((sum, q) => sum + q.xp, 0) + topic.challenge.xp
}

export function TopicCard({ topic, progress, unlocked, onSelect }: Props) {
  const earned = topicXpEarned(topic, progress)
  const total = topicXpTotal(topic)
  const done = progress.completed

  return (
    <button
      onClick={unlocked ? onSelect : undefined}
      disabled={!unlocked}
      className={`group relative flex w-full flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
        unlocked
          ? 'border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-white/[0.06]'
          : 'cursor-not-allowed border-white/5 bg-white/[0.01] opacity-50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{unlocked ? topic.icon : '🔒'}</span>
          <div>
            <h3 className="font-semibold text-white">{topic.title}</h3>
            <p className="text-xs text-slate-400">{topic.tagline}</p>
          </div>
        </div>
        {done && (
          <span className="shrink-0 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            ✓ done
          </span>
        )}
      </div>

      {unlocked ? (
        <div className="mt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
              style={{ width: total ? `${Math.round((earned / total) * 100)}%` : '0%' }}
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {earned} / {total} XP earned
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-slate-500">Unlocks at Level {topic.requiredLevel}</p>
      )}
    </button>
  )
}
