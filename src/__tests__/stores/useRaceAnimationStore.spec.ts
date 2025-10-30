import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useRaceAnimationStore } from '@/stores/useRaceAnimationStore'

describe('useRaceAnimationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have null currentRaceState initially', () => {
      const store = useRaceAnimationStore()
      expect(store.currentRaceState).toBe(null)
    })
  })

  describe('updateRaceState', () => {
    it('should update currentRaceState', () => {
      const store = useRaceAnimationStore()
      const mockState = {
        elapsedTime: 10,
        positions: {
          1: {
            distance: 100,
            progress: 0.5,
            finished: false,
            time: null,
            rank: 1,
          },
        },
      }

      store.updateRaceState(mockState)
      expect(store.currentRaceState).toEqual(mockState)
    })

    it('should replace previous state', () => {
      const store = useRaceAnimationStore()
      const state1 = {
        elapsedTime: 5,
        positions: {},
      }
      const state2 = {
        elapsedTime: 10,
        positions: {},
      }

      store.updateRaceState(state1)
      expect(store.currentRaceState?.elapsedTime).toBe(5)

      store.updateRaceState(state2)
      expect(store.currentRaceState?.elapsedTime).toBe(10)
    })
  })

  describe('clearRaceState', () => {
    it('should set currentRaceState to null', () => {
      const store = useRaceAnimationStore()
      const mockState = {
        elapsedTime: 10,
        positions: {},
      }

      store.updateRaceState(mockState)
      expect(store.currentRaceState).not.toBe(null)

      store.clearRaceState()
      expect(store.currentRaceState).toBe(null)
    })
  })

  describe('racePositions getter', () => {
    it('should return positions from current race state', () => {
      const store = useRaceAnimationStore()
      const mockPositions = {
        1: {
          distance: 100,
          progress: 0.5,
          finished: false,
          time: null,
          rank: 1,
        },
        2: {
          distance: 150,
          progress: 0.75,
          finished: false,
          time: null,
          rank: 2,
        },
      }
      const mockState = {
        elapsedTime: 10,
        positions: mockPositions,
      }

      store.updateRaceState(mockState)
      expect(store.racePositions).toEqual(mockPositions)
    })

    it('should return empty object when no race state', () => {
      const store = useRaceAnimationStore()
      expect(store.racePositions).toEqual({})
    })
  })

  describe('elapsedTime getter', () => {
    it('should return elapsed time from current race state', () => {
      const store = useRaceAnimationStore()
      const mockState = {
        elapsedTime: 25.5,
        positions: {},
      }

      store.updateRaceState(mockState)
      expect(store.elapsedTime).toBe(25.5)
    })

    it('should return 0 when no race state', () => {
      const store = useRaceAnimationStore()
      expect(store.elapsedTime).toBe(0)
    })
  })

  describe('hasActiveRace getter', () => {
    it('should return true when race state exists', () => {
      const store = useRaceAnimationStore()
      const mockState = {
        elapsedTime: 10,
        positions: {},
      }

      store.updateRaceState(mockState)
      expect(store.hasActiveRace).toBe(true)
    })

    it('should return false when no race state', () => {
      const store = useRaceAnimationStore()
      expect(store.hasActiveRace).toBe(false)
    })

    it('should return false after clearing race state', () => {
      const store = useRaceAnimationStore()
      const mockState = {
        elapsedTime: 10,
        positions: {},
      }

      store.updateRaceState(mockState)
      expect(store.hasActiveRace).toBe(true)

      store.clearRaceState()
      expect(store.hasActiveRace).toBe(false)
    })
  })

  describe('state updates during race', () => {
    it('should handle multiple state updates', () => {
      const store = useRaceAnimationStore()

      const states = [
        { elapsedTime: 1, positions: {} },
        { elapsedTime: 2, positions: {} },
        { elapsedTime: 3, positions: {} },
      ]

      states.forEach((state) => {
        store.updateRaceState(state)
        expect(store.elapsedTime).toBe(state.elapsedTime)
      })
    })

    it('should properly update race positions', () => {
      const store = useRaceAnimationStore()

      const positions1 = {
        1: {
          distance: 50,
          progress: 0.25,
          finished: false,
          time: null,
          rank: 1,
        },
      }

      const positions2 = {
        1: {
          distance: 100,
          progress: 0.5,
          finished: false,
          time: null,
          rank: 1,
        },
      }

      store.updateRaceState({ elapsedTime: 1, positions: positions1 })
      expect(store.racePositions[1].distance).toBe(50)

      store.updateRaceState({ elapsedTime: 2, positions: positions2 })
      expect(store.racePositions[1].distance).toBe(100)
    })
  })
})
