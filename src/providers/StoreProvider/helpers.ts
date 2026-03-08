import { Entry } from '../../services/types'

/**
 * Calculates the total and per-entry calorie sums from a list of entries.
 *
 * It handles different entry types, such as sections, and accumulates the
 * results accordingly.
 */
export const getTotalSum = (entries: Entry[]) => {
  const sums: Record<string, number> = {}
  let totalSum = 0
  let sectionSum = 0
  let sectionDiscard = false
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i]
    let sum = 0
    if (entry.type == 'section') {
      sectionDiscard = entry.discard
      totalSum += sectionDiscard ? 0 : sectionSum
      sum = sectionSum
      sectionSum = 0
    } else {
      if (isNaN(entry.kcal) || isNaN(entry.total)) continue
      sum =
        entry.type == 'kcalPer100g'
          ? (entry.kcal / 100) * entry.total
          : entry.kcal * entry.total
      if (!entry.discard) {
        sectionSum += sum
      }
    }
    sums[entry.id] = sum
  }
  totalSum += sectionDiscard ? 0 : sectionSum
  return { totalSum, sums }
}
