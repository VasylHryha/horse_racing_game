<script setup lang="ts">
import { computed } from 'vue'
import { useRaceSimulation } from '@/composables/useRaceSimulation'
import { useStore } from '@/store'
import { TOTAL_ROUNDS } from '@/utils/constants'

const store = useStore()
const { simulateRace } = useRaceSimulation()

const isScheduleGenerated = computed(() => store.state.racing.isScheduleGenerated)
const isRacing = computed(() => store.state.racing.isRacing)

function handleGenerateSchedule() {
  store.dispatch('racing/generateSchedule')
}

async function handleStartRace() {
  store.commit('racing/SET_IS_RACING', true)
  store.commit('racing/SET_CURRENT_ROUND', 0)
  await runAllRounds()
}

async function runAllRounds() {
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const round = store.state.racing.schedule[i]
    if (!round)
      break

    await simulateRace(
      round,
      // onProgress callback
      (state) => {
        store.commit('racing/SET_CURRENT_RACE_STATE', state)
      },
      // onComplete callback
      (rankings) => {
        store.dispatch('racing/completeRound', {
          roundNumber: round.roundNumber,
          distance: round.distance,
          rankings,
        })
      },
    )

    // Delay between rounds
    if (i < TOTAL_ROUNDS - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  store.commit('racing/SET_IS_RACING', false)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <h2 class="text-2xl font-bold text-gray-800">
      Race Controls
    </h2>

    <div class="space-y-3">
      <button
        :disabled="isRacing"
        class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        @click="handleGenerateSchedule"
      >
        Generate Schedule
      </button>

      <button
        :disabled="!isScheduleGenerated || isRacing"
        class="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        @click="handleStartRace"
      >
        {{ isRacing ? 'Racing...' : 'Start Race' }}
      </button>
    </div>

    <div v-if="isScheduleGenerated" class="text-sm text-gray-600 text-center">
      Schedule Generated! Ready to race.
    </div>
  </div>
</template>
