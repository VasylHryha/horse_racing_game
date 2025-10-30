<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { SPEED_PRESETS } from '@/constants'
import { useUIControlStore } from '@/stores/useUIControlStore'

type SpeedPreset = keyof typeof SPEED_PRESETS

const uiControlStore = useUIControlStore()
const isExpanded = ref(false)

const { speedMultiplier } = storeToRefs(uiControlStore)
const currentSpeed = computed(() => speedMultiplier.value)

const currentSpeedLabel = computed(() => {
  const preset = Object.entries(SPEED_PRESETS).find(
    ([, value]) => value.multiplier === currentSpeed.value,
  )
  return preset ? preset[1].label : 'Custom'
})

function setSpeed(preset: SpeedPreset) {
  const multiplier = SPEED_PRESETS[preset].multiplier
  uiControlStore.updateSpeed(multiplier)
}

function isActive(preset: SpeedPreset): boolean {
  return SPEED_PRESETS[preset].multiplier === currentSpeed.value
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <!-- Collapsed Header (Always Visible) -->
    <button
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      @click="isExpanded = !isExpanded"
    >
      <div class="flex items-center gap-2">
        <span class="text-lg">⚡</span>
        <span class="font-semibold text-gray-800">Speed</span>
        <span class="text-sm text-gray-600">({{ currentSpeedLabel }})</span>
      </div>
      <svg
        class="w-5 h-5 transition-transform" :class="[{ 'rotate-180': isExpanded }]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- Expanded Content -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isExpanded" class="border-t border-gray-200 p-4 space-y-2">
        <button
          v-for="[key, preset] in Object.entries(SPEED_PRESETS)"
          :key="key"
          class="w-full px-3 py-2 rounded text-sm font-semibold transition" :class="[
            isActive(key as SpeedPreset)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
          ]"
          @click="setSpeed(key as SpeedPreset)"
        >
          <span class="mr-2">{{ preset.icon }}</span>
          {{ preset.label }} ({{ preset.multiplier }}x)
        </button>
      </div>
    </transition>
  </div>
</template>
