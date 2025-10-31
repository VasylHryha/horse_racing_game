import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import ResultsPanel from '@/components/race/ResultsPanel.vue'
import { useRaceDataStore } from '@/stores/useRaceDataStore'

describe('resultsPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows empty state when no results', () => {
    const wrapper = mount(ResultsPanel)
    expect(wrapper.text()).toContain('Results will appear after each race')
  })

  it('renders results when present', () => {
    const data = useRaceDataStore()
    data.$patch({
      raceResults: [
        {
          roundNumber: 1,
          distance: 1200,
          rankings: [
            { horseId: 1, name: 'A', color: '#000', time: 10.1, speed: 12, position: 1 },
            { horseId: 2, name: 'B', color: '#111', time: 10.2, speed: 12, position: 2 },
          ],
        },
      ],
    })

    const wrapper = mount(ResultsPanel)
    expect(wrapper.text()).toContain('1st Lap 1200m')
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
  })
})
