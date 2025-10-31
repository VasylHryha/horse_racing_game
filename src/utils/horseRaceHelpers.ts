// horse-race-helpers.ts
import type { Horse } from '@/types'
import { mulberry32 } from './seedGenerator'

const MIN_CONDITION = 40
const MAX_CONDITION = 100

/**
 * Roll random condition [40-100]
 */
function rollCondition(rng: () => number): number {
  return MIN_CONDITION + Math.floor(rng() * (MAX_CONDITION - MIN_CONDITION + 1))
}

/**
 * Calculate effective speed from base speed and condition.
 */
export function computeEffectiveSpeed(baseSpeed: number, condition: number): number {
  const cond = Math.max(MIN_CONDITION, Math.min(MAX_CONDITION, condition))
  return baseSpeed * (cond / MAX_CONDITION)
}

/**
 * Returns new array with re-rolled condition and effectiveSpeed.
 * horse.speed (baseSpeed) remains unchanged.
 * Deterministic if seed provided.
 */
export function prepareRaceHorses(horses: Horse[], seed?: number): Horse[] {
  const rng = seed == null ? Math.random : mulberry32(seed ^ 0xA11CE)

  return horses.map((h, i) => {
    const r = seed == null ? rng : mulberry32((seed ^ (i + 1) * 0x9E3779B9) >>> 0)
    const newCondition = rollCondition(r)
    const effectiveSpeed = computeEffectiveSpeed(h.speed, newCondition)

    return { ...h, condition: newCondition, effectiveSpeed }
  })
}

/**
 * Mutates horses with re-rolled condition and effectiveSpeed.
 * horse.speed (baseSpeed) remains unchanged.
 * Deterministic if seed provided.
 */
export function mutateRaceHorses(horses: Horse[], seed?: number): void {
  const rng = seed == null ? Math.random : mulberry32(seed ^ 0xBADC0DE)

  for (let i = 0; i < horses.length; i++) {
    const h = horses[i] as Horse
    const r = seed == null ? rng : mulberry32((seed ^ (i + 1) * 0x85EBCA77) >>> 0)
    const newCondition = rollCondition(r)

    h.condition = newCondition
    h.effectiveSpeed = computeEffectiveSpeed(h.speed, newCondition)
  }
}
