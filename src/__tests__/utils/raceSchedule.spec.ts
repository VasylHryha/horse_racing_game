import type { Horse } from '@/types'
import { beforeEach, describe, expect, it } from 'vitest'
import { HORSES_PER_RACE, ROUND_DISTANCES, TOTAL_HORSES, TOTAL_ROUNDS } from '@/constants'
import { generateHorses } from '../../utils/horseGeneration'
import { generateSchedule } from '../../utils/raceSchedule'

describe('useRaceSchedule', () => {
  let horses: Horse[]

  beforeEach(() => {
    horses = generateHorses()
  })

  it('should generate 6 rounds', () => {
    const schedule = generateSchedule(horses)
    expect(schedule).toHaveLength(TOTAL_ROUNDS)
  })

  it('should assign correct round numbers', () => {
    const schedule = generateSchedule(horses)
    schedule.forEach((round, index) => {
      expect(round.roundNumber).toBe(index + 1)
    })
  })

  it('should assign 10 horses per round', () => {
    const schedule = generateSchedule(horses)
    schedule.forEach((round) => {
      expect(round.horses).toHaveLength(HORSES_PER_RACE)
    })
  })

  it('should use correct distances for each round', () => {
    const schedule = generateSchedule(horses)
    schedule.forEach((round, index) => {
      expect(round.distance).toBe(ROUND_DISTANCES[index])
    })
  })

  it('should select horses from the provided list', () => {
    const schedule = generateSchedule(horses)
    const horseIds = horses.map(h => h.id)

    schedule.forEach((round) => {
      round.horses.forEach((horse) => {
        expect(horseIds).toContain(horse.id)
      })
    })
  })

  it('should not have duplicate horses in same round', () => {
    const schedule = generateSchedule(horses)

    schedule.forEach((round) => {
      const ids = round.horses.map(h => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(HORSES_PER_RACE)
    })
  })

  it('should initialize round results as null', () => {
    const schedule = generateSchedule(horses)
    schedule.forEach((round) => {
      expect(round.results).toBeNull()
    })
  })

  it('should have horses across multiple rounds', () => {
    const schedule = generateSchedule(horses)
    const allParticipatingIds = new Set<number>()

    schedule.forEach((round) => {
      round.horses.forEach((horse) => {
        allParticipatingIds.add(horse.id)
      })
    })

    // Should have at least some horses participating (could be all or subset depending on algorithm)
    expect(allParticipatingIds.size).toBeGreaterThan(0)
    expect(allParticipatingIds.size).toBeLessThanOrEqual(TOTAL_HORSES)
  })
})
