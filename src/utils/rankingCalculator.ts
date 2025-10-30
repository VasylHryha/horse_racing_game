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

  /**
   * Calculate partial rankings for unfinished horses (live race display)
   */
  static calculatePartialRankings(
    positions: Record<number, HorsePosition>,
    horses: Horse[],
  ): HorseRanking[] {
    const finishedHorses = horses
      .filter(h => positions[h.id]?.finished)
      .map(horse => ({
        horseId: horse.id,
        name: horse.name,
        color: horse.color,
        time: positions[horse.id]?.time ?? 0,
        speed: 0,
        position: positions[horse.id]?.rank ?? 0,
      }))

    // Sort by finish time
    finishedHorses.sort((a, b) => a.time - b.time)

    // Assign final positions
    finishedHorses.forEach((ranking, index) => {
      ranking.position = index + 1
    })

    return finishedHorses
  }

  /**
   * Calculate current race standings (for live display)
   */
  static calculateCurrentStandings(
    positions: Record<number, HorsePosition>,
    horses: Horse[],
  ): { finished: HorseRanking[], unfinished: HorseRanking[] } {
    const standings = {
      finished: [] as HorseRanking[],
      unfinished: [] as HorseRanking[],
    }

    horses.forEach((horse) => {
      const position = positions[horse.id]
      const ranking: HorseRanking = {
        horseId: horse.id,
        name: horse.name,
        color: horse.color,
        time: position?.time ?? 0,
        speed: 0,
        position: position?.rank ?? 0,
      }

      if (position?.finished) {
        standings.finished.push(ranking)
      }
      else {
        standings.unfinished.push(ranking)
      }
    })

    // Sort finished by time
    standings.finished.sort((a, b) => a.time - b.time)
    standings.finished.forEach((r, i) => {
      r.position = i + 1
    })

    return standings
  }
}
