import { describe, expect, it } from 'vitest'
import { getOrdinalSuffix } from '@/utils/ordinal'

describe('getOrdinalSuffix', () => {
  it('handles basic ordinals', () => {
    // 1 -> 1st, 2 -> 2nd, 3 -> 3rd, others -> th
    expect(getOrdinalSuffix(1)).toBe('1st')
    expect(getOrdinalSuffix(2)).toBe('2nd')
    expect(getOrdinalSuffix(3)).toBe('3rd')
    expect(getOrdinalSuffix(4)).toBe('4th')
  })

  it('handles teens and higher correctly', () => {
    // 11/12/13 are special cases -> th
    expect(getOrdinalSuffix(11)).toBe('11th')
    expect(getOrdinalSuffix(12)).toBe('12th')
    expect(getOrdinalSuffix(13)).toBe('13th')
    // 21/22/23 follow last-digit rules again
    expect(getOrdinalSuffix(21)).toBe('21st')
    expect(getOrdinalSuffix(22)).toBe('22nd')
    expect(getOrdinalSuffix(23)).toBe('23rd')
    expect(getOrdinalSuffix(111)).toBe('111th')
  })
})
