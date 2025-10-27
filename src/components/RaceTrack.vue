<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const currentRound = computed(() => store.getters['racing/currentRoundData'])
const raceState = computed(() => store.state.racing.currentRaceState)
</script>

<template>
  <div class="bg-gradient-to-b from-green-600 to-green-700 rounded-lg p-6 min-h-[500px]">
    <div v-if="!currentRound" class="flex items-center justify-center h-full text-white text-xl">
      Generate a schedule and start the race!
    </div>

    <div v-else class="space-y-4">
      <div class="bg-white/10 rounded-lg p-4 text-white">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-bold">
            Round {{ currentRound.roundNumber }} - {{ currentRound.distance }}m
          </h3>
          <div class="text-sm">
            <span v-if="raceState">Time: {{ raceState.elapsedTime.toFixed(1) }}s</span>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <div
          v-for="(horse) in currentRound.horses"
          :key="horse.id"
          class="bg-white/90 rounded-lg p-3 relative overflow-hidden"
        >
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full" :style="{ backgroundColor: horse.color }" />
              <span class="font-semibold">{{ horse.name }}</span>
              <span class="text-sm text-gray-600">(Condition: {{ horse.condition }})</span>
            </div>
            <div class="text-sm text-gray-600">
              <span v-if="raceState && raceState.positions?.[horse.id]">
                {{ Math.floor(raceState.positions[horse.id]!.distance) }}m
                <span class="ml-2 font-bold text-blue-600">
                  #{{ raceState.positions[horse.id]!.rank }}
                </span>
              </span>
            </div>
          </div>

          <div class="relative h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-100 flex items-center justify-end pr-2"
              :style="{
                width: raceState && raceState.positions?.[horse.id]
                  ? `${raceState.positions[horse.id]!.progress * 100}%`
                  : '0%',
              }"
            >
              <span class="text-2xl">🏇</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
