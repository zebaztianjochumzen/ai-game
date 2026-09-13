interface Props {
  level: number
  onDismiss: () => void
}

export function LevelUpToast({ level, onDismiss }: Props) {
  return (
    <div
      onAnimationEnd={onDismiss}
      className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center"
    >
      <div className="animate-float-up rounded-full border border-indigo-400/40 bg-indigo-500/20 px-5 py-2 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 backdrop-blur">
        🎉 Level up! You're now Level {level}
      </div>
    </div>
  )
}
