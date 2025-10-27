<script setup lang="ts">
import { onMounted } from 'vue'
import HorseList from '@/components/HorseList.vue'
import RaceResults from '@/components/RaceResults.vue'
import RaceSchedule from '@/components/RaceSchedule.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import { useStore } from '@/store'
import { useRaceSimulation } from '@/composables/useRaceSimulation'
import { TOTAL_ROUNDS } from '@/utils/constants'

const store = useStore()
const { simulateRace } = useRaceSimulation()

onMounted(() => {
  store.dispatch('racing/generateHorses')
})

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
      (state) => {
        store.commit('racing/SET_CURRENT_RACE_STATE', state)
      },
      (rankings) => {
        store.dispatch('racing/completeRound', {
          roundNumber: round.roundNumber,
          distance: round.distance,
          rankings,
        })
      },
    )

    if (i < TOTAL_ROUNDS - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }

  store.commit('racing/SET_IS_RACING', false)
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header Section (Pink/Salmon background) -->
    <div class="bg-red-100 border-b-4 border-red-200 px-6 py-4">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-800">
          Horse Racing
        </h1>
        <div class="flex gap-3">
          <button
            class="px-6 py-2 bg-white border-2 border-gray-400 rounded font-semibold hover:bg-gray-50 transition"
            @click="() => store.dispatch('racing/generateSchedule')"
          >
            GENERATE PROGRAM
          </button>
          <button
            class="px-6 py-2 bg-white border-2 border-gray-400 rounded font-semibold hover:bg-gray-50 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!store.state.racing.isScheduleGenerated || store.state.racing.isRacing"
            @click="handleStartRace"
          >
            {{ store.state.racing.isRacing ? 'Racing...' : 'START / PAUSE' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main 3-Column Layout -->
    <div class="max-w-[1600px] mx-auto p-4">
      <div class="grid grid-cols-12 gap-4">
        <!-- Left Column: Horse List (Yellow) -->
        <div class="col-span-2">
          <HorseList />
        </div>

        <!-- Center Column: Race Track (Green) -->
        <div class="col-span-7">
          <RaceTrack />
        </div>

        <!-- Right Column: Program + Results -->
        <div class="col-span-3 space-y-4">
          <RaceSchedule />
          <RaceResults />
        </div>
      </div>
    </div>
  </div>
</template>
