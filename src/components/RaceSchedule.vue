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

function isCurrentRound(round: any) {
  return currentRound.value === round.roundNumber - 1 && isRacing.value
}

function isCompleted(round: any) {
  return raceResults.value.some((r: RaceResult) => r.roundNumber === round.roundNumber)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header (Blue) -->
    <div class="bg-blue-500 text-white px-4 py-3 font-bold text-center">
      Program
    </div>

    <!-- Content -->
    <div v-if="!isScheduleGenerated" class="p-6 text-center text-gray-500">
      Click "GENERATE PROGRAM" to create schedule
    </div>

    <div v-else class="p-3 space-y-2 max-h-[350px] overflow-y-auto">
      <div
        v-for="round in schedule"
        :key="round.roundNumber"
        class="border-2 rounded p-2 text-xs transition"
        :class="{
          'border-blue-500 bg-blue-50': isCurrentRound(round),
          'border-green-500 bg-green-50': isCompleted(round),
          'border-gray-300 bg-white': !isCurrentRound(round) && !isCompleted(round),
        }"
      >
        <div class="font-bold mb-1 flex justify-between items-center">
          <span>{{ round.roundNumber }}st Lap {{ round.distance }}m</span>
          <span v-if="isCompleted(round)" class="text-green-600">✓</span>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <div v-for="(horse, idx) in round.horses" :key="horse.id" class="flex gap-1">
            <span class="text-gray-500">{{ idx + 1 }}</span>
            <span class="truncate">{{ horse.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
