<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const raceResults = computed(() => store.state.racing.raceResults)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      Race Results
    </h2>

    <div v-if="raceResults.length === 0" class="text-gray-500 text-center py-8">
      Results will appear here after each race
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="result in raceResults"
        :key="result.roundNumber"
        class="border-2 border-gray-300 rounded-lg p-4"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-bold text-lg">
            Round {{ result.roundNumber }}
          </h3>
          <span class="text-gray-600">{{ result.distance }}m</span>
        </div>

        <div class="space-y-2">
          <div
            v-for="(ranking, idx) in result.rankings.slice(0, 3)"
            :key="ranking.horseId"
            class="flex items-center gap-3 p-2 rounded"
            :class="{
              'bg-yellow-100': idx === 0,
              'bg-gray-100': idx === 1,
              'bg-orange-100': idx === 2,
            }"
          >
            <div class="text-2xl">
              {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉' }}
            </div>
            <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: ranking.color }" />
            <div class="flex-1">
              <div class="font-semibold">
                {{ ranking.name }}
              </div>
              <div class="text-xs text-gray-600">
                Time: {{ ranking.time.toFixed(2) }}s | Speed: {{ ranking.speed.toFixed(2) }}m/s
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
