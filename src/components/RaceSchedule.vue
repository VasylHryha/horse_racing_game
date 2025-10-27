<script setup lang="ts">
import type { RaceResult } from '@/store/modules/racing'
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const schedule = computed(() => store.state.racing.schedule)
const isScheduleGenerated = computed(() => store.state.racing.isScheduleGenerated)
const currentRound = computed(() => store.state.racing.currentRound)
const isRacing = computed(() => store.state.racing.isRacing)
const raceResults = computed(() => store.state.racing.raceResults)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      Race Schedule
    </h2>

    <div v-if="!isScheduleGenerated" class="text-gray-500 text-center py-8">
      Click "Generate Schedule" to create the race schedule
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="round in schedule"
        :key="round.roundNumber"
        class="border-2 rounded-lg p-4 transition"
        :class="{
          'border-blue-500 bg-blue-50': currentRound === round.roundNumber - 1 && isRacing,
          'border-green-500 bg-green-50': raceResults.some((r: RaceResult) => r.roundNumber === round.roundNumber),
          'border-gray-300': currentRound !== round.roundNumber - 1 || !isRacing,
        }"
      >
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-bold text-lg">
            Round {{ round.roundNumber }}
          </h3>
          <span class="text-gray-600">{{ round.distance }}m</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="horse in round.horses"
            :key="horse.id"
            class="px-2 py-1 rounded text-xs font-semibold text-white"
            :style="{ backgroundColor: horse.color }"
          >
            {{ horse.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
