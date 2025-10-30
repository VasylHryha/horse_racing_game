import type { Ref } from 'vue'
import type { Horse, HorsePosition, HorseRanking, RaceState, Round } from '@/types'
import { ref } from 'vue'
import { TIME_COMPRESSION } from '@/constants'

type RaceHorse = Horse & { effectiveSpeed: number }

function hasEffectiveSpeed(h: Horse): h is RaceHorse {
  return typeof (h as any).effectiveSpeed === 'number'
}

export interface UseRaceSimulation {
  raceState: Ref<RaceState | null>
  isAnimating: Ref<boolean>
  simulateRace: (
    round: Round,
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
  }

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
    const speed = Math.max(0.0001, speedMultiplier)

    const finishTimes = new Map<number, number>()
    const positions = new Map<number, HorsePosition>()

    let totalPausedMs = 0
    let pauseStartMs = 0
    const startMs = performance.now()

    // Abort setup
    abortController = new AbortController()
    const signal = abortController.signal

    if (options?.signal?.aborted) {
      abortController.abort()
      return
    }

    const forwardAbort = () => abortController?.abort()
    options?.signal?.addEventListener('abort', forwardAbort)

    isAnimating.value = true

    return new Promise<void>((resolve) => {
      const tick = () => {
        if (signal.aborted) {
          options?.signal?.removeEventListener('abort', forwardAbort)
          return
        }

        // Handle pause
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

        // Calculate time
        const elapsedMs = performance.now() - startMs - totalPausedMs
        const simTime = Math.max(0, elapsedMs / 1000) * TIME_COMPRESSION * speed

        // Update positions
        positions.clear()
        for (const horse of round.horses) {
          const effectiveSpeed = hasEffectiveSpeed(horse) ? horse.effectiveSpeed : 0

          let dist = effectiveSpeed * simTime
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

        // Rank finished by time
        const finished = Array.from(finishTimes.entries())
          .sort(([, a], [, b]) => a - b)

        finished.forEach(([id], i) => {
          positions.get(id)!.rank = i + 1
        })

        // Rank unfinished by distance
        const unfinished = Array.from(positions.entries())
          .filter(([, p]) => !p.finished)
          .sort(([, a], [, b]) => b.distance - a.distance)

        unfinished.forEach(([id, p]) => {
          p.rank = finished.length + unfinished.indexOf([id, p]) + 1
        })

        // Emit state
        const state: RaceState = {
          elapsedTime: simTime,
          positions: Object.fromEntries(positions),
        }
        raceState.value = state
        onProgress(state)

        // Check complete
        if (finishTimes.size === round.horses.length) {
          const rankings: HorseRanking[] = round.horses.map(h => ({
            horseId: h.id,
            name: h.name,
            color: h.color,
            time: finishTimes.get(h.id) ?? Infinity,
            speed: hasEffectiveSpeed(h) ? h.effectiveSpeed : 0,
            position: 0,
          }))

          rankings.sort((a, b) => a.time - b.time)
          rankings.forEach((r, i) => r.position = i + 1)

          isAnimating.value = false
          cancelRAF()
          onComplete(rankings)
          options?.signal?.removeEventListener('abort', forwardAbort)
          resolve()
          return
        }

        rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
    })
  }

  return {
    raceState,
    isAnimating,
    simulateRace,
    abort,
    reset,
  }
}
