import type { BudgetItem } from '../types/models.ts'

export interface MonthTotals {
  income: number
  expense: number
  net: number
}

export function computeMonthTotals(items: BudgetItem[]): MonthTotals {
  let income = 0
  let expense = 0
  for (const item of items) {
    if (item.kind === 'income') income += item.amount
    else expense += item.amount
  }
  return { income, expense, net: income - expense }
}

export interface YearSimRow extends MonthTotals {
  monthIndex: number // 0-11
  startingBalance: number
  endingBalance: number
}

/**
 * Projects the single monthly budget forward 12 times, carrying a running balance.
 * Every month is identical (income/expense totals), only the cumulative balance changes.
 */
export function computeYearSimulation(items: BudgetItem[], startingBalance: number): YearSimRow[] {
  const totals = computeMonthTotals(items)
  const rows: YearSimRow[] = []
  let balance = startingBalance
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const rowStartingBalance = balance
    balance += totals.net
    rows.push({
      monthIndex,
      ...totals,
      startingBalance: rowStartingBalance,
      endingBalance: balance,
    })
  }
  return rows
}
