import { topics, levelFromXp, totalPossibleXp } from '../data/topics'
import type { GameState } from '../types'
import { TopicCard } from './TopicCard'

interface Props {
  gameState: GameState
  getTopicProgress: (topicId: string) => GameState['progress'][string]
  onSelectTopic: (topicId: string) => void
}

const TIER_LABELS: Record<number, string> = {
  1: 'Tier 1 — Foundations',
  2: 'Tier 2 — Working With Knowledge',
  3: 'Tier 3 — Taking Action',
  4: 'Tier 4 — Making It Reliable',
  5: 'Tier 5 — Running It For Real',
  6: 'Tier 6 — The FDE Layer',
}

export function Dashboard({ gameState, getTopicProgress, onSelectTopic }: Props) {
  const level = levelFromXp(gameState.xp)
  const completedCount = topics.filter((t) => getTopicProgress(t.id).completed).length
  const totalXp = totalPossibleXp()

  const byTier = new Map<number, typeof topics>()
  for (const t of topics) {
    const list = byTier.get(t.tier) ?? []
    list.push(t)
    byTier.set(t.tier, list)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-sky-500/5 p-6">
        <h1 className="text-2xl font-bold text-white">Your path to Forward Deployed Engineer</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Play through topics real FDEs use daily — from token mechanics to shipping guardrailed
          agents in front of a customer. Answer quizzes and scenario challenges to earn XP, level
          up, and unlock the next tier.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="rounded-lg bg-black/20 px-3 py-2">
            <span className="text-slate-500">Level</span>{' '}
            <span className="font-semibold text-white">{level}</span>
          </div>
          <div className="rounded-lg bg-black/20 px-3 py-2">
            <span className="text-slate-500">Total XP</span>{' '}
            <span className="font-semibold text-white">
              {gameState.xp} / {totalXp}
            </span>
          </div>
          <div className="rounded-lg bg-black/20 px-3 py-2">
            <span className="text-slate-500">Topics completed</span>{' '}
            <span className="font-semibold text-white">
              {completedCount} / {topics.length}
            </span>
          </div>
        </div>
      </div>

      {[...byTier.entries()].map(([tier, tierTopics]) => (
        <section key={tier} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            {TIER_LABELS[tier] ?? `Tier ${tier}`}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tierTopics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                progress={getTopicProgress(topic.id)}
                unlocked={level >= topic.requiredLevel}
                onSelect={() => onSelectTopic(topic.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
