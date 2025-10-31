<script setup lang="ts">
import type { Horse, HorsePosition } from '@/types'
import { computed } from 'vue'

interface Props {
  horse: Horse
  laneNumber: number
  position?: HorsePosition
}

const props = defineProps<Props>()

const progress = computed(() => props.position?.progress ?? 0)
const isFinished = computed(() => props.position?.finished ?? false)
const rank = computed(() => props.position?.rank ?? 0)

const medalEmoji = computed(() => {
  if (!isFinished.value)
    return ''
  if (rank.value === 1)
    return '🥇'
  if (rank.value === 2)
    return '🥈'
  if (rank.value === 3)
    return '🥉'
  return '🏁'
})
</script>

<template>
  <div class="relative h-12 border-b-2 border-dashed border-amber-600 bg-green-50">
    <!-- Lane number (left side) -->
    <div class="absolute -left-10 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
      {{ laneNumber }}
    </div>

    <!-- Horse animated position -->
    <div
      class="absolute top-1/2 -translate-y-1/2 transition-all duration-100 ease-linear"
      :style="{ left: `${progress * 100}%` }"
    >
      <div class="relative">
        <!-- Horse emoji (flipped to face finish line on the right) -->
        <span class="text-2xl inline-block" style="transform: scaleX(-1);">🏇</span>

        <!-- Horse color indicator -->
        <div
          class="w-3 h-3 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 border-2 border-white"
          :style="{ backgroundColor: horse.color }"
        />

        <!-- Medal/Trophy for finished horses -->
        <span
          v-if="isFinished && medalEmoji"
          class="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl animate-bounce"
        >
          {{ medalEmoji }}
        </span>
      </div>
    </div>

    <!-- Rank badge (right side) -->
    <div
      v-if="rank > 0"
      class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs font-bold transition-colors"
      :class="{
        'bg-yellow-400 text-yellow-900': rank === 1,
        'bg-gray-300 text-gray-900': rank === 2,
        'bg-orange-400 text-orange-900': rank === 3,
        'bg-blue-500 text-white': rank > 3,
      }"
    >
      #{{ rank }}
    </div>

    <!-- Horse name tooltip on hover -->
    <div class="absolute left-0 top-0 opacity-0 hover:opacity-100 transition-opacity bg-black/75 text-white text-xs px-2 py-1 rounded pointer-events-none">
      {{ horse.name }} ({{ horse.condition }})
    </div>
  </div>
</template>
