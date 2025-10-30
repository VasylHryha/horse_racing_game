import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useUIControlStore } from '@/stores/useUIControlStore'

describe('useUIControlStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useUIControlStore()
      expect(store.isRacing).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.speedMultiplier).toBe(1)
      expect(store.isScheduleGenerated).toBe(false)
    })
  })

  describe('startRace', () => {
    it('should set isRacing to true', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.isRacing).toBe(true)
    })

    it('should set isPaused to false', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.isPaused).toBe(false)
    })
  })

  describe('stopRace', () => {
    it('should set isRacing to false', () => {
      const store = useUIControlStore()
      store.startRace()
      store.stopRace()
      expect(store.isRacing).toBe(false)
    })

    it('should set isPaused to false', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      store.stopRace()
      expect(store.isPaused).toBe(false)
    })
  })

  describe('pauseRace', () => {
    it('should set isPaused to true when racing', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      expect(store.isPaused).toBe(true)
      expect(store.isRacing).toBe(true)
    })
  })

  describe('resumeRace', () => {
    it('should set isPaused to false', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      store.resumeRace()
      expect(store.isPaused).toBe(false)
      expect(store.isRacing).toBe(true)
    })
  })

  describe('togglePause', () => {
    it('should toggle isPaused state', () => {
      const store = useUIControlStore()
      store.startRace()

      expect(store.isPaused).toBe(false)
      store.togglePause()
      expect(store.isPaused).toBe(true)
      store.togglePause()
      expect(store.isPaused).toBe(false)
    })

    it('should not affect isRacing state', () => {
      const store = useUIControlStore()
      store.startRace()
      store.togglePause()
      expect(store.isRacing).toBe(true)
    })
  })

  describe('updateSpeed', () => {
    it('should update speedMultiplier', () => {
      const store = useUIControlStore()
      store.updateSpeed(2)
      expect(store.speedMultiplier).toBe(2)
    })

    it('should handle different multipliers', () => {
      const store = useUIControlStore()
      store.updateSpeed(0.5)
      expect(store.speedMultiplier).toBe(0.5)
      store.updateSpeed(4)
      expect(store.speedMultiplier).toBe(4)
    })
  })

  describe('setScheduleGenerated', () => {
    it('should set isScheduleGenerated flag', () => {
      const store = useUIControlStore()
      expect(store.isScheduleGenerated).toBe(false)
      store.setScheduleGenerated(true)
      expect(store.isScheduleGenerated).toBe(true)
      store.setScheduleGenerated(false)
      expect(store.isScheduleGenerated).toBe(false)
    })
  })

  describe('resetUI', () => {
    it('should reset UI state to initial values', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      store.updateSpeed(2)
      store.setScheduleGenerated(true)

      store.resetUI()

      expect(store.isRacing).toBe(false)
      expect(store.isPaused).toBe(false)
      expect(store.speedMultiplier).toBe(1)
      expect(store.isScheduleGenerated).toBe(false)
    })
  })

  describe('raceStatus getter', () => {
    it('should return IDLE when not racing', () => {
      const store = useUIControlStore()
      expect(store.raceStatus).toBe('IDLE')
    })

    it('should return RACING when racing and not paused', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.raceStatus).toBe('RACING')
    })

    it('should return PAUSED when racing and paused', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      expect(store.raceStatus).toBe('PAUSED')
    })
  })

  describe('statusColor getter', () => {
    it('should return gray for IDLE', () => {
      const store = useUIControlStore()
      expect(store.statusColor).toBe('bg-gray-400')
    })

    it('should return green for RACING', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.statusColor).toBe('bg-green-500')
    })

    it('should return yellow for PAUSED', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      expect(store.statusColor).toBe('bg-yellow-500')
    })
  })

  describe('canStartRace getter', () => {
    it('should require schedule to be generated', () => {
      const store = useUIControlStore()
      expect(store.canStartRace).toBe(false)
      store.setScheduleGenerated(true)
      expect(store.canStartRace).toBe(true)
    })

    it('should prevent starting when already racing', () => {
      const store = useUIControlStore()
      store.setScheduleGenerated(true)
      store.startRace()
      expect(store.canStartRace).toBe(false)
    })
  })

  describe('canPauseRace getter', () => {
    it('should allow pause when racing', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.canPauseRace).toBe(true)
    })

    it('should prevent pause when not racing', () => {
      const store = useUIControlStore()
      expect(store.canPauseRace).toBe(false)
    })

    it('should prevent pause when already paused', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      expect(store.canPauseRace).toBe(false)
    })
  })

  describe('canResumeRace getter', () => {
    it('should allow resume when paused', () => {
      const store = useUIControlStore()
      store.startRace()
      store.pauseRace()
      expect(store.canResumeRace).toBe(true)
    })

    it('should prevent resume when not paused', () => {
      const store = useUIControlStore()
      store.startRace()
      expect(store.canResumeRace).toBe(false)
    })
  })

  describe('complex state transitions', () => {
    it('should handle full race cycle', () => {
      const store = useUIControlStore()

      // Start race
      store.startRace()
      expect(store.isRacing).toBe(true)
      expect(store.raceStatus).toBe('RACING')

      // Pause
      store.pauseRace()
      expect(store.isPaused).toBe(true)
      expect(store.raceStatus).toBe('PAUSED')

      // Resume
      store.resumeRace()
      expect(store.isPaused).toBe(false)
      expect(store.raceStatus).toBe('RACING')

      // Stop
      store.stopRace()
      expect(store.isRacing).toBe(false)
      expect(store.raceStatus).toBe('IDLE')
    })

    it('should maintain speed during pause/resume', () => {
      const store = useUIControlStore()
      store.updateSpeed(2)
      store.startRace()
      store.pauseRace()

      expect(store.speedMultiplier).toBe(2)

      store.resumeRace()
      expect(store.speedMultiplier).toBe(2)
    })
  })
})
