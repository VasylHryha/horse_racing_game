import type { Horse } from '@/store/modules/racing'
import { HORSE_COLORS, HORSE_NAMES, TOTAL_HORSES } from '@/utils/constants'

export function useHorseGeneration() {
  function generateHorses(): Horse[] {
    const horses: Horse[] = []
    for (let i = 0; i < TOTAL_HORSES; i++) {
      horses.push({
        id: i + 1,
        name: HORSE_NAMES[i] ?? `Horse ${i + 1}`,
        color: HORSE_COLORS[i] ?? '#000000',
        condition: Math.floor(Math.random() * 100) + 1,
      })
    }
    return horses
  }

  return {
    generateHorses,
  }
}
