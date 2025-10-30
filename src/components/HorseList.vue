<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'

const raceDataStore = useRaceDataStore()

const { horses, currentRoundData } = storeToRefs(raceDataStore)
const currentRoundHorses = computed(() => {
  return currentRoundData.value ? currentRoundData.value.horses.map(h => h.id) : []
})
</script>

<template>
  <div class="bg-yellow-100 rounded-lg shadow-md overflow-hidden h-full">
    <!-- Header -->
    <div class="bg-yellow-200 px-4 py-3 border-b-2 border-yellow-400">
      <h2 class="font-bold text-base">
        Horse List (1-20)
      </h2>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto max-h-[calc(100vh-200px)]">
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-yellow-200 border-b-2 border-yellow-400">
          <tr>
            <th class="text-left p-2 font-semibold">
              Name
            </th>
            <th class="text-center p-2 font-semibold">
              Condition
            </th>
            <th class="text-center p-2 font-semibold">
              Color
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="horse in horses"
            :key="horse.id"
            class="border-b border-yellow-200 hover:bg-yellow-50 transition"
            :class="{ 'bg-yellow-300 font-bold': currentRoundHorses.includes(horse.id) }"
          >
            <td class="p-2">
              {{ horse.name }}
            </td>
            <td class="p-2 text-center">
              {{ horse.condition }}
            </td>
            <td class="p-2 text-center">
              <div
                class="w-4 h-4 rounded-full mx-auto border border-gray-400"
                :style="{ backgroundColor: horse.color }"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
