<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const raceResults = computed(() => store.state.racing.raceResults)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Header (Green) -->
    <div class="bg-green-500 text-white px-4 py-3 font-bold text-center">
      Results
    </div>

    <!-- Content -->
    <div v-if="raceResults.length === 0" class="p-6 text-center text-gray-500 text-sm">
      Results will appear after each race
    </div>

    <div v-else class="p-3 space-y-3 max-h-[350px] overflow-y-auto">
      <div
        v-for="result in raceResults"
        :key="result.roundNumber"
        class="border-2 border-green-400 rounded p-2"
      >
        <div class="bg-green-100 px-2 py-1 rounded mb-2 text-xs font-semibold">
          {{ result.roundNumber }}st Lap {{ result.distance }}m
        </div>

        <table class="w-full text-xs">
          <thead class="border-b">
            <tr>
              <th class="text-left p-1">
                Position
              </th>
              <th class="text-left p-1">
                Name
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(ranking, idx) in result.rankings"
              :key="ranking.horseId"
              class="border-b last:border-0"
              :class="{
                'bg-yellow-100 font-bold': idx === 0,
                'bg-gray-100': idx === 1,
                'bg-orange-100': idx === 2,
              }"
            >
              <td class="p-1">
                {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : ranking.position }}
              </td>
              <td class="p-1">
                {{ ranking.name }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
