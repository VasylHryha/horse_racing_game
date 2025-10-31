// composables/useRaceController.ts
import type { RaceResult } from '@/types'
import { useRaceSimulation } from '@/composables/useRaceSimulation'
import { TOTAL_ROUNDS } from '@/constants'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'

export function useRaceController() {
  const { simulateRace, reset } = useRaceSimulation()
  const raceData = useRaceDataStore()
  const ui = useUIControlStore()
  const anim = useRaceAnimationStore()

  async function startRace() {
    ui.startRace()
    await runAllRounds()
  }

  async function runAllRounds() {
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const round = raceData.schedule[i]
      if (!round)
        break

      // Re-roll same 10 horses for this round (condition + effectiveSpeed)
      raceData.rerollRaceHorsesForCurrentRound(round.roundNumber)

      await simulateRace(
        { ...round, horses: raceData.currentRaceHorses },
        ui.speedMultiplier,
        (state) => { anim.updateRaceState(state) },
        (rankings) => {
          const result: RaceResult = {
            roundNumber: round.roundNumber,
            distance: round.distance,
            rankings,
          }
          raceData.completeRound(result)
        },
        () => ui.isPaused,
      )

      if (i < TOTAL_ROUNDS - 1) {
        anim.clearRaceState()
        await new Promise(r => setTimeout(r, 2000))
      }
    }

    ui.stopRace()
  }

  return { startRace, resetRace: reset }
}
