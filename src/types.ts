export type QuestionKind = 'mcq'

export interface QuizQuestion {
  id: string
  kind: QuestionKind
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
  xp: number
}

export interface ScenarioChallenge {
  id: string
  prompt: string
  hint: string
  modelAnswer: string
  xp: number
}

export interface Topic {
  id: string
  tier: number
  requiredLevel: number
  title: string
  tagline: string
  icon: string
  fdeRelevance: string
  lesson: string[]
  quiz: QuizQuestion[]
  challenge: ScenarioChallenge
}

export interface TopicProgress {
  questionResults: Record<string, boolean>
  challengeDone: boolean
  completed: boolean
}

export interface GameState {
  xp: number
  progress: Record<string, TopicProgress>
  lastVisited?: string
}
