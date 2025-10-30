import type { Horse, Round } from '@/types'
import { HORSES_PER_RACE, ROUND_DISTANCES, TOTAL_ROUNDS } from '@/constants'

export function generateSchedule(availableHorses: Horse[]): Round[] {
  const schedule: Round[] = []

  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    // Shuffle and select random horses
    const shuffled = [...availableHorses].sort(() => Math.random() - 0.5)
    const selectedHorses = shuffled.slice(0, HORSES_PER_RACE)

    schedule.push({
      roundNumber: i + 1,
      distance: ROUND_DISTANCES[i] ?? 1000,
      horses: selectedHorses,
      results: null,
    })
  }

  return schedule
}

export function validateSchedule(schedule: Round[]): boolean {
  // Ensure each round has correct number of horses
  return schedule.every(
    round =>
      round.horses.length === HORSES_PER_RACE
      && round.distance > 0,
  )
}
