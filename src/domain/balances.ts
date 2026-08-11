import type { Transaction } from '../types/models.ts'
import { monthsInYear, toMonthKey } from '../utils/date.ts'

export interface MonthTotals {
  income: number
  expense: number
  net: number
}

export function computeMonthTotals(transactions: Transaction[], monthKey: string): MonthTotals {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (toMonthKey(t.date) !== monthKey) continue
    if (t.kind === 'income') income += t.amount
    else expense += t.amount
  }
  return { income, expense, net: income - expense }
}

/** Sum of net totals for all months strictly before monthKey (i.e. the running balance carried in). */
export function computeStartingBalance(transactions: Transaction[], monthKey: string): number {
  let balance = 0
  for (const t of transactions) {
    const tMonth = toMonthKey(t.date)
    if (tMonth >= monthKey) continue
    balance += t.kind === 'income' ? t.amount : -t.amount
  }
  return balance
}

export interface YearMonthRow extends MonthTotals {
  monthKey: string
  startingBalance: number
  endingBalance: number
}

export function computeYearTotals(transactions: Transaction[], year: number): YearMonthRow[] {
  const months = monthsInYear(year)
  return months.map((monthKey) => {
    const totals = computeMonthTotals(transactions, monthKey)
    const startingBalance = computeStartingBalance(transactions, monthKey)
    return {
      monthKey,
      ...totals,
      startingBalance,
      endingBalance: startingBalance + totals.net,
    }
  })
}
