# The AI Game

A small, evolving browser game for learning applied AI/LLM concepts — framed around what an
**AI Solutions Engineer / Forward Deployed Engineer (FDE)** actually needs to know day to day:
LLM fundamentals, prompt engineering, embeddings & RAG, tool use & agents, evals, fine-tuning
vs. prompting, deployment, data pipelines, safety/guardrails, and the FDE mindset itself.

Play a few minutes at a time: read a short lesson, answer a quiz, work through a scenario
challenge, earn XP, level up, and unlock the next topic.

## Play it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

Progress (XP + per-topic completion) is saved to your browser's `localStorage`, so it persists
between sessions on the same machine/browser. Use the **Reset** button in the header to start
over.

## How it's structured

- `src/data/topics.ts` — all content: topics, lessons, quiz questions, and scenario challenges.
  This is the natural place to add new topics or expand existing ones.
- `src/types.ts` — shared types for topics and progress.
- `src/state/useGameState.ts` — XP/progress state, persisted to `localStorage`.
- `src/components/` — `Dashboard` (topic map), `TopicView` (lesson → quiz → challenge flow),
  `ProgressHeader`, `TopicCard`, `LevelUpToast`.

### Progression model

- Every quiz question and scenario challenge awards XP.
- Level = `floor(totalXp / 150) + 1`.
- Each topic has a `requiredLevel`; topics unlock as you level up, in six tiers moving from
  foundations → knowledge systems → agentic action → reliability → production → the FDE layer.

## Adding a new topic

Add an entry to the `topics` array in `src/data/topics.ts` following the existing `Topic` shape
(lesson paragraphs, 3-5 quiz questions, one scenario challenge). Assign it a `tier` and
`requiredLevel` consistent with where it should unlock — everything else (the map, locking,
XP, and progress UI) picks it up automatically.

## Tech stack

Vite + React + TypeScript + Tailwind CSS v4. No backend — everything runs client-side.
