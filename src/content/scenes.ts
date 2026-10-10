import type { FC } from 'react'
import type { Mode } from '../engine/motion'
import { S01Title, S02WhyLocal, S03Day0, S04Wall, S05Roadmap } from '../scenes/Act1'
import { S06Cluster, S07Pipeline, S08Capacity, S09Heat } from '../scenes/Act2'
import { S10Gap, S11Patch, S12Planner, S13Verify } from '../scenes/Act3'
import { S14Arch, S15Reconcile, S16Gateway } from '../scenes/Act4'
import { S17Small, S18Harness, S19Agent, S20TextTools, S21Memory, S22Evals } from '../scenes/Act5'
import { S23Ops, S24Sync, S25Tour, S26SelfDev, S27Lessons, S28Next, S29Thanks } from '../scenes/Act6'

export interface SceneProps {
  step: number
  mode: Mode
}
export interface SceneDef {
  id: string
  act: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'appendix'
  title: string
  steps: number
  printStep?: number
  targetSeconds: number
  continuesFrom?: string
  /** auto mode: milliseconds to wait before each following build step appears (length = steps - 1) */
  autoMs?: number[]
  Component: FC<SceneProps>
}

export const mainScenes: SceneDef[] = [
  { id: 'title', act: 1, title: 'Title', steps: 2, targetSeconds: 30, autoMs: [2800], Component: S01Title },
  { id: 'why-local', act: 1, title: 'Why local AI', steps: 4, targetSeconds: 60, autoMs: [1800, 1800, 1800], Component: S02WhyLocal },
  { id: 'day-zero', act: 1, title: 'Day 0: one script', steps: 3, targetSeconds: 90, autoMs: [5200, 3200], Component: S03Day0 },
  { id: 'wall', act: 1, title: 'The wall', steps: 3, targetSeconds: 60, autoMs: [2400, 3600], Component: S04Wall },
  { id: 'roadmap', act: 1, title: 'Six steps', steps: 6, targetSeconds: 90, autoMs: [2200, 2200, 2200, 2200, 2600], Component: S05Roadmap },
  { id: 'cluster', act: 2, title: 'The cluster', steps: 3, targetSeconds: 70, autoMs: [2400, 3200], Component: S06Cluster },
  { id: 'pipeline', act: 2, title: 'Pipeline parallelism', steps: 4, targetSeconds: 90, autoMs: [2600, 2600, 3000], Component: S07Pipeline },
  { id: 'capacity', act: 2, title: 'Capacity, not speed', steps: 2, targetSeconds: 60, autoMs: [4500], Component: S08Capacity },
  { id: 'heat', act: 2, title: 'War story: heat', steps: 3, targetSeconds: 80, autoMs: [3800, 4500], Component: S09Heat },
  { id: 'gap', act: 3, title: 'The gap', steps: 3, targetSeconds: 60, autoMs: [3200, 3200], Component: S10Gap },
  { id: 'patch', act: 3, title: 'Patch, don\'t fork', steps: 4, targetSeconds: 110, autoMs: [7800, 3000, 3000], Component: S11Patch },
  { id: 'planner', act: 3, title: 'Auto layer planning', steps: 4, targetSeconds: 100, autoMs: [2400, 3600, 3000], Component: S12Planner },
  { id: 'verify', act: 3, title: 'Trust, but verify', steps: 3, targetSeconds: 70, autoMs: [3200, 3200], Component: S13Verify },
  { id: 'architecture', act: 4, title: 'Architecture', steps: 5, targetSeconds: 90, autoMs: [2000, 2000, 2000, 2400], Component: S14Arch },
  { id: 'reconciler', act: 4, title: 'Reconciler', steps: 4, targetSeconds: 80, autoMs: [2800, 2800, 2800], Component: S15Reconcile },
  { id: 'gateway', act: 4, title: 'The gateway', steps: 3, targetSeconds: 80, autoMs: [4800, 3600], Component: S16Gateway },
  { id: 'small-models', act: 5, title: 'Small models', steps: 4, targetSeconds: 50, autoMs: [2200, 2200, 2400], Component: S17Small },
  { id: 'harness', act: 5, title: 'Harness design', steps: 4, targetSeconds: 110, autoMs: [3200, 3200, 3200], Component: S18Harness },
  { id: 'agent', act: 5, title: 'Agent mode', steps: 3, targetSeconds: 60, autoMs: [2800, 2800], Component: S19Agent },
  { id: 'text-tools', act: 5, title: 'Visible tool calls', steps: 3, targetSeconds: 70, autoMs: [3000, 4500], Component: S20TextTools },
  { id: 'memory', act: 5, title: 'Memory', steps: 5, targetSeconds: 70, autoMs: [2400, 2400, 2400, 2800], Component: S21Memory },
  { id: 'evals', act: 5, title: 'Evals', steps: 3, targetSeconds: 70, autoMs: [3600, 3200], Component: S22Evals },
  { id: 'automations', act: 6, title: 'Automations and crons', steps: 4, targetSeconds: 90, autoMs: [4800, 3000, 3000], Component: S23Ops },
  { id: 'sync', act: 6, title: 'Updates and sync', steps: 3, targetSeconds: 70, autoMs: [3000, 3600], Component: S24Sync },
  { id: 'tour', act: 6, title: 'The app', steps: 11, targetSeconds: 120, autoMs: [2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800, 2800], Component: S25Tour },
  { id: 'self-dev', act: 6, title: 'Self-development', steps: 6, targetSeconds: 80, autoMs: [2400, 2400, 2400, 2400, 2600], Component: S26SelfDev },
  { id: 'lessons', act: 7, title: 'Lessons', steps: 5, targetSeconds: 90, autoMs: [2800, 2800, 2800, 2800], Component: S27Lessons },
  { id: 'next', act: 7, title: 'What\'s next', steps: 4, targetSeconds: 40, autoMs: [2400, 2400, 2400], Component: S28Next },
  { id: 'thanks', act: 7, title: 'Thank you', steps: 2, targetSeconds: 30, autoMs: [3000], Component: S29Thanks },
]
export const appendixScenes: SceneDef[] = []

export const getScenes = (includeAppendix: boolean): SceneDef[] =>
  includeAppendix ? [...mainScenes, ...appendixScenes] : mainScenes
