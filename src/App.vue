<script setup lang="ts">
import { onMounted } from 'vue'
import HorseList from '@/components/HorseList.vue'
import RaceControls from '@/components/RaceControls.vue'
import RaceResults from '@/components/RaceResults.vue'
import RaceSchedule from '@/components/RaceSchedule.vue'
import RaceTrack from '@/components/RaceTrack.vue'
import { useStore } from '@/store'

const store = useStore()

onMounted(() => {
  store.dispatch('racing/generateHorses')
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          🏇 Horse Racing Game
        </h1>
        <p class="text-gray-600">
          6 Rounds of Thrilling Competition
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <RaceTrack />
          <HorseList />
        </div>

        <div class="space-y-6">
          <RaceControls />
          <RaceSchedule />
          <RaceResults />
        </div>
      </div>
    </div>
  </div>
</template>
