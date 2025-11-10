<script setup lang="ts">
const props = defineProps<{
  title?: string
  status: string
  statusClass?: string
  canStart: boolean
  isRacing: boolean
  isPaused: boolean
}>()

const emit = defineEmits<{
  (e: 'home'): void
  (e: 'startPause'): void
  (e: 'openHorses'): void
}>()
</script>

<template>
  <div class="bg-gradient-to-r from-red-500 to-orange-500 border-b-4 border-red-600 shadow-lg">
    <div class="max-w-[1600px] mx-auto px-3 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            data-testid="btn-home"
            class="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm text-sm sm:text-base"
            @click="emit('home')"
          >
            <span class="hidden xs:inline">← Home</span>
            <span class="xs:hidden">←</span>
          </button>

          <div class="hidden sm:block h-8 w-px bg-white/30" />
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
            {{ props.title ?? '🏇 Race Track' }}
          </h1>
          <span
            data-testid="race-status-badge"
            class="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-md whitespace-nowrap"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            :class="[statusClass, props.status === 'PAUSED' ? 'text-black' : 'text-white']"
          >
            {{ status }}
          </span>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button
            data-testid="race-ctrl"
            class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-gray-800 border-2 border-white rounded-lg font-semibold hover:bg-gray-50 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            :disabled="!canStart && !isRacing"
            @click="emit('startPause')"
          >
            <template v-if="!isRacing">
              <span class="hidden sm:inline">▶️ START RACE</span>
              <span class="sm:hidden">▶️ START</span>
            </template>
            <template v-else-if="isPaused">
              ▶️ RESUME
            </template>
            <template v-else>
              ⏸️ PAUSE
            </template>
          </button>

          <button
            data-testid="open-horses"
            class="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm text-sm sm:text-base whitespace-nowrap"
            @click="emit('openHorses')"
          >
            <span class="hidden sm:inline">🐴 Race Horses</span>
            <span class="sm:hidden">🐴</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
