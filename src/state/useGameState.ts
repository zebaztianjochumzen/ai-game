import { useCallback, useEffect, useState } from 'react'
import type { GameState, TopicProgress } from '../types'

const STORAGE_KEY = 'ai-game-state-v1'

function emptyState(): GameState {
  return { xp: 0, progress: {} }
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as GameState
    if (typeof parsed.xp !== 'number' || typeof parsed.progress !== 'object') {
      return emptyState()
    }
    return parsed
  } catch {
    return emptyState()
  }
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private mode, etc.) — progress just won't persist
  }
}

function getTopicProgress(state: GameState, topicId: string): TopicProgress {
  return (
    state.progress[topicId] ?? {
      questionResults: {},
      challengeDone: false,
      completed: false,
    }
  )
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const answerQuestion = useCallback(
    (topicId: string, questionId: string, correct: boolean, xpForCorrect: number) => {
      setState((prev) => {
        const tp = getTopicProgress(prev, topicId)
        if (questionId in tp.questionResults) return prev // already answered, no double XP
        const nextTp: TopicProgress = {
          ...tp,
          questionResults: { ...tp.questionResults, [questionId]: correct },
        }
        return {
          ...prev,
          xp: prev.xp + (correct ? xpForCorrect : 0),
          progress: { ...prev.progress, [topicId]: nextTp },
        }
      })
    },
    [],
  )

  const completeChallenge = useCallback((topicId: string, xp: number) => {
    setState((prev) => {
      const tp = getTopicProgress(prev, topicId)
      if (tp.challengeDone) return prev
      const nextTp: TopicProgress = { ...tp, challengeDone: true }
      return {
        ...prev,
        xp: prev.xp + xp,
        progress: { ...prev.progress, [topicId]: nextTp },
      }
    })
  }, [])

  const markTopicCompleted = useCallback((topicId: string) => {
    setState((prev) => {
      const tp = getTopicProgress(prev, topicId)
      if (tp.completed) return prev
      return {
        ...prev,
        progress: { ...prev.progress, [topicId]: { ...tp, completed: true } },
      }
    })
  }, [])

  const setLastVisited = useCallback((topicId: string | undefined) => {
    setState((prev) => ({ ...prev, lastVisited: topicId }))
  }, [])

  const resetProgress = useCallback(() => {
    setState(emptyState())
  }, [])

  return {
    state,
    getTopicProgress: (topicId: string) => getTopicProgress(state, topicId),
    answerQuestion,
    completeChallenge,
    markTopicCompleted,
    setLastVisited,
    resetProgress,
  }
}
