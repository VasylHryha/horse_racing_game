/**
 * Domain types - Core business entities
 */

export interface Horse {
  id: number
  name: string
  color: string
  condition: number
  speed: number
  effectiveSpeed: number
}

export interface Round {
  roundNumber: number
  distance: number
  horses: Horse[]
  results: RaceResult | null
}

export interface HorseRanking {
  horseId: number
  name: string
  color: string
  time: number
  speed: number
  position: number
}

export interface RaceResult {
  roundNumber: number
  distance: number
  rankings: HorseRanking[]
}
