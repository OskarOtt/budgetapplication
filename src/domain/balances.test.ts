import { describe, expect, it } from 'vitest'
import { computeMonthTotals, computeStartingBalance, computeYearTotals } from './balances.ts'
import type { Transaction } from '../types/models.ts'

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? 'tx',
    kind: overrides.kind ?? 'income',
    categoryId: overrides.categoryId ?? 'cat',
    description: overrides.description ?? 'desc',
    amount: overrides.amount ?? 0,
    date: overrides.date ?? '2024-01-01',
    createdAt: overrides.createdAt ?? '2024-01-01',
    ...overrides,
  }
}

describe('computeMonthTotals', () => {
  it('sums income and expense separately for the given month only', () => {
    const transactions = [
      tx({ kind: 'income', amount: 1000, date: '2024-01-05' }),
      tx({ kind: 'expense', amount: 200, date: '2024-01-10' }),
      tx({ kind: 'income', amount: 500, date: '2024-02-01' }),
    ]
    const totals = computeMonthTotals(transactions, '2024-01')
    expect(totals).toEqual({ income: 1000, expense: 200, net: 800 })
  })
})

describe('computeStartingBalance', () => {
  it('sums net across all prior months, excluding the target month', () => {
    const transactions = [
      tx({ kind: 'income', amount: 1000, date: '2024-01-05' }),
      tx({ kind: 'expense', amount: 300, date: '2024-01-10' }),
      tx({ kind: 'income', amount: 200, date: '2024-02-01' }),
    ]
    expect(computeStartingBalance(transactions, '2024-02')).toBe(700)
    expect(computeStartingBalance(transactions, '2024-01')).toBe(0)
  })
})

describe('computeYearTotals', () => {
  it('produces a running ending balance across all 12 months', () => {
    const transactions = [
      tx({ kind: 'income', amount: 1000, date: '2024-01-05' }),
      tx({ kind: 'expense', amount: 400, date: '2024-02-10' }),
    ]
    const rows = computeYearTotals(transactions, 2024)
    expect(rows).toHaveLength(12)
    expect(rows[0].endingBalance).toBe(1000)
    expect(rows[1].endingBalance).toBe(600)
    expect(rows[11].endingBalance).toBe(600)
  })
})
