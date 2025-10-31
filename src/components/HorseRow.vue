<script setup lang="ts">
import type { Horse } from '@/types'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  horse: Horse
  highlight?: boolean
  trackChanges?: boolean
}>()

// Track last condition & delta locally per-row
const delta = ref(0)

watch(
  () => props.horse.condition,
  (now, prev) => {
    // Initial mount: prev is undefined — align and skip delta
    if (prev === undefined) {
      delta.value = 0
      return
    }
    delta.value = now - prev
  },
  { immediate: true },
)

const hasDelta = computed(() => props.trackChanges && delta.value !== 0)
const deltaClass = computed(() => (delta.value > 0 ? 'text-green-700' : 'text-red-700'))
const deltaText = computed(() => `${delta.value > 0 ? '+' : ''}${delta.value}`)
</script>

<template>
  <tr
    class="border-b border-yellow-200 hover:bg-yellow-50 transition"
    :class="[highlight ? 'bg-yellow-300 font-bold' : '']"
  >
    <td class="p-2">
      {{ horse.name }}
    </td>

    <td class="p-2 text-center">
      <div class="inline-flex items-center justify-center gap-1">
        <template v-if="trackChanges">
          <span
            class="tabular-nums font-semibold"
            aria-live="polite"
          >
            {{ horse.condition }}
          </span>

          <span
            v-if="hasDelta"
            class="text-[10px] font-semibold"
            :class="deltaClass"
          >
            {{ deltaText }}
          </span>
        </template>

        <template v-else>
          <span class="tabular-nums font-semibold">{{ horse.condition }}</span>
        </template>
      </div>
    </td>

    <td class="p-2 text-center">
      <div
        class="w-4 h-4 rounded-full mx-auto border border-gray-400"
        :style="{ backgroundColor: horse.color }"
      />
    </td>
  </tr>
</template>
