<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmModal from '@/components/ConfirmModal.vue'
import HorseList from '@/components/HorseList.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'

const router = useRouter()
const raceDataStore = useRaceDataStore()
const uiControlStore = useUIControlStore()
const { horses } = storeToRefs(raceDataStore)

const showConfirmGenerateModal = ref(false)

onMounted(() => {
  raceDataStore.generateNewHorses()
})

function handleGenerateHorses() {
  if (horses.value.length > 0) {
    showConfirmGenerateModal.value = true
  }
  else {
    generateNewHorses()
  }
}

function generateNewHorses() {
  raceDataStore.generateNewHorses()
  showConfirmGenerateModal.value = false
}

function handleStartRacing() {
  raceDataStore.generateNewSchedule()
  uiControlStore.setScheduleGenerated(true)
  router.push('/race')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <div class="bg-white border-b-4 border-indigo-200 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-gray-800 mb-2">
            🏇 Horse Racing Simulator
          </h1>
          <p class="text-gray-600 text-lg">
            Manage your horses and start racing!
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-5xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Horse List Card -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-2xl font-bold text-gray-800">
                🐴 Your Stable
              </h2>
              <span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                {{ horses.length }} horses
              </span>
            </div>
            <HorseList />
          </div>
        </div>

        <!-- Actions Card -->
        <div class="space-y-6">
          <!-- Generate Horses -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-bold text-gray-800 mb-4">
              🎲 Horse Management
            </h3>
            <button
              class="w-full px-6 py-3 bg-purple-500 text-white border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-600 transition shadow-md"
              @click="handleGenerateHorses"
            >
              Generate New Horses
            </button>
            <p class="text-sm text-gray-500 mt-2">
              Create a fresh set of horses with random stats
            </p>
          </div>

          <!-- Start Racing -->
          <div class="bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg shadow-lg p-6 text-white">
            <h3 class="text-lg font-bold mb-4">
              🏁 Ready to Race?
            </h3>
            <button
              class="w-full px-6 py-4 bg-white text-green-600 border-2 border-white rounded-lg font-bold text-lg hover:bg-green-50 transition shadow-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              :disabled="horses.length === 0"
              @click="handleStartRacing"
            >
              Start Racing →
            </button>
            <p class="text-sm mt-3 opacity-90">
              Generate a race schedule and begin!
            </p>
          </div>

          <!-- Info Card -->
          <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h4 class="font-semibold text-blue-900 mb-2">
              ℹ️ How it works
            </h4>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Generate horses with unique stats</li>
              <li>• Each race uses random conditions</li>
              <li>• Watch multiple rounds sequentially</li>
              <li>• Track results and rankings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmModal
      v-if="showConfirmGenerateModal"
      :show="showConfirmGenerateModal"
      title="Generate New Horses?"
      message="This will replace all current horses. Any ongoing races will be lost. Continue?"
      confirm-text="Generate"
      cancel-text="Cancel"
      confirm-class="bg-purple-600 hover:bg-purple-700"
      @confirm="generateNewHorses"
      @cancel="showConfirmGenerateModal = false"
    />
  </div>
</template>
