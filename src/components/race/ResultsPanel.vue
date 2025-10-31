<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { getOrdinalSuffix } from '@/utils/ordinal'

const raceDataStore = useRaceDataStore()
const { raceResults } = storeToRefs(raceDataStore)

const isOpen = ref(true)
const subtitle = computed(() => {
  const n = raceResults.value.length

  if (n) {
    return `${n} result${n === 1 ? '' : 's'}`
  }
  return 'Waiting…'
})
</script>

<template>
  <Accordion
    id="results"
    v-model="isOpen"
    icon="🏁"
    title="Results"
    :subtitle="subtitle"
    size="sm"
    data-testid="results-accordion"
  >
    <div v-if="raceResults.length === 0" class="p-6 text-center text-gray-500 text-sm" data-testid="results-empty">
      Results will appear after each race
    </div>

    <div v-else class="p-3 space-y-3 max-h-[350px] overflow-y-auto" data-testid="results-list">
      <div
        v-for="result in raceResults"
        :key="result.roundNumber"
        class="border-2 border-green-400 rounded p-2"
        data-testid="results-item"
      >
        <div class="bg-green-100 px-2 py-1 rounded mb-2 text-xs font-semibold">
          {{ getOrdinalSuffix(result.roundNumber) }} Lap {{ result.distance }}m
        </div>

        <table class="w-full text-xs" data-testid="results-table">
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
              data-testid="results-row"
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
  </Accordion>
</template>
