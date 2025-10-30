import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useRaceDataStore } from '@/stores/useRaceDataStore'

describe('useRaceDataStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useRaceDataStore()
      expect(store.horses).toEqual([])
      expect(store.schedule).toEqual([])
      expect(store.currentRound).toBe(0)
      expect(store.raceResults).toEqual([])
    })
  })

  describe('generateHorses', () => {
    it('should generate 20 horses', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      expect(store.horses).toHaveLength(20)
    })

    it('should generate horses with required properties', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.horses.forEach((horse) => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('condition')
        expect(horse.condition).toBeGreaterThan(0)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })

    it('should generate horses with unique IDs', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      const ids = store.horses.map(h => h.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(20)
    })
  })

  describe('generateSchedule', () => {
    it('should generate 6 rounds', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()
      expect(store.schedule).toHaveLength(6)
    })

    it('should create rounds with correct properties', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()
      store.schedule.forEach((round) => {
        expect(round).toHaveProperty('roundNumber')
        expect(round).toHaveProperty('distance')
        expect(round).toHaveProperty('horses')
        expect(round.horses).toHaveLength(10) // 10 horses per race
      })
    })

    it('should reset currentRound on schedule generation', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()
      expect(store.currentRound).toBe(0)
    })

    it('should clear previous race results on schedule generation', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()
      const mockResult = {
        roundNumber: 1,
        distance: 1200,
        rankings: [],
      }
      store.completeRound(mockResult)
      expect(store.raceResults).toHaveLength(1)

      // Generate new schedule
      store.generateSchedule()
      expect(store.raceResults).toHaveLength(0)
    })
  })

  describe('completeRound', () => {
    it('should add race result', () => {
      const store = useRaceDataStore()
      const mockResult = {
        roundNumber: 1,
        distance: 1200,
        rankings: [],
      }
      store.completeRound(mockResult)
      expect(store.raceResults).toHaveLength(1)
      expect(store.raceResults[0]).toEqual(mockResult)
    })

    it('should increment currentRound', () => {
      const store = useRaceDataStore()
      const mockResult = {
        roundNumber: 1,
        distance: 1200,
        rankings: [],
      }
      expect(store.currentRound).toBe(0)
      store.completeRound(mockResult)
      expect(store.currentRound).toBe(1)
    })
  })

  describe('resetGame', () => {
    it('should reset schedule and results but regenerate horses', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()
      const mockResult = {
        roundNumber: 1,
        distance: 1200,
        rankings: [],
      }
      store.completeRound(mockResult)

      store.resetGame()

      // Horses should be regenerated (may be different)
      expect(store.horses).toHaveLength(20)
      expect(store.schedule).toEqual([])
      expect(store.raceResults).toEqual([])
      expect(store.currentRound).toBe(0)
    })
  })

  describe('resetData', () => {
    it('should clear all data', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      store.resetData()

      expect(store.horses).toEqual([])
      expect(store.schedule).toEqual([])
      expect(store.raceResults).toEqual([])
      expect(store.currentRound).toBe(0)
    })
  })

  describe('currentRoundData getter', () => {
    it('should return current round data', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      const currentRound = store.currentRoundData
      expect(currentRound).toBeDefined()
      expect(currentRound?.roundNumber).toBe(1)
    })

    it('should return undefined when no schedule', () => {
      const store = useRaceDataStore()
      const currentRound = store.currentRoundData
      expect(currentRound).toBeUndefined()
    })
  })

  describe('totalRounds getter', () => {
    it('should return total number of rounds', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      expect(store.totalRounds).toBe(6)
    })
  })

  describe('completedRounds getter', () => {
    it('should return set of completed round numbers', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      expect(store.completedRounds.size).toBe(0)

      const mockResult = {
        roundNumber: 1,
        distance: 1200,
        rankings: [],
      }
      store.completeRound(mockResult)

      expect(store.completedRounds.size).toBe(1)
      expect(store.completedRounds.has(1)).toBe(true)
    })
  })

  describe('isGameComplete getter', () => {
    it('should return false when not all rounds completed', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      expect(store.isGameComplete).toBe(false)
    })

    it('should return true when all rounds completed', () => {
      const store = useRaceDataStore()
      store.generateHorses()
      store.generateSchedule()

      for (let i = 1; i <= 6; i++) {
        const mockResult = {
          roundNumber: i,
          distance: 1200 + (i - 1) * 200,
          rankings: [],
        }
        store.completeRound(mockResult)
      }

      expect(store.isGameComplete).toBe(true)
    })
  })
})
