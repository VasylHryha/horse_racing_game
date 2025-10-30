/**
 * Race Animation Store (Pinia)
 * Manages live race animation state
 */

import type { RaceState } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useRaceAnimationStore = defineStore('raceAnimation', () => {
  // State
  const currentRaceState = ref<RaceState | null>(null)

  // Getters
  const racePositions = computed(() => {
    return currentRaceState.value?.positions ?? {}
  })

  const elapsedTime = computed(() => {
    return currentRaceState.value?.elapsedTime ?? 0
  })

  const hasActiveRace = computed(() => {
    return currentRaceState.value !== null
  })

  // Actions
  function updateRaceState(state: RaceState) {
    currentRaceState.value = state
  }

  function clearRaceState() {
    currentRaceState.value = null
  }

  return {
    // State
    currentRaceState,
    // Getters
    racePositions,
    elapsedTime,
    hasActiveRace,
    // Actions
    updateRaceState,
    clearRaceState,
  }
})
