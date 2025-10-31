/**
 * UI configuration constants
 */

// Speed presets for race simulation
export const SPEED_PRESETS = {
  SLOWEST: { label: 'Slowest', multiplier: 0.25, icon: '🐢' },
  SLOW: { label: 'Slow', multiplier: 0.5, icon: '🚶' },
  NORMAL: { label: 'Normal', multiplier: 1, icon: '▶️' },
  FAST: { label: 'Fast', multiplier: 2, icon: '🏃' },
  FASTEST: { label: 'Fastest', multiplier: 4, icon: '🚀' },
} as const
export type SpeedPreset = keyof typeof SPEED_PRESETS
