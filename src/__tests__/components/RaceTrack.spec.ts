import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import RaceTrack from '@/components/race/RaceTrack.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'

describe('raceTrack.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows placeholder when no current round', () => {
    // With no schedule seeded, component should show guidance text
    const wrapper = mount(RaceTrack)
    expect(wrapper.text()).toContain('Generate a schedule and start the race!')
  })

  it('renders current round header when present', async () => {
    const data = useRaceDataStore()
    // Seed a single round as current
    data.$patch({
      schedule: [{ roundNumber: 1, distance: 1200, horses: [], results: null }],
      currentRound: 0,
    })

    const wrapper = mount(RaceTrack)
    // Header should reflect current round number and distance
    expect(wrapper.text()).toContain('Round 1 - 1200m')
  })
})
