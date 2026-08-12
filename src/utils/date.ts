/**
 * The app no longer tracks calendar dates for budget items — everything is one
 * recurring monthly template. The only date-ish concepts left are cosmetic:
 * an ordinal suffix for an item's optional day-of-month, and 12 month labels
 * (starting from the current real month) used purely as friendly axis labels
 * in the Year Simulation view.
 */

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

export function ordinal(n: number): string {
  const rem100 = n % 100
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

/** Returns 12 month-name labels starting from the current calendar month (cosmetic only). */
export function monthLabelsFromNow(): string[] {
  const startIndex = new Date().getMonth()
  return Array.from({ length: 12 }, (_, i) => MONTH_LABELS[(startIndex + i) % 12])
}
