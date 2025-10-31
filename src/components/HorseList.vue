<script setup lang="ts">
import type { Horse } from '@/types'
import { computed, reactive, watch } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  horses: Horse[]
  highlightIds?: number[]
  trackChanges?: boolean // ← NEW
}>(), {
  title: 'Horse List',
  highlightIds: () => [],
  trackChanges: true,
})

const count = computed(() => props.horses.length)
const highlightSet = computed(() => new Set(props.highlightIds))

const prevCond: Record<number, number> = {}
const deltas = reactive<Record<number, number>>({})
const pulse = reactive<Record<number, boolean>>({})

watch(
  () => props.horses.map(h => ({ id: h.id, condition: h.condition })),
  (list) => {
    if (!props.trackChanges)
      return
    for (const { id, condition } of list) {
      const prev = prevCond[id]
      if (prev !== undefined && prev !== condition) {
        deltas[id] = condition - prev
        pulse[id] = true
        setTimeout(() => {
          pulse[id] = false
        }, 600)
      }
      prevCond[id] = condition
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="bg-yellow-100 rounded-lg shadow-md overflow-hidden h-full">
    <div class="bg-yellow-200 px-4 py-3 border-b-2 border-yellow-400 flex items-center justify-between">
      <h2 class="font-bold text-base">
        {{ title }}
      </h2>
      <span class="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-yellow-300 text-yellow-900 rounded-full border border-yellow-400">
        {{ count }}
      </span>
    </div>

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
            :class="[
              highlightSet.has(horse.id) ? 'bg-yellow-300 font-bold' : '',
              (trackChanges && pulse[horse.id]) ? 'cond-pulse' : '',
            ]"
          >
            <td class="p-2">
              {{ horse.name }}
            </td>

            <td class="p-2 text-center">
              <div class="inline-flex items-center justify-center gap-1">
                <template v-if="trackChanges">
                  <transition name="cond">
                    <span :key="horse.condition" class="tabular-nums font-semibold" aria-live="polite">
                      {{ horse.condition }}
                    </span>
                  </transition>
                  <span
                    v-if="deltas[horse.id] && deltas[horse.id] !== 0"
                    class="text-[10px] font-semibold"
                    :class="deltas[horse.id] > 0 ? 'text-green-700' : 'text-red-700'"
                  >
                    {{ deltas[horse.id] > 0 ? '+' : '' }}{{ deltas[horse.id] }}
                  </span>
                </template>
                <template v-else>
                  <span class="tabular-nums font-semibold">{{ horse.condition }}</span>
                </template>
              </div>
            </td>

            <td class="p-2 text-center">
              <div class="w-4 h-4 rounded-full mx-auto border border-gray-400" :style="{ backgroundColor: horse.color }" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.cond-enter-from,.cond-leave-to{opacity:0;transform:scale(0.92)}
.cond-enter-active,.cond-leave-active{transition:all 200ms ease;position:absolute}
.cond-enter-to,.cond-leave-from{opacity:1;transform:scale(1)}
@keyframes rowFlash{0%{background-color:rgba(250,204,21,.45)}100%{background-color:transparent}}
.cond-pulse{animation:rowFlash 600ms ease-out}
</style>
