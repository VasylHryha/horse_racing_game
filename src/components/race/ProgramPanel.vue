<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Accordion from '@/components/ui/Accordion.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'
import { getOrdinalSuffix } from '@/utils/ordinal'

const raceDataStore = useRaceDataStore()
const uiControlStore = useUIControlStore()

const { schedule, currentRound, raceResults } = storeToRefs(raceDataStore)
const { isScheduleGenerated, isRacing } = storeToRefs(uiControlStore)

const isOpen = ref(true)

function isCurrentRound(round: any) {
  return currentRound.value === round.roundNumber - 1 && isRacing.value
}

function isCompleted(round: any) {
  return raceResults.value.some(r => r.roundNumber === round.roundNumber)
}

const subtitle = computed(() => {
  if (!isScheduleGenerated.value)
    return 'Not generated'
  const total = schedule.value?.length ?? 0
  const cur = isRacing.value ? `• current: ${currentRound.value + 1}` : ''
  return `${total} laps ${cur}`
})
</script>

<template>
  <Accordion
    id="program"
    v-model="isOpen"
    icon="📋"
    title="Program"
    :subtitle="subtitle"
    size="sm"
  >
    <div v-if="!isScheduleGenerated" class="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
      Start a race from Home to generate the schedule
    </div>

    <div v-else class="p-2 sm:p-3 space-y-1.5 sm:space-y-2 max-h-[300px] sm:max-h-[350px] overflow-y-auto">
      <div
        v-for="round in schedule"
        :key="round.roundNumber"
        class="border-2 rounded p-1.5 sm:p-2 text-[10px] sm:text-xs transition"
        :class="{
          'border-blue-500 bg-blue-50': isCurrentRound(round),
          'border-green-500 bg-green-50': isCompleted(round),
          'border-gray-300 bg-white': !isCurrentRound(round) && !isCompleted(round),
        }"
      >
        <div class="font-bold mb-0.5 sm:mb-1 flex justify-between items-center">
          <span>{{ getOrdinalSuffix(round.roundNumber) }} Lap {{ round.distance }}m</span>
          <span v-if="isCompleted(round)" class="text-green-600">✓</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5">
          <div v-for="(horse, idx) in round.horses" :key="horse.id" class="flex gap-1">
            <span class="text-gray-500">{{ idx + 1 }}</span>
            <span class="truncate">{{ horse.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </Accordion>
</template>
