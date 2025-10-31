// stores/useRaceDataStore.ts
import type { Horse, RaceResult, Round } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { TOTAL_ROUNDS } from '@/constants'
import { generateHorses as generateHorsesUtil } from '@/utils/horseGeneration'
import { mutateRaceHorses } from '@/utils/horseRaceHelpers'
import { pickFixedParticipants } from '@/utils/raceParticipants'
import { generateSchedule as generateScheduleUtil } from '@/utils/raceSchedule'

export const useRaceDataStore = defineStore('raceData', () => {
  // Base horses (immutable across the card)
  const horses = ref<Horse[]>([])

  // Fixed field (10 horses) for the whole card
  const fixedParticipants = ref<Horse[]>([])

  // Current race horses (copied from fixedParticipants; mutated per round)
  const raceHorses = ref<Horse[]>([])

  const schedule = ref<Round[]>([])
  const currentRound = ref(0)
  const raceResults = ref<RaceResult[]>([])

  // Getters
  const currentRoundData = computed(() => schedule.value[currentRound.value])
  const totalRounds = computed(() => schedule.value.length)
  const completedRounds = computed(() => new Set(raceResults.value.map(r => r.roundNumber)))
  const isGameComplete = computed(() => raceResults.value.length === TOTAL_ROUNDS)

  const currentRaceHorses = computed(() => raceHorses.value)
  const currentRaceHorseIds = computed(() => raceHorses.value.map(h => h.id))

  // Actions
  function generateHorses() {
    horses.value = generateHorsesUtil()
    fixedParticipants.value = []
    raceHorses.value = []
  }

  function generateSchedule() {
    if (horses.value.length === 0)
      generateHorses()

    // Pick fixed 10 for the whole race card (seed optional)
    fixedParticipants.value = pickFixedParticipants(horses.value /* , seed */)

    // Build schedule for these participants
    schedule.value = generateScheduleUtil(fixedParticipants.value)

    currentRound.value = 0
    raceResults.value = []

    // Initialize raceHorses (will be re-rolled each round)
    raceHorses.value = fixedParticipants.value.map(h => ({ ...h }))
  }

  /** Re-roll condition & effectiveSpeed IN-PLACE for the current round */
  function rerollRaceHorsesForCurrentRound(seed?: number) {
    mutateRaceHorses(raceHorses.value, seed)
  }

  function completeRound(result: RaceResult) {
    raceResults.value.push(result)
    if (currentRound.value < TOTAL_ROUNDS - 1)
      currentRound.value++
  }

  function resetGame() {
    schedule.value = []
    currentRound.value = 0
    raceResults.value = []
    fixedParticipants.value = []
    raceHorses.value = []
    generateHorses()
  }

  function resetData() {
    horses.value = []
    fixedParticipants.value = []
    raceHorses.value = []
    schedule.value = []
    currentRound.value = 0
    raceResults.value = []
  }

  // No aliases needed; primary names are concise

  return {
    // State
    horses,
    fixedParticipants,
    raceHorses,
    schedule,
    currentRound,
    raceResults,
    // Getters
    currentRoundData,
    totalRounds,
    completedRounds,
    isGameComplete,
    currentRaceHorses,
    currentRaceHorseIds,
    // Actions
    generateHorses,
    generateSchedule,
    rerollRaceHorsesForCurrentRound,
    completeRound,
    resetGame,
    resetData,
  }
})
