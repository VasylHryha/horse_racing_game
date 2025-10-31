import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import SpeedControl from '@/components/race/SpeedControl.vue'
import { useUIControlStore } from '@/stores/useUIControlStore'

describe('speedControl.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('disables controls while racing', () => {
    const ui = useUIControlStore()
    // When racing, radio inputs are disabled
    ui.startRace()
    const wrapper = mount(SpeedControl)
    const input = wrapper.find('input#speed-NORMAL')
    expect(input.exists()).toBe(true)
    expect((input.element as HTMLInputElement).disabled).toBe(true)
  })

  it('updates speed when selecting a preset', async () => {
    const ui = useUIControlStore()
    // Before race, selecting a preset updates the store
    const wrapper = mount(SpeedControl)
    const input = wrapper.find('input#speed-FAST')
    expect(input.exists()).toBe(true)
    await input.trigger('change')
    expect(ui.speedMultiplier).toBe(2) // FAST preset multiplier
  })
})
