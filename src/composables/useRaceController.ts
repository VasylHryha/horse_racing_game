import type { RaceResult } from '@/types'
import { TOTAL_ROUNDS } from '@/constants'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'
import { prepareRaceHorses } from '@/utils/horseRaceHelpers'
import { useRaceSimulation } from './useRaceSimulation'

export function useRaceController() {
  const { simulateRace, reset } = useRaceSimulation()
  const raceDataStore = useRaceDataStore()
  const uiControlStore = useUIControlStore()
  const raceAnimationStore = useRaceAnimationStore()

  async function startRace() {
    uiControlStore.startRace()
    await runAllRounds()
  }

  async function runAllRounds() {
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const round = raceDataStore.schedule[i]
      if (!round)
        break

      // Prepare horses with fresh condition and effectiveSpeed for this race
      const preparedRound = {
        ...round,
        horses: prepareRaceHorses(round.horses),
      }

      await simulateRace(
        preparedRound,
        uiControlStore.speedMultiplier,
        (state) => {
          raceAnimationStore.updateRaceState(state)
        },
        (rankings) => {
          const result: RaceResult = {
            roundNumber: round.roundNumber,
            distance: round.distance,
            rankings,
          }
          raceDataStore.completeRound(result)
        },
        () => uiControlStore.isPaused,
      )

      // Clear race state between rounds
      if (i < TOTAL_ROUNDS - 1) {
        raceAnimationStore.clearRaceState()
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    uiControlStore.stopRace()
  }

  return {
    startRace,
    resetRace: reset,
  }
}
