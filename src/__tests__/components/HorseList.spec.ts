import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HorseList from '@/components/HorseList.vue'

const baseHorses = [
  { id: 1, name: 'A', color: '#000', condition: 80, speed: 10, effectiveSpeed: 10 },
  { id: 2, name: 'B', color: '#111', condition: 70, speed: 10, effectiveSpeed: 10 },
]

describe('horseList.vue', () => {
  it('renders the list and count', () => {
    // Mount with two simple horses and trackChanges off (no deltas)
    const wrapper = mount(HorseList, {
      props: { horses: baseHorses, title: 'Horses', trackChanges: false },
    })
    // Title and count badge should be present
    expect(wrapper.text()).toContain('Horses')
    expect(wrapper.text()).toContain('2')
    // Two rows in the table body
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('shows delta when condition changes (trackChanges)', async () => {
    vi.useFakeTimers()
    // Mount with trackChanges enabled to observe delta badges
    const wrapper = mount(HorseList, {
      props: { horses: baseHorses, title: 'Horses', trackChanges: true },
    })

    // Update a horse condition to trigger +delta
    const updated = [
      { ...baseHorses[0], condition: 85 }, // +5
      baseHorses[1],
    ]
    await wrapper.setProps({ horses: updated })

    // Delta badge appears with +5
    expect(wrapper.text()).toContain('+5')

    // Advance timers to clear the row pulse animation
    vi.runAllTimers()
    vi.useRealTimers()
  })
})
