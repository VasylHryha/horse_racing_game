import type { HorsePosition } from '@/types'
import { describe, expect, it } from 'vitest'
import { RankingCalculator } from '@/utils/rankingCalculator'

describe('rankingCalculator.calculateFinalRankings', () => {
  it('orders by ascending finish time and assigns positions', () => {
    // Prepare three horses and positions with different finish times
    const horses = [
      { id: 1, name: 'A', color: '#000', condition: 80, speed: 10, effectiveSpeed: 10 },
      { id: 2, name: 'B', color: '#111', condition: 80, speed: 10, effectiveSpeed: 10 },
      { id: 3, name: 'C', color: '#222', condition: 80, speed: 10, effectiveSpeed: 10 },
    ]

    const positions: Record<number, HorsePosition> = {
      1: { distance: 1000, progress: 1, finished: true, time: 12.3, rank: 1 },
      2: { distance: 1000, progress: 1, finished: true, time: 11.9, rank: 1 },
      3: { distance: 1000, progress: 1, finished: true, time: 12.0, rank: 1 },
    }

    // Rankings should be sorted by time and have positions 1..n
    const rankings = RankingCalculator.calculateFinalRankings(positions, horses)

    expect(rankings.map(r => r.horseId)).toEqual([2, 3, 1])
    expect(rankings.map(r => r.position)).toEqual([1, 2, 3])
    expect(rankings.map(r => r.time)).toEqual([11.9, 12.0, 12.3])
  })
})
