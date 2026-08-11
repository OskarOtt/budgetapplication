/**
 * Dates are stored internally as ISO 'YYYY-MM-DD' strings (sort/compare trivially).
 * All user-facing display goes through formatDate() -> 'DD-MM-YYYY'.
 * Weeks run Monday-Sunday; WEEKDAY_LABELS starts at Monday, not JS's Sunday-first getDay().
 */

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

export function todayISO(): string {
  const now = new Date()
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
}

export function toMonthKey(isoDate: string): string {
  return isoDate.slice(0, 7)
}

export function currentMonthKey(): string {
  return toMonthKey(todayISO())
}

export function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [year, month] = monthKey.split('-').map(Number)
  return { year, month }
}

export function formatMonthLabel(monthKey: string): string {
  const { year, month } = parseMonthKey(monthKey)
  return `${MONTH_LABELS[month - 1]} ${year}`
}

export function addMonths(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey)
  const total = year * 12 + (month - 1) + delta
  const newYear = Math.floor(total / 12)
  const newMonth = ((total % 12) + 12) % 12
  return `${newYear}-${pad2(newMonth + 1)}`
}

export function daysInMonth(monthKey: string): number {
  const { year, month } = parseMonthKey(monthKey)
  return new Date(year, month, 0).getDate()
}

export function clampDayOfMonth(monthKey: string, dayOfMonth: number): number {
  return Math.min(dayOfMonth, daysInMonth(monthKey))
}

export function monthKeyFromParts(year: number, month: number): string {
  return `${year}-${pad2(month)}`
}

export function isMonthBefore(a: string, b: string): boolean {
  return a < b
}

export function isMonthAfter(a: string, b: string): boolean {
  return a > b
}

export function monthsInYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => monthKeyFromParts(year, i + 1))
}

/** Parses 'YYYY-MM-DD' -> 'DD-MM-YYYY' for display. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}
