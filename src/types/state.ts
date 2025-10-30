/**
 * State types - Store and component state structures
 */

export interface HorsePosition {
  distance: number
  progress: number
  finished: boolean
  time: number | null
  rank: number
}

export interface RaceState {
  elapsedTime: number
  positions: Record<number, HorsePosition>
}
