import { useEffect, useRef, useState } from 'react'
import { topics, levelFromXp } from './data/topics'
import { useGameState } from './state/useGameState'
import { ProgressHeader } from './components/ProgressHeader'
import { Dashboard } from './components/Dashboard'
import { TopicView } from './components/TopicView'
import { LevelUpToast } from './components/LevelUpToast'

function App() {
  const {
    state,
    getTopicProgress,
    answerQuestion,
    completeChallenge,
    markTopicCompleted,
    resetProgress,
  } = useGameState()

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const [levelUpTo, setLevelUpTo] = useState<number | null>(null)
  const prevLevel = useRef(levelFromXp(state.xp))

  useEffect(() => {
    const newLevel = levelFromXp(state.xp)
    if (newLevel > prevLevel.current) {
      setLevelUpTo(newLevel)
    }
    prevLevel.current = newLevel
  }, [state.xp])

  const activeTopic = activeTopicId ? topics.find((t) => t.id === activeTopicId) ?? null : null

  return (
    <div className="min-h-screen text-slate-100">
      <ProgressHeader xp={state.xp} onReset={resetProgress} />

      {activeTopic ? (
        <TopicView
          topic={activeTopic}
          progress={getTopicProgress(activeTopic.id)}
          onAnswerQuestion={(qid, correct, xp) => answerQuestion(activeTopic.id, qid, correct, xp)}
          onCompleteChallenge={(xp) => completeChallenge(activeTopic.id, xp)}
          onMarkCompleted={() => markTopicCompleted(activeTopic.id)}
          onBack={() => setActiveTopicId(null)}
        />
      ) : (
        <Dashboard
          gameState={state}
          getTopicProgress={getTopicProgress}
          onSelectTopic={setActiveTopicId}
        />
      )}

      {levelUpTo !== null && (
        <LevelUpToast level={levelUpTo} onDismiss={() => setLevelUpTo(null)} />
      )}
    </div>
  )
}

export default App
