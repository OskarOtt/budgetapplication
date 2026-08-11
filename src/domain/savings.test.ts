import { describe, expect, it } from 'vitest'
import { getGoalProgress, getRequiredMonthlyPace, getSavedAmount } from './savings.ts'
import type { SavingsGoal } from '../types/models.ts'
import { addMonths, currentMonthKey } from '../utils/date.ts'

function goal(overrides: Partial<SavingsGoal>): SavingsGoal {
  return {
    id: 'goal',
    name: 'Test goal',
    targetAmount: 1000,
    contributions: [],
    createdAt: '2024-01-01',
    ...overrides,
  }
}

describe('getSavedAmount', () => {
  it('sums contributions (deposits positive, withdrawals negative)', () => {
    const g = goal({
      contributions: [
        { id: '1', amount: 500, date: '2024-01-01' },
        { id: '2', amount: -100, date: '2024-01-15' },
      ],
    })
    expect(getSavedAmount(g)).toBe(400)
  })
})

describe('getGoalProgress', () => {
  it('caps progress at 1 even if overfunded', () => {
    const g = goal({ targetAmount: 100, contributions: [{ id: '1', amount: 200, date: '2024-01-01' }] })
    expect(getGoalProgress(g)).toBe(1)
  })

  it('returns 0 for a goal with no target amount', () => {
    const g = goal({ targetAmount: 0 })
    expect(getGoalProgress(g)).toBe(0)
  })
})

describe('getRequiredMonthlyPace', () => {
  it('returns null when there is no target date', () => {
    const g = goal({})
    expect(getRequiredMonthlyPace(g)).toBeNull()
  })

  it('returns null when goal is already met', () => {
    const g = goal({
      targetAmount: 100,
      targetDate: addMonths(currentMonthKey(), 3) + '-15',
      contributions: [{ id: '1', amount: 100, date: '2024-01-01' }],
    })
    expect(getRequiredMonthlyPace(g)).toBeNull()
  })

  it('computes remaining amount divided by whole months remaining', () => {
    const targetDate = `${addMonths(currentMonthKey(), 4)}-15`
    const g = goal({ targetAmount: 800, targetDate, contributions: [] })
    expect(getRequiredMonthlyPace(g)).toBe(200)
  })
})
