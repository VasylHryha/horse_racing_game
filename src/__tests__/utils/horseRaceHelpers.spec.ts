import { describe, expect, it } from 'vitest'
import { computeEffectiveSpeed, mutateRaceHorses } from '@/utils/horseRaceHelpers'

describe('horseRaceHelpers.computeEffectiveSpeed', () => {
  it('scales base speed by condition percentage', () => {
    // 100% condition => base speed, 50% => half speed
    expect(computeEffectiveSpeed(20, 100)).toBe(20)
    expect(computeEffectiveSpeed(20, 50)).toBe(10)
  })

  it('clamps low condition to minimum', () => {
    // Minimum condition is 40, so 20 * 0.4 = 8
    expect(computeEffectiveSpeed(20, 10)).toBe(8)
  })
})

describe('horseRaceHelpers.mutateRaceHorses', () => {
  it('updates condition and effectiveSpeed in-place', () => {
    const horses = [
      { id: 1, name: 'A', color: '#000', condition: 80, speed: 15, effectiveSpeed: 12 },
      { id: 2, name: 'B', color: '#111', condition: 75, speed: 14, effectiveSpeed: 11 },
    ]

    mutateRaceHorses(horses, 99)

    // Base speed remains the same
    expect(horses[0].speed).toBe(15)
    expect(horses[1].speed).toBe(14)

    // Condition and effectiveSpeed updated
    expect(horses[0].condition).not.toBe(80)
    expect(horses[1].condition).not.toBe(75)
    expect(typeof horses[0].effectiveSpeed).toBe('number')
    expect(typeof horses[1].effectiveSpeed).toBe('number')
  })
})
