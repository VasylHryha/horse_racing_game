import type { Ref } from 'vue'
import type { Horse, HorsePosition, HorseRanking, RaceState, Round } from '@/types'
import { ref } from 'vue'
import { TIME_COMPRESSION } from '@/constants'
import { RankingCalculator } from '@/utils/rankingCalculator'

type RaceHorse = Horse & { effectiveSpeed: number }

function hasEffectiveSpeed(h: Horse): h is RaceHorse {
  return typeof (h as any).effectiveSpeed === 'number'
}

export interface UseRaceSimulation {
  raceState: Ref<RaceState | null>
  isAnimating: Ref<boolean>
  simulateRace: (
    round: Round, // expects horses with .effectiveSpeed set
    speedMultiplier: number,
    onProgress: (state: RaceState) => void,
    onComplete: (rankings: HorseRanking[]) => void,
    isPaused?: () => boolean,
    options?: { signal?: AbortSignal },
  ) => Promise<void>
  abort: () => void
  reset: () => void
}

export function useRaceSimulation(): UseRaceSimulation {
  const raceState = ref<RaceState | null>(null)
  const isAnimating = ref(false)

  let rafId: number | null = null
  let abortController: AbortController | null = null
  let resolvePromise: (() => void) | null = null

  const cancelRAF = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
  const abort = () => abortController?.abort()
  const reset = () => {
    cancelRAF()
    abortController?.abort()
    abortController = null
    isAnimating.value = false
    raceState.value = null
    resolvePromise = null
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const computeSimTime = (startMs: number, totalPausedMs: number, speedMul: number) => {
    const elapsedMs = performance.now() - startMs - totalPausedMs
    return Math.max(0, elapsedMs / 1000) * TIME_COMPRESSION * speedMul
  }

  const updatePositions = (
    horses: Horse[],
    simTime: number,
    distance: number,
    finishTimes: Map<number, number>,
    positions: Map<number, HorsePosition>,
  ) => {
    positions.clear()
    for (const horse of horses) {
      const eff = hasEffectiveSpeed(horse) ? horse.effectiveSpeed : 0
      let dist = eff * simTime
      let progress = dist / distance
      let finished = false

      if (progress >= 1) {
        progress = 1
        dist = distance
        finished = true
        if (!finishTimes.has(horse.id)) {
          finishTimes.set(horse.id, simTime)
        }
      }

      positions.set(horse.id, {
        distance: dist,
        progress,
        finished,
        time: finished ? finishTimes.get(horse.id)! : null,
        rank: 0,
      })
    }
  }

  const assignRanks = (finishTimes: Map<number, number>, positions: Map<number, HorsePosition>) => {
    // Finished by time asc
    const finishedIds: number[] = []
    for (const [id] of [...finishTimes.entries()].sort(([, a], [, b]) => a - b)) {
      finishedIds.push(id)
    }
    let rank = 1
    for (const id of finishedIds) {
      positions.get(id)!.rank = rank++
    }

    // Unfinished by distance desc
    const unfinishedIds: number[] = []
    for (const [id, p] of positions) {
      if (!p.finished)
        unfinishedIds.push(id)
    }
    unfinishedIds.sort((a, b) => {
      // sort by distance desc
      return positions.get(b)!.distance - positions.get(a)!.distance
    })
    for (const id of unfinishedIds) {
      positions.get(id)!.rank = rank++
    }
  }

  const emitState = (
    simTime: number,
    positions: Map<number, HorsePosition>,
    onProgress: (s: RaceState) => void,
  ) => {
    const state: RaceState = { elapsedTime: simTime, positions: Object.fromEntries(positions) }
    raceState.value = state
    onProgress(state)
  }

  const isComplete = (finishTimes: Map<number, number>, total: number) => finishTimes.size === total

  const buildFinalRankings = (positions: Record<number, HorsePosition>, horses: Horse[]) => {
    const list = RankingCalculator.calculateFinalRankings(positions, horses)
    const speedById = new Map<number, number>()
    for (const h of horses) {
      speedById.set(h.id, hasEffectiveSpeed(h) ? h.effectiveSpeed : 0)
    }
    for (const r of list) r.speed = speedById.get(r.horseId) ?? 0
    return list
  }

  // ── Main simulate ────────────────────────────────────────────────────────────
  const simulateRace: UseRaceSimulation['simulateRace'] = async (
    round,
    speedMultiplier,
    onProgress,
    onComplete,
    isPaused,
    options,
  ) => {
    reset()

    const distance = Math.max(1, round.distance)
    const speedMul = Math.max(0.0001, speedMultiplier)

    const finishTimes = new Map<number, number>()
    const positions = new Map<number, HorsePosition>()
    let totalPausedMs = 0
    let pauseStartMs = 0
    const startMs = performance.now()

    // Abort wiring
    abortController = new AbortController()
    const signal = abortController.signal
    const forwardAbort = () => abortController?.abort()
    if (options?.signal) {
      if (options.signal.aborted)
        abortController.abort()
      else options.signal.addEventListener('abort', forwardAbort)
    }

    isAnimating.value = true

    return new Promise<void>((resolve) => {
      resolvePromise = resolve

      const cleanup = () => {
        options?.signal?.removeEventListener?.('abort', forwardAbort)
        isAnimating.value = false
        cancelRAF()
        resolvePromise?.()
        resolvePromise = null
      }

      const tick = () => {
        if (signal.aborted)
          return cleanup()

        // Pause control
        if (isPaused?.()) {
          if (pauseStartMs === 0)
            pauseStartMs = performance.now()
          rafId = requestAnimationFrame(tick)
          return
        }
        if (pauseStartMs > 0) {
          totalPausedMs += performance.now() - pauseStartMs
          pauseStartMs = 0
        }

        const simTime = computeSimTime(startMs, totalPausedMs, speedMul)

        updatePositions(round.horses, simTime, distance, finishTimes, positions)
        assignRanks(finishTimes, positions)
        emitState(simTime, positions, onProgress)

        if (isComplete(finishTimes, round.horses.length)) {
          const finalRankings = buildFinalRankings(Object.fromEntries(positions), round.horses)
          onComplete(finalRankings)
          return cleanup()
        }

        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    })
  }

  return { raceState, isAnimating, simulateRace, abort, reset }
}
