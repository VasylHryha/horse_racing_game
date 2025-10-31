<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { getOrdinalSuffix } from '@/utils/ordinal'
import HorseRunner from './HorseRunner.vue'

const raceDataStore = useRaceDataStore()
const raceAnimationStore = useRaceAnimationStore()

const { currentRoundData: currentRound } = storeToRefs(raceDataStore)
const { currentRaceState: raceState } = storeToRefs(raceAnimationStore)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Race Info Header -->
    <div class="bg-gray-100 px-4 py-3 border-b-2 border-gray-300 flex justify-between items-center">
      <div v-if="currentRound">
        <h3 class="font-bold text-lg">
          Round {{ currentRound.roundNumber }} - {{ currentRound.distance }}m
        </h3>
      </div>
      <div v-if="raceState" class="text-sm text-gray-600">
        Time: {{ raceState.elapsedTime.toFixed(1) }}s
      </div>
    </div>

    <!-- Race Track -->
    <div v-if="!currentRound" class="flex items-center justify-center h-96 text-gray-400 text-lg">
      Generate a schedule and start the race!
    </div>

    <div v-else class="relative bg-gradient-to-r from-green-100 to-green-200 border-4 border-amber-800 p-6">
      <!-- Distance markers (top) -->
      <div class="flex justify-between mb-3 text-xs text-gray-600 font-semibold px-12">
        <span>0m</span>
        <span v-for="marker in Math.floor(currentRound.distance / 200)" :key="marker">
          {{ marker * 200 }}m
        </span>
        <span>{{ currentRound.distance }}m</span>
      </div>

      <!-- Lanes container with left padding for lane numbers -->
      <div class="relative pl-12 pr-16">
        <!-- Horse lanes -->
        <HorseRunner
          v-for="(horse, index) in currentRound.horses"
          :key="horse.id"
          :horse="horse"
          :lane-number="index + 1"
          :position="raceState?.positions?.[horse.id]"
        />
      </div>

      <!-- FINISH LINE (right side) -->
      <div class="absolute right-0 top-0 bottom-0 w-14 bg-red-600 flex items-center justify-center">
        <div class="text-white font-bold text-sm transform -rotate-90 whitespace-nowrap">
          FINISH
        </div>
      </div>

      <!-- Bottom lap info -->
      <div class="mt-4 text-sm font-semibold text-gray-700">
        {{ getOrdinalSuffix(currentRound.roundNumber) }} Lap {{ currentRound.distance }}m
      </div>
    </div>
  </div>
</template>
