<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const horses = computed(() => store.state.racing.horses)
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">
      Available Horses
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      <div
        v-for="horse in horses"
        :key="horse.id"
        class="bg-gray-50 rounded-lg p-3 border-2 transition hover:shadow-md"
        :style="{ borderColor: horse.color }"
      >
        <div class="flex items-center gap-2 mb-2">
          <div
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: horse.color }"
          />
          <span class="font-semibold text-sm">{{ horse.name }}</span>
        </div>
        <div class="text-xs text-gray-600">
          <div>ID: {{ horse.id }}</div>
          <div>Condition: {{ horse.condition }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
