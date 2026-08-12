import { describe, expect, it } from 'vitest'
import { monthLabelsFromNow, ordinal } from './date.ts'

describe('ordinal', () => {
  it('formats common suffixes', () => {
    expect(ordinal(1)).toBe('1st')
    expect(ordinal(2)).toBe('2nd')
    expect(ordinal(3)).toBe('3rd')
    expect(ordinal(4)).toBe('4th')
  })
  it('handles the 11-13 special case', () => {
    expect(ordinal(11)).toBe('11th')
    expect(ordinal(12)).toBe('12th')
    expect(ordinal(13)).toBe('13th')
  })
  it('handles larger numbers', () => {
    expect(ordinal(21)).toBe('21st')
    expect(ordinal(22)).toBe('22nd')
    expect(ordinal(28)).toBe('28th')
  })
})

describe('monthLabelsFromNow', () => {
  it('returns 12 labels starting from the current month', () => {
    const labels = monthLabelsFromNow()
    expect(labels).toHaveLength(12)
    const expectedFirst = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
      new Date().getMonth()
    ]
    expect(labels[0]).toBe(expectedFirst)
  })
})
