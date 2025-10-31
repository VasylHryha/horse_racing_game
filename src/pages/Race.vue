<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import HorseList from '@/components/HorseList.vue'
import RaceHeader from '@/components/layout/RaceHeader.vue'
import RaceSchedule from '@/components/race/ProgramPanel.vue'
import RaceTrack from '@/components/race/RaceTrack.vue'
import RaceResults from '@/components/race/ResultsPanel.vue'
import SpeedControl from '@/components/race/SpeedControl.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import SlideOver from '@/components/ui/SlideOver.vue'
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
const showHorsesPanel = ref(false)

const { isRacing, isPaused, raceStatus, statusColor } = storeToRefs(uiControlStore)
const { currentRaceHorses, horses, schedule } = storeToRefs(raceDataStore)

/**
 * Page readiness guard:
 * - we need base horses
 * - we need a schedule
 * - and we need the fixed race horses prepared
 */
const isRaceSetupReady = computed(() =>
  horses.value.length > 0
  && schedule.value.length > 0
  && currentRaceHorses.value.length > 0,
)

function handleGoHome() {
  if (isRacing.value || raceDataStore.raceResults.length > 0)
    showConfirmHomeModal.value = true
  else goHome()
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
  if (isRacing.value)
    uiControlStore.togglePause()
  else
    await startRace()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <RaceHeader
      :status="raceStatus"
      :status-class="statusColor"
      :can-start="uiControlStore.isScheduleGenerated"
      :is-racing="isRacing"
      :is-paused="isPaused"
      @home="handleGoHome"
      @start-pause="handleStartOrPause"
      @open-horses="showHorsesPanel = true"
    />

    <!-- Main race content -->
    <div v-if="isRaceSetupReady" class="max-w-[1600px] mx-auto p-4">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-8">
          <RaceTrack />
        </div>
        <div class="col-span-4 space-y-4">
          <SpeedControl />
          <RaceSchedule />
          <RaceResults />
        </div>
      </div>
    </div>

    <!-- Empty state if stores were cleared (e.g., page reload) -->
    <div v-else class="max-w-[900px] mx-auto p-6">
      <div class="bg-white border-2 border-amber-300 rounded-xl p-6 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="text-3xl">
            ⚠️
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800 mb-1">
              Race setup not ready
            </h2>
            <p class="text-gray-600">
              It looks like your race state was reset (e.g., after a page refresh).
              Please go Home to generate horses and create a new schedule.
            </p>
            <div class="mt-4">
              <button
                class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold shadow-sm"
                @click="goHome"
              >
                ← Go Home & Prepare Race
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Slide-over: Race Horses (left) -->
    <SlideOver v-model="showHorsesPanel" title="Race Horses" width-class="w-[420px]" test-id="horses-slideover">
      <HorseList :horses="currentRaceHorses" title="Race Horses" />
    </SlideOver>

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
