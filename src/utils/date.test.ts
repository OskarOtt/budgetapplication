import { describe, expect, it } from 'vitest'
import { addMonths, clampDayOfMonth, daysInMonth, formatDate, formatMonthLabel, toMonthKey } from './date.ts'

describe('toMonthKey', () => {
  it('extracts YYYY-MM from an ISO date', () => {
    expect(toMonthKey('2024-03-15')).toBe('2024-03')
  })
})

describe('addMonths', () => {
  it('adds months within the same year', () => {
    expect(addMonths('2024-01', 2)).toBe('2024-03')
  })
  it('rolls over into the next year', () => {
    expect(addMonths('2024-11', 3)).toBe('2025-02')
  })
  it('rolls back into the previous year', () => {
    expect(addMonths('2024-01', -2)).toBe('2023-11')
  })
})

describe('daysInMonth / clampDayOfMonth', () => {
  it('returns 29 for February in a leap year', () => {
    expect(daysInMonth('2024-02')).toBe(29)
  })
  it('returns 28 for February in a non-leap year', () => {
    expect(daysInMonth('2023-02')).toBe(28)
  })
  it('clamps a day beyond the month length', () => {
    expect(clampDayOfMonth('2023-02', 31)).toBe(28)
  })
})

describe('formatDate', () => {
  it('converts ISO YYYY-MM-DD to DD-MM-YYYY', () => {
    expect(formatDate('2024-03-05')).toBe('05-03-2024')
  })
})

describe('formatMonthLabel', () => {
  it('formats a month key as a readable label', () => {
    expect(formatMonthLabel('2024-01')).toBe('January 2024')
  })
})
