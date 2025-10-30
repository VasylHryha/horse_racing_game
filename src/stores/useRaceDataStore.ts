/**
 * Race Data Store (Pinia)
 * Manages race domain data: horses, schedule, results
 */

import type { Horse, RaceResult, Round } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { TOTAL_ROUNDS } from '@/constants'
import { generateHorses } from '@/utils/horseGeneration'
import { generateSchedule } from '@/utils/raceSchedule'

export const useRaceDataStore = defineStore('raceData', () => {
  // State
  const horses = ref<Horse[]>([])
  const schedule = ref<Round[]>([])
  const currentRound = ref(0)
  const raceResults = ref<RaceResult[]>([])

  // Getters
  const currentRoundData = computed(() => {
    return schedule.value[currentRound.value]
  })

  const totalRounds = computed(() => {
    return schedule.value.length
  })

  const completedRounds = computed(() => {
    return new Set(raceResults.value.map(r => r.roundNumber))
  })

  const isGameComplete = computed(() => {
    return raceResults.value.length === TOTAL_ROUNDS
  })

  // Actions
  function generateNewHorses() {
    horses.value = generateHorses()
  }

  function generateNewSchedule() {
    if (horses.value.length === 0) {
      generateNewHorses()
    }

    schedule.value = generateSchedule(horses.value)
    currentRound.value = 0
    raceResults.value = []
  }

  function completeRound(result: RaceResult) {
    raceResults.value.push(result)
    if (currentRound.value < TOTAL_ROUNDS - 1) {
      currentRound.value++
    }
  }

  function resetGame() {
    schedule.value = []
    currentRound.value = 0
    raceResults.value = []
    generateNewHorses()
  }

  function resetData() {
    horses.value = []
    schedule.value = []
    currentRound.value = 0
    raceResults.value = []
  }

  return {
    // State
    horses,
    schedule,
    currentRound,
    raceResults,
    // Getters
    currentRoundData,
    totalRounds,
    completedRounds,
    isGameComplete,
    // Actions
    generateNewHorses,
    generateNewSchedule,
    completeRound,
    resetGame,
    resetData,
  }
})
