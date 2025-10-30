<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/ConfirmModal.vue'
import RaceResults from '@/components/RaceResults.vue'
import RaceSchedule from '@/components/RaceSchedule.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import SpeedControl from '@/components/SpeedControl.vue'
import { useRaceController } from '@/composables/useRaceController'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'

const router = useRouter()
const raceDataStore = useRaceDataStore()
const uiControlStore = useUIControlStore()
const raceAnimationStore = useRaceAnimationStore()
const { startRace, resetRace } = useRaceController()

const showConfirmHomeModal = ref(false)
const { isRacing, isPaused, raceStatus, statusColor } = storeToRefs(uiControlStore)

function handleGoHome() {
  if (isRacing.value || raceDataStore.results.length > 0) {
    showConfirmHomeModal.value = true
  }
  else {
    goHome()
  }
}

function goHome() {
  resetRace()
  raceDataStore.resetGame()
  uiControlStore.resetUI()
  raceAnimationStore.clearRaceState()
  showConfirmHomeModal.value = false
  router.push('/')
}

async function handleStartOrPause() {
  if (!isRacing.value) {
    await startRace()
  }
  else {
    uiControlStore.togglePause()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Race Header -->
    <div class="bg-gradient-to-r from-red-500 to-orange-500 border-b-4 border-red-600 shadow-lg">
      <div class="max-w-[1600px] mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition backdrop-blur-sm"
              @click="handleGoHome"
            >
              ← Home
            </button>
            <div class="h-8 w-px bg-white/30" />
            <h1 class="text-3xl font-bold text-white">
              🏇 Race Track
            </h1>
            <span
              class="px-4 py-1.5 rounded-full text-white text-sm font-bold shadow-md"
              :class="statusColor"
            >
              {{ raceStatus }}
            </span>
          </div>

          <div class="flex gap-3">
            <button
              class="px-6 py-2.5 bg-white text-gray-800 border-2 border-white rounded-lg font-semibold hover:bg-gray-50 transition shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              :disabled="!uiControlStore.isScheduleGenerated && !isRacing"
              @click="handleStartOrPause"
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
          </div>
        </div>
      </div>
    </div>

    <!-- Race Content -->
    <div class="max-w-[1600px] mx-auto p-4">
      <div class="grid grid-cols-12 gap-4">
        <!-- Main Race Track -->
        <div class="col-span-8">
          <RaceTrack />
        </div>

        <!-- Right Sidebar -->
        <div class="col-span-4 space-y-4">
          <SpeedControl />
          <RaceSchedule />
          <RaceResults />
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      v-if="showConfirmHomeModal"
      :show="showConfirmHomeModal"
      title="Return to Home?"
      message="Going back to home will stop the current race and clear all progress. Continue?"
      confirm-text="Go Home"
      cancel-text="Stay"
      confirm-class="bg-red-600 hover:bg-red-700"
      @confirm="goHome"
      @cancel="showConfirmHomeModal = false"
    />
  </div>
</template>
