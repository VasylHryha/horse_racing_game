import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import ProgramPanel from '@/components/race/ProgramPanel.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'
import { useUIControlStore } from '@/stores/useUIControlStore'

describe('programPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows "Not generated" when schedule not generated', () => {
    // No schedule + isScheduleGenerated=false
    const wrapper = mount(ProgramPanel)
    expect(wrapper.text()).toContain('Not generated')
  })

  it('shows total laps in subtitle when generated', async () => {
    const data = useRaceDataStore()
    const ui = useUIControlStore()

    // Seed 3 rounds and set generated flag
    data.$patch({
      schedule: [
        { roundNumber: 1, distance: 1200, horses: [], results: null },
        { roundNumber: 2, distance: 1400, horses: [], results: null },
        { roundNumber: 3, distance: 1600, horses: [], results: null },
      ],
    })
    ui.setScheduleGenerated(true)

    const wrapper = mount(ProgramPanel)
    // Subtitle should contain "3 laps"
    expect(wrapper.text()).toContain('3 laps')
  })

  it('shows current round in subtitle when racing', async () => {
    const data = useRaceDataStore()
    const ui = useUIControlStore()

    // Seed two rounds and start racing at index 1 (round 2)
    data.$patch({
      schedule: [
        { roundNumber: 1, distance: 1200, horses: [], results: null },
        { roundNumber: 2, distance: 1400, horses: [], results: null },
      ],
      currentRound: 1, // zero-based index -> will display current: 2
    })
    ui.setScheduleGenerated(true)
    ui.startRace()

    const wrapper = mount(ProgramPanel)
    // Subtitle should include "• current: 2"
    expect(wrapper.text()).toContain('• current: 2')
  })
})
