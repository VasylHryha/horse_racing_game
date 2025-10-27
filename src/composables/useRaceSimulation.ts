import type { Horse, HorsePosition, HorseRanking, RaceState, Round } from '@/store/modules/racing'
import { ref } from 'vue'
import { TIME_COMPRESSION } from '@/utils/constants'

export function useRaceSimulation() {
  // State
  const raceState = ref<RaceState | null>(null)
  const isAnimating = ref(false)

  // Calculate horse speeds based on condition
  function calculateHorseSpeeds(horses: Horse[]): Record<number, number> {
    const speeds: Record<number, number> = {}
    horses.forEach((horse) => {
      const baseSpeed = 12 + Math.random() * 6 // 12-18 m/s
      speeds[horse.id] = baseSpeed * (horse.condition / 100)
    })
    return speeds
  }

  // Main race simulation function
  async function simulateRace(
    round: Round,
    onProgress: (state: RaceState) => void,
    onComplete: (rankings: HorseRanking[]) => void,
  ): Promise<void> {
    const distance = round.distance
    const horseSpeeds = calculateHorseSpeeds(round.horses)
    const finishTimes: Record<number, number> = {}
    const finishedHorses: Set<number> = new Set()

    const startTime = Date.now()
    isAnimating.value = true

    return new Promise<void>((resolve) => {
      const animate = () => {
        const realElapsed = (Date.now() - startTime) / 1000
        const simulatedTime = realElapsed * TIME_COMPRESSION

        const currentState: RaceState = {
          elapsedTime: simulatedTime,
          positions: {} as Record<number, HorsePosition>,
        }

        const rankings: HorseRanking[] = []

        // Update each horse position
        round.horses.forEach((horse) => {
          const speed = horseSpeeds[horse.id] ?? 0
          let distanceCovered = speed * simulatedTime

          // ===== CRITICAL: FINISH LINE LOGIC =====
          let progress = distanceCovered / distance
          let isFinished = false

          if (progress >= 1) {
            progress = 1 // CAP AT FINISH LINE
            distanceCovered = distance // STOP EXACTLY AT DISTANCE
            isFinished = true

            // Record finish time ONLY ONCE
            if (!finishedHorses.has(horse.id)) {
              finishTimes[horse.id] = simulatedTime
              finishedHorses.add(horse.id)
            }
          }
          // ======================================

          currentState.positions[horse.id] = {
            distance: distanceCovered,
            progress,
            finished: isFinished,
            time: isFinished ? (finishTimes[horse.id] ?? 0) : null,
            rank: 0, // Will be calculated below
          }

          // Add to rankings if finished
          if (isFinished && finishTimes[horse.id] !== undefined) {
            rankings.push({
              horseId: horse.id,
              name: horse.name,
              color: horse.color,
              time: finishTimes[horse.id] ?? 0,
              speed: speed ?? 0,
              position: 0,
            })
          }
        })

        // Sort rankings by finish time (earliest wins)
        rankings.sort((a, b) => a.time - b.time)
        rankings.forEach((r, idx) => {
          r.position = idx + 1
          const pos = currentState.positions[r.horseId]
          if (pos) {
            pos.rank = idx + 1
          }
        })

        // Calculate current rankings for unfinished horses
        round.horses.forEach((horse) => {
          const horsePos = currentState.positions[horse.id]
          if (horsePos && !horsePos.finished) {
            const currentRankings = round.horses
              .map(h => ({
                id: h.id,
                distance: currentState.positions[h.id]?.distance ?? 0,
              }))
              .sort((a, b) => b.distance - a.distance)

            const rank = currentRankings.findIndex(r => r.id === horse.id) + 1
            horsePos.rank = rank
          }
        })

        raceState.value = currentState
        onProgress(currentState)

        // Check if ALL horses finished
        const allFinished = round.horses.every(
          horse => currentState.positions[horse.id]?.finished ?? false,
        )

        if (allFinished) {
          // Build final complete rankings
          const finalRankings: HorseRanking[] = round.horses.map(horse => ({
            horseId: horse.id,
            name: horse.name,
            color: horse.color,
            time: finishTimes[horse.id] ?? 0,
            speed: horseSpeeds[horse.id] ?? 0,
            position: 0,
          }))

          finalRankings.sort((a, b) => a.time - b.time)
          finalRankings.forEach((r, idx) => {
            r.position = idx + 1
          })

          isAnimating.value = false
          onComplete(finalRankings)
          resolve()
        }
        else {
          requestAnimationFrame(animate)
        }
      }

      animate()
    })
  }

  return {
    raceState,
    isAnimating,
    simulateRace,
    calculateHorseSpeeds,
  }
}
