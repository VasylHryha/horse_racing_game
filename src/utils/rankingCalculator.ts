/**
 * Ranking Calculator Utility
 * Extracts ranking calculation logic for race results
 */

import type { Horse, HorsePosition, HorseRanking } from '@/types'

export class RankingCalculator {
  /**
   * Calculate final rankings from race positions
   */
  static calculateFinalRankings(
    positions: Record<number, HorsePosition>,
    horses: Horse[],
  ): HorseRanking[] {
    const rankings: HorseRanking[] = horses.map(horse => ({
      horseId: horse.id,
      name: horse.name,
      color: horse.color,
      time: positions[horse.id]?.time ?? 0,
      speed: 0, // Will be populated by caller if needed
      position: 0,
    }))

    // Sort by finish time
    rankings.sort((a, b) => a.time - b.time)

    // Assign positions
    rankings.forEach((ranking, index) => {
      ranking.position = index + 1
    })

    return rankings
  }
}
