/**
 * UI Control Store (Pinia)
 * Manages UI state: racing, paused, speed, schedule generated
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUIControlStore = defineStore('uiControl', () => {
  // State
  const isRacing = ref(false)
  const isPaused = ref(false)
  const speedMultiplier = ref(1)
  const isScheduleGenerated = ref(false)

  // Getters
  const raceStatus = computed(() => {
    if (isRacing.value && isPaused.value)
      return 'PAUSED'
    if (isRacing.value)
      return 'RACING'
    return 'IDLE'
  })

  const statusColor = computed(() => {
    switch (raceStatus.value) {
      case 'RACING':
        return 'bg-green-500'
      case 'PAUSED':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-400'
    }
  })

  const canStartRace = computed(() => {
    return isScheduleGenerated.value && !isRacing.value
  })

  const canPauseRace = computed(() => {
    return isRacing.value && !isPaused.value
  })

  const canResumeRace = computed(() => {
    return isRacing.value && isPaused.value
  })

  // Actions
  function startRace() {
    isRacing.value = true
    isPaused.value = false
  }

  function stopRace() {
    isRacing.value = false
    isPaused.value = false
  }

  function pauseRace() {
    if (isRacing.value) {
      isPaused.value = true
    }
  }

  function resumeRace() {
    if (isRacing.value) {
      isPaused.value = false
    }
  }

  function togglePause() {
    if (isRacing.value) {
      isPaused.value = !isPaused.value
    }
  }

  function updateSpeed(multiplier: number) {
    speedMultiplier.value = multiplier
  }

  function setScheduleGenerated(value: boolean) {
    isScheduleGenerated.value = value
  }

  function resetUI() {
    isRacing.value = false
    isPaused.value = false
    speedMultiplier.value = 1
    isScheduleGenerated.value = false
  }

  return {
    // State
    isRacing,
    isPaused,
    speedMultiplier,
    isScheduleGenerated,
    // Getters
    raceStatus,
    statusColor,
    canStartRace,
    canPauseRace,
    canResumeRace,
    // Actions
    startRace,
    stopRace,
    pauseRace,
    resumeRace,
    togglePause,
    updateSpeed,
    setScheduleGenerated,
    resetUI,
  }
})
