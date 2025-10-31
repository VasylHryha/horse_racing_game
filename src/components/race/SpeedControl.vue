<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Accordion from '@/components/ui/Accordion.vue'
import { SPEED_PRESETS } from '@/constants'
import { useUIControlStore } from '@/stores/useUIControlStore'

type SpeedPreset = keyof typeof SPEED_PRESETS
interface PresetShape { label: string, multiplier: number, icon?: string }

const ui = useUIControlStore()
const { speedMultiplier, isRacing } = storeToRefs(ui)

const PRESET_ENTRIES = Object.entries(SPEED_PRESETS) as [SpeedPreset, PresetShape][]
const isExpanded = ref(false)

const currentSpeed = computed(() => speedMultiplier.value)
const currentSpeedLabel = computed(() => {
  const hit = PRESET_ENTRIES.find(([, v]) => v.multiplier === currentSpeed.value)
  return hit ? hit[1].label : 'Custom'
})

const disabled = computed(() => isRacing.value) // ✅ only before race start

function setSpeed(preset: SpeedPreset) {
  if (disabled.value)
    return
  ui.updateSpeed(SPEED_PRESETS[preset].multiplier)
}
function isActive(preset: SpeedPreset) {
  return SPEED_PRESETS[preset].multiplier === currentSpeed.value
}
</script>

<template>
  <Accordion
    id="speed"
    v-model="isExpanded"
    icon="⚡"
    title="Speed"
    :subtitle="currentSpeedLabel"
    size="sm"
  >
    <fieldset class="grid grid-cols-1 gap-2 sm:grid-cols-2" :aria-disabled="disabled">
      <legend class="sr-only">
        Playback speed
      </legend>

      <template v-for="[key, preset] in PRESET_ENTRIES" :key="key">
        <input
          :id="`speed-${key}`"
          class="sr-only"
          type="radio"
          name="speed"
          :value="preset.multiplier"
          :checked="isActive(key)"
          :disabled="disabled"
          @change="setSpeed(key)"
        >
        <label
          :for="`speed-${key}`"
          class="w-full cursor-pointer px-3 py-2 rounded text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          :class="[
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isActive(key)
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          ]"
          :aria-disabled="disabled"
        >
          <span v-if="preset.icon" class="mr-2" aria-hidden="true">{{ preset.icon }}</span>
          <span>{{ preset.label }}</span>
          <span class="ml-1 text-xs opacity-80">({{ preset.multiplier }}×)</span>
        </label>
      </template>
    </fieldset>
  </Accordion>
</template>
