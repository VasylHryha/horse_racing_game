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
    <div class="bg-gray-100 px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-gray-300 flex justify-between items-center">
      <div v-if="currentRound">
        <h3 class="font-bold text-sm sm:text-base md:text-lg">
          Round {{ currentRound.roundNumber }} - {{ currentRound.distance }}m
        </h3>
      </div>
      <div v-if="raceState" class="text-xs sm:text-sm text-gray-600">
        Time: {{ raceState.elapsedTime.toFixed(1) }}s
      </div>
    </div>

    <!-- Race Track -->
    <div v-if="!currentRound" class="flex items-center justify-center h-48 sm:h-64 md:h-96 text-gray-400 text-sm sm:text-base md:text-lg px-4 text-center">
      Generate a schedule and start the race!
    </div>

    <div v-else class="relative bg-gradient-to-r from-green-100 to-green-200 border-2 sm:border-4 border-amber-800 overflow-x-auto md:overflow-x-visible" data-testid="race-track">
      <div class="relative p-3 sm:p-4 md:p-6 min-w-[520px] md:min-w-0">
        <!-- Mobile scroll hint -->
        <div class="md:hidden absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 bg-white/80 px-2 py-0.5 rounded pointer-events-none z-10">
          ← Swipe →
        </div>

        <!-- Distance markers (top) -->
        <div class="flex justify-between mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-600 font-semibold px-8 sm:px-12 pr-8 sm:pr-16">
          <span>0m</span>
          <span v-for="marker in Math.floor(currentRound.distance / 200)" :key="marker" class="hidden sm:inline">
            {{ marker * 200 }}m
          </span>
          <span>{{ currentRound.distance }}m</span>
        </div>

        <!-- Lanes container with left padding for lane numbers and right margin for finish line -->
        <div class="relative pl-8 sm:pl-12 pr-8 sm:pr-16">
          <!-- Horse lanes -->
          <HorseRunner
            v-for="(horse, index) in currentRound.horses"
            :key="horse.id"
            :horse="horse"
            :lane-number="index + 1"
            :position="raceState?.positions?.[horse.id]"
          />
        </div>

        <!-- FINISH LINE (right side with margin) -->
        <div class="absolute right-0 md:right-0 top-0 bottom-0 w-5 sm:w-14 bg-red-600 flex items-center justify-center">
          <div class="text-white font-bold text-[10px] sm:text-sm transform -rotate-90 whitespace-nowrap">
            FINISH
          </div>
        </div>

        <!-- Bottom lap info -->
        <div class="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-gray-700">
          {{ getOrdinalSuffix(currentRound.roundNumber) }} Lap {{ currentRound.distance }}m
        </div>
      </div>
    </div>
  </div>
</template>
