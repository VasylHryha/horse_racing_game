import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useRaceController } from '@/composables/useRaceController'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'

// Mock the simulation composable to avoid RAF/timing complexity
// This keeps the test focused on controller orchestration
vi.mock('@/composables/useRaceSimulation', () => {
  return {
    useRaceSimulation: () => ({
      simulateRace: vi.fn(async (round: any, _speed: number, onProgress: any, onComplete: any) => {
        // Emit a single progress update
        onProgress({ elapsedTime: 1, positions: {} })
        const rankings = round.horses.map((h: any, i: number) => ({
          horseId: h.id,
          name: h.name,
          color: h.color,
          time: i + 1,
          speed: 0,
          position: i + 1,
        }))
        // Immediately complete with deterministic rankings
        onComplete(rankings)
      }),
      reset: vi.fn(),
    }),
  }
})

describe('useRaceController', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('runs available rounds, records results, and toggles UI state', async () => {
    const data = useRaceDataStore()
    const anim = useRaceAnimationStore()
    const ui = useUIControlStore()

    // Seed a minimal schedule of 2 rounds with 10 horses
    const horses = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `H${i + 1}`,
      color: '#000',
      condition: 80,
      speed: 10,
      effectiveSpeed: 10,
    }))

    data.$patch({
      horses,
      // fixedParticipants and raceHorses align with controller expectations
      // controller re-rolls in-place via store method each round
      raceHorses: horses.map(h => ({ ...h })),
      schedule: [
        { roundNumber: 1, distance: 1200, horses, results: null },
        { roundNumber: 2, distance: 1400, horses, results: null },
      ],
      currentRound: 0,
      raceResults: [],
    })

    const spyReroll = vi.spyOn(data, 'rerollRaceHorsesForCurrentRound')

    const { startRace } = useRaceController()
    vi.useFakeTimers()
    // Start race and advance timers to step past inter-round delay
    const p = startRace()
    // Advance timers for the inter-round delay (2 seconds per gap)
    await vi.advanceTimersByTimeAsync(4000)
    await p
    vi.useRealTimers()

    // UI toggled back to idle
    expect(ui.isRacing).toBe(false)

    // Two results stored (one per round)
    expect(data.raceResults.length).toBe(2)
    expect(data.raceResults[0].roundNumber).toBe(1)
    expect(data.raceResults[1].roundNumber).toBe(2)

    // Animation store received progress during the run
    expect(anim.currentRaceState).not.toBeNull()

    // Reroll called for each round
    expect(spyReroll).toHaveBeenCalledTimes(2)
    expect(spyReroll).toHaveBeenNthCalledWith(1, 1)
    expect(spyReroll).toHaveBeenNthCalledWith(2, 2)
  })
})
