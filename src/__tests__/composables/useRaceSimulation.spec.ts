import type { Horse, HorseRanking, Round } from '@/types'
import { describe, expect, it } from 'vitest'
import { useRaceSimulation } from '@/composables/useRaceSimulation'

describe('useRaceSimulation', () => {
  const mockHorses: Horse[] = [
    { id: 1, name: 'Thunder', color: '#FF0000', condition: 95 },
    { id: 2, name: 'Lightning', color: '#00FF00', condition: 85 },
    { id: 3, name: 'Storm', color: '#0000FF', condition: 75 },
  ]

  const mockRound: Round = {
    roundNumber: 1,
    distance: 1200,
    horses: mockHorses,
    results: null,
  }

  it('should calculate horse speeds based on condition', () => {
    const { getHorsesWithSpeed } = useRaceSimulation()
    const speeds = getHorsesWithSpeed(mockHorses)

    // All horses should have positive speeds proportional to their condition
    expect(speeds[1]).toBeGreaterThan(0)
    expect(speeds[2]).toBeGreaterThan(0)
    expect(speeds[3]).toBeGreaterThan(0)

    // Higher condition horses should have higher average speeds (check averages over multiple runs)
    let sum1 = 0
    let sum3 = 0
    for (let i = 0; i < 10; i++) {
      const runSpeeds = getHorsesWithSpeed(mockHorses)
      sum1 += runSpeeds[1]
      sum3 += runSpeeds[3]
    }
    expect(sum1 / 10).toBeGreaterThan(sum3 / 10) // Horse 1 (95 condition) should be faster on average than Horse 3 (75 condition)
  })

  it('should generate positive speeds for all horses', () => {
    const { getHorsesWithSpeed } = useRaceSimulation()
    const speeds = getHorsesWithSpeed(mockHorses)

    mockHorses.forEach((horse) => {
      expect(speeds[horse.id]).toBeGreaterThan(0)
    })
  })

  it('should return speeds record with all horse IDs', () => {
    const { getHorsesWithSpeed } = useRaceSimulation()
    const speeds = getHorsesWithSpeed(mockHorses)

    mockHorses.forEach((horse) => {
      expect(speeds).toHaveProperty(horse.id.toString())
    })
  })

  it('should initialize race state properly', () => {
    const { raceState } = useRaceSimulation()
    expect(raceState.value).toBe(null)
  })

  it('should simulate race and complete properly', async () => {
    const { simulateRace } = useRaceSimulation()
    let completionCalled = false
    let rankingsReceived: HorseRanking[] = []

    await simulateRace(
      mockRound,
      1,
      () => {
        // onProgress callback
      },
      (rankings) => {
        completionCalled = true
        rankingsReceived = rankings
      },
      () => false, // isPaused callback
    )

    expect(completionCalled).toBe(true)
    expect(rankingsReceived).toHaveLength(3)
  })

  it('should provide race progress callbacks', async () => {
    const { simulateRace } = useRaceSimulation()
    const progressUpdates: number[] = []

    await simulateRace(
      mockRound,
      1,
      (state) => {
        progressUpdates.push(state.elapsedTime)
      },
      () => {
        // onComplete
      },
      () => false, // isPaused callback
    )

    expect(progressUpdates.length).toBeGreaterThan(0)
    // Progress should be monotonically increasing
    for (let i = 1; i < progressUpdates.length; i++) {
      expect(progressUpdates[i]).toBeGreaterThanOrEqual(progressUpdates[i - 1])
    }
  })

  it('should calculate rankings in order of finish', async () => {
    const { simulateRace } = useRaceSimulation()
    let finalRankings: HorseRanking[] = []

    await simulateRace(
      mockRound,
      1,
      () => {
        // onProgress
      },
      (rankings) => {
        finalRankings = rankings
      },
      () => false, // isPaused callback
    )

    // Rankings should be sorted by position
    for (let i = 1; i < finalRankings.length; i++) {
      expect(finalRankings[i].position).toBeGreaterThanOrEqual(finalRankings[i - 1].position)
    }

    // All horses should have a finish time
    finalRankings.forEach((ranking) => {
      expect(ranking.time).toBeGreaterThanOrEqual(0)
    })
  })

  it('should assign positions 1-3 for three horses', async () => {
    const { simulateRace } = useRaceSimulation()
    let finalRankings: HorseRanking[] = []

    await simulateRace(
      mockRound,
      1,
      () => {
        // onProgress
      },
      (rankings) => {
        finalRankings = rankings
      },
      () => false, // isPaused callback
    )

    expect(finalRankings[0].position).toBe(1)
    expect(finalRankings[1].position).toBe(2)
    expect(finalRankings[2].position).toBe(3)
  })

  it('should accept speed multiplier parameter', async () => {
    const { simulateRace } = useRaceSimulation()

    // Just verify that the function accepts the multiplier without error
    let completionCalled = false
    await simulateRace(
      mockRound,
      2, // 2x speed multiplier
      () => {
        // onProgress
      },
      () => {
        completionCalled = true
      },
      () => false, // isPaused callback
    )

    expect(completionCalled).toBe(true)
  })
})
