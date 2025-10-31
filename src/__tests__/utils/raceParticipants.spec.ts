import { describe, expect, it } from 'vitest'
import { pickFixedParticipants } from '@/utils/raceParticipants'

const horses = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `H${i + 1}`,
  color: '#000',
  condition: 80,
  speed: 10,
  effectiveSpeed: 10,
}))

describe('raceParticipants.pickFixedParticipants', () => {
  it('returns exactly 10 unique horses', () => {
    // Uses a seeded shuffle and slices first 10
    const selected = pickFixedParticipants(horses, 123)
    expect(selected).toHaveLength(10)
    expect(new Set(selected.map(h => h.id)).size).toBe(10)
  })

  it('is deterministic with the same seed', () => {
    // Same seed -> same ordering -> equal selections
    const a = pickFixedParticipants(horses, 42).map(h => h.id)
    const b = pickFixedParticipants(horses, 42).map(h => h.id)
    expect(a).toEqual(b)
  })
})
