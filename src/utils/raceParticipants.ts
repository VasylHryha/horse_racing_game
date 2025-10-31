// utils/raceParticipants.ts
import type { Horse } from '@/types'
import { HORSES_PER_RACE } from '@/constants'
import { mulberry32 } from '@/utils/seedGenerator'

function shuffle<T>(arr: T[], seed?: number): T[] {
  const a = arr.slice()
  const rnd = seed == null ? Math.random : mulberry32(seed >>> 0)
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const t = a[i] as T
    a[i] = a[j] as T
    a[j] = t
  }
  return a
}

/** Pick fixed field for the whole race card */
export function pickFixedParticipants(horses: Horse[], seed?: number): Horse[] {
  return shuffle(horses, seed).slice(0, HORSES_PER_RACE)
}
