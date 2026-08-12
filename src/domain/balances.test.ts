import { describe, expect, it } from 'vitest'
import { computeMonthTotals, computeYearSimulation } from './balances.ts'
import type { BudgetItem } from '../types/models.ts'

function item(overrides: Partial<BudgetItem>): BudgetItem {
  return {
    id: overrides.id ?? 'item',
    kind: overrides.kind ?? 'income',
    categoryId: overrides.categoryId ?? 'cat',
    description: overrides.description ?? 'desc',
    amount: overrides.amount ?? 0,
    ...overrides,
  }
}

describe('computeMonthTotals', () => {
  it('sums income and expense separately', () => {
    const items = [
      item({ kind: 'income', amount: 1000 }),
      item({ kind: 'expense', amount: 200 }),
      item({ kind: 'income', amount: 500 }),
    ]
    expect(computeMonthTotals(items)).toEqual({ income: 1500, expense: 200, net: 1300 })
  })

  it('returns zeros for an empty budget', () => {
    expect(computeMonthTotals([])).toEqual({ income: 0, expense: 0, net: 0 })
  })
})

describe('computeYearSimulation', () => {
  it('replicates the same month totals across all 12 rows', () => {
    const items = [item({ kind: 'income', amount: 1000 }), item({ kind: 'expense', amount: 400 })]
    const rows = computeYearSimulation(items, 0)
    expect(rows).toHaveLength(12)
    for (const row of rows) {
      expect(row.income).toBe(1000)
      expect(row.expense).toBe(400)
      expect(row.net).toBe(600)
    }
  })

  it('carries a running cumulative balance from an optional starting balance', () => {
    const items = [item({ kind: 'income', amount: 1000 }), item({ kind: 'expense', amount: 400 })]
    const rows = computeYearSimulation(items, 500)
    expect(rows[0].startingBalance).toBe(500)
    expect(rows[0].endingBalance).toBe(1100)
    expect(rows[1].startingBalance).toBe(1100)
    expect(rows[11].endingBalance).toBe(500 + 600 * 12)
  })
})
