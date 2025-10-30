import { describe, expect, it } from 'vitest'
import { TOTAL_HORSES } from '../../constants'
import { generateHorses } from '../../utils/horseGeneration'

describe('useHorseGeneration', () => {
  it('should generate exactly 20 horses', () => {
    const horses = generateHorses()
    expect(horses).toHaveLength(TOTAL_HORSES)
  })

  it('should generate horses with valid properties', () => {
    const horses = generateHorses()
    horses.forEach((horse) => {
      expect(horse).toHaveProperty('id')
      expect(horse).toHaveProperty('name')
      expect(horse).toHaveProperty('color')
      expect(horse).toHaveProperty('condition')
      expect(typeof horse.id).toBe('number')
      expect(typeof horse.name).toBe('string')
      expect(typeof horse.color).toBe('string')
      expect(typeof horse.condition).toBe('number')
    })
  })

  it('should generate horses with valid condition values (1-100)', () => {
    const horses = generateHorses()
    horses.forEach((horse) => {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })

  it('should generate horses with unique IDs', () => {
    const horses = generateHorses()
    const ids = horses.map(h => h.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(TOTAL_HORSES)
  })

  it('should generate horses with unique colors', () => {
    const horses = generateHorses()
    const colors = horses.map(h => h.color)
    const uniqueColors = new Set(colors)
    expect(uniqueColors.size).toBe(TOTAL_HORSES)
  })

  it('should generate non-empty horse names', () => {
    const horses = generateHorses()
    horses.forEach((horse) => {
      expect(horse.name.length).toBeGreaterThan(0)
    })
  })

  it('should generate valid hex color codes', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i
    const horses = generateHorses()
    horses.forEach((horse) => {
      expect(horse.color).toMatch(hexColorRegex)
    })
  })
})
