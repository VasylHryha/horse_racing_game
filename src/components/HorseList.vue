<script setup lang="ts">
import type { Horse } from '@/types'
import { computed } from 'vue'
import HorseRow from './HorseRow.vue'

const props = withDefaults(defineProps<{
  title?: string
  horses: Horse[]
  highlightIds?: number[]
  trackChanges?: boolean
}>(), {
  title: 'Horse List',
  highlightIds: () => [],
  trackChanges: true,
})

const count = computed(() => props.horses.length)
const highlightSet = computed(() => new Set(props.highlightIds))
</script>

<template>
  <div class="bg-yellow-100 rounded-lg shadow-md overflow-hidden h-full">
    <div class="bg-yellow-200 px-3 sm:px-4 py-2 sm:py-3 border-b-2 border-yellow-400 flex items-center justify-between">
      <h2 class="font-bold text-sm sm:text-base">
        {{ title }}
      </h2>
      <span class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-yellow-300 text-yellow-900 rounded-full border border-yellow-400">
        {{ count }}
      </span>
    </div>

    <div class="overflow-y-auto max-h-[calc(100vh-200px)] overflow-x-auto">
      <table class="w-full text-xs sm:text-sm">
        <thead class="sticky top-0 bg-yellow-200 border-b-2 border-yellow-400">
          <tr>
            <th class="text-left p-1.5 sm:p-2 font-semibold">
              Name
            </th>
            <th class="text-center p-1.5 sm:p-2 font-semibold">
              Condition
            </th>
            <th class="text-center p-1.5 sm:p-2 font-semibold">
              Color
            </th>
          </tr>
        </thead>

        <tbody>
          <HorseRow
            v-for="h in horses"
            :key="h.id"
            :horse="h"
            :highlight="highlightSet.has(h.id)"
            :track-changes="trackChanges"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
