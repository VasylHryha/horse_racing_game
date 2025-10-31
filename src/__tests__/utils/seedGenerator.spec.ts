import { describe, expect, it } from 'vitest'
import { mulberry32 } from '@/utils/seedGenerator'

describe('mulberry32', () => {
  it('produces deterministic sequence for same seed', () => {
    // Same seed => identical sequences
    const a = mulberry32(123)
    const b = mulberry32(123)
    const seqA = [a(), a(), a(), a(), a()]
    const seqB = [b(), b(), b(), b(), b()]
    expect(seqA).toEqual(seqB)
  })

  it('yields different sequences for different seeds', () => {
    // Different seeds => different sequences (extremely likely)
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = [a(), a(), a()]
    const seqB = [b(), b(), b()]
    expect(seqA).not.toEqual(seqB)
  })
})
