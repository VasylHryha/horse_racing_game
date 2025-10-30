/**
 * Physics and speed calculation constants
 */

// Horse speed calculation parameters
export const HORSE_SPEED = {
  BASE_MIN: 12, // Minimum base speed in m/s
  BASE_MAX: 18, // Maximum base speed in m/s
  BASE_MULTIPLIER: 2, // Multiplier applied to base speed
} as const

// Calculate actual speed range
export const ACTUAL_SPEED_RANGE = {
  MIN: HORSE_SPEED.BASE_MIN * HORSE_SPEED.BASE_MULTIPLIER, // 24 m/s
  MAX: HORSE_SPEED.BASE_MAX * HORSE_SPEED.BASE_MULTIPLIER, // 36 m/s
} as const
