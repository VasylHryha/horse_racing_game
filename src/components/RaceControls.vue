<script setup lang="ts">
import type { Horse, HorseRanking } from '@/store/modules/racing'
import { computed } from 'vue'
import { useStore } from '@/store'
import { TIME_COMPRESSION, TOTAL_ROUNDS } from '@/utils/constants'

const store = useStore()

const isScheduleGenerated = computed(() => store.state.racing.isScheduleGenerated)
const isRacing = computed(() => store.state.racing.isRacing)

function generateSchedule() {
  store.dispatch('racing/generateSchedule')
}

async function startRace() {
  store.commit('racing/SET_IS_RACING', true)
  store.commit('racing/SET_CURRENT_ROUND', 0)
  await runAllRounds()
}

async function runAllRounds() {
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    await runSingleRound(i)
    if (i < TOTAL_ROUNDS - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
  store.commit('racing/SET_IS_RACING', false)
}

async function runSingleRound(roundIndex: number) {
  const round = store.state.racing.schedule[roundIndex]
  if (!round)
    return
  const distance = round.distance

  // Calculate speed for each horse
  const horseSpeeds: Record<number, number> = {}
  round.horses.forEach((horse: Horse) => {
    const baseSpeed = 12 + Math.random() * 6 // 12-18 m/s
    horseSpeeds[horse.id] = baseSpeed * (horse.condition / 100)
  })

  const startTime = Date.now()
  const raceState = {
    elapsedTime: 0,
    positions: {} as Record<number, any>,
  }

  return new Promise<void>((resolve) => {
    const animate = () => {
      const realElapsed = (Date.now() - startTime) / 1000
      const simulatedTime = realElapsed * TIME_COMPRESSION

      raceState.elapsedTime = simulatedTime

      let allFinished = true
      const rankings: HorseRanking[] = []

      round.horses.forEach((horse: Horse) => {
        const speed = horseSpeeds[horse.id] ?? 0
        const distanceCovered = speed * simulatedTime
        const progress = Math.min(distanceCovered / distance, 1)

        raceState.positions[horse.id] = {
          distance: distanceCovered,
          progress,
          finished: progress >= 1,
          time: progress >= 1 && speed > 0 ? distanceCovered / speed : null,
        }

        if (progress < 1)
          allFinished = false

        if (progress >= 1 && speed > 0) {
          rankings.push({
            horseId: horse.id,
            name: horse.name,
            color: horse.color,
            time: distanceCovered / speed,
            speed,
            position: 0,
          })
        }
      })

      // Sort rankings by time
      rankings.sort((a, b) => a.time - b.time)
      rankings.forEach((r, idx) => {
        if (raceState.positions[r.horseId]) {
          raceState.positions[r.horseId].rank = idx + 1
          r.position = idx + 1
        }
      })

      // Calculate current rankings for unfinished horses
      round.horses.forEach((horse: Horse) => {
        if (!raceState.positions[horse.id].finished) {
          const currentRankings = round.horses
            .map(h => ({
              id: h.id,
              distance: raceState.positions[h.id].distance,
            }))
            .sort((a, b) => b.distance - a.distance)

          const rank = currentRankings.findIndex(r => r.id === horse.id) + 1
          raceState.positions[horse.id].rank = rank
        }
      })

      store.commit('racing/SET_CURRENT_RACE_STATE', { ...raceState })

      if (allFinished) {
        store.dispatch('racing/completeRound', {
          roundNumber: round.roundNumber,
          distance: round.distance,
          rankings,
        })

        resolve()
      }
      else {
        requestAnimationFrame(animate)
      }
    }

    animate()
  })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <h2 class="text-2xl font-bold text-gray-800">
      Race Controls
    </h2>

    <div class="space-y-3">
      <button
        :disabled="isRacing"
        class="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        @click="generateSchedule"
      >
        Generate Schedule
      </button>

      <button
        :disabled="!isScheduleGenerated || isRacing"
        class="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        @click="startRace"
      >
        {{ isRacing ? 'Racing...' : 'Start Race' }}
      </button>
    </div>

    <div v-if="isScheduleGenerated" class="text-sm text-gray-600 text-center">
      Schedule Generated! Ready to race.
    </div>
  </div>
</template>
