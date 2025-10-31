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
    <div class="max-w-[1600px] mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            data-testid="btn-home"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm"
            @click="emit('home')"
          >
            ← Home
          </button>

          <div class="h-8 w-px bg-white/30" />
          <h1 class="text-3xl font-bold text-white">
            {{ props.title ?? '🏇 Race Track' }}
          </h1>
          <span
            data-testid="race-status-badge"
            class="px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-md"
            :class="statusClass"
          >
            {{ status }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <button
            data-testid="race-ctrl"
            class="px-6 py-2.5 bg-white text-gray-800 border-2 border-white rounded-lg font-semibold hover:bg-gray-50 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
            :disabled="!canStart && !isRacing"
            @click="emit('startPause')"
          >
            <template v-if="!isRacing">
              ▶️ START RACE
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
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm"
            @click="emit('openHorses')"
          >
            🐴 Race Horses
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
