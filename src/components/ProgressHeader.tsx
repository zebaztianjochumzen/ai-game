import { XP_PER_LEVEL, levelFromXp, xpIntoLevel } from '../data/topics'

interface Props {
  xp: number
  onReset: () => void
}

export function ProgressHeader({ xp, onReset }: Props) {
  const level = levelFromXp(xp)
  const into = xpIntoLevel(xp)
  const pct = Math.round((into / XP_PER_LEVEL) * 100)

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0e1a]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <span>🎮</span>
          <span className="hidden sm:inline">The AI Game</span>
        </div>

        <div className="ml-auto flex flex-1 items-center gap-3 sm:flex-none sm:w-72">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-sky-400 text-sm font-bold text-slate-950 shadow-lg shadow-indigo-500/30">
            {level}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Level {level}</span>
              <span>
                {into} / {XP_PER_LEVEL} XP
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) onReset()
          }}
          className="ml-2 shrink-0 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-400 hover:border-red-400/40 hover:text-red-300"
          title="Reset progress"
        >
          Reset
        </button>
      </div>
    </header>
  )
}
