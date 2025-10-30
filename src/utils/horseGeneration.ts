// horse-utils.ts (or wherever it already lives)
import type { Horse } from '@/types'
import { HORSE_COLORS, HORSE_NAMES, HORSE_SPEED, TOTAL_HORSES } from '@/constants'
import { mulberry32 } from './seedGenerator'

const MIN_CONDITION = 40

function calculateHorseSpeed(condition: number, rnd: () => number): number {
  const safeCondition = Math.max(MIN_CONDITION, Math.min(100, condition))
  const base
    = (HORSE_SPEED.BASE_MIN + rnd() * (HORSE_SPEED.BASE_MAX - HORSE_SPEED.BASE_MIN))
      * HORSE_SPEED.BASE_MULTIPLIER
  return base * (safeCondition / 100)
}

export function generateHorses(): Horse[] {
  const horses: Horse[] = []
  for (let i = 0; i < TOTAL_HORSES; i++) {
    // condition ∈ [40..100]
    const condition = MIN_CONDITION + Math.floor(Math.random() * (101 - MIN_CONDITION))
    const speed = calculateHorseSpeed(condition, mulberry32(i + 1))

    horses.push({
      id: i + 1,
      name: HORSE_NAMES[i] ?? `Horse ${i + 1}`,
      color: HORSE_COLORS[i] ?? '#000000',
      condition,
      speed,
    })
  }
  return horses
}
