import type { CategoryBudget, Transaction } from '../types/models.ts'
import { toMonthKey } from '../utils/date.ts'

export type BudgetTone = 'ok' | 'warning' | 'over'

export function computeCategorySpend(
  transactions: Transaction[],
  categoryId: string,
  monthKey: string,
): number {
  return transactions
    .filter(
      (t) => t.kind === 'expense' && t.categoryId === categoryId && toMonthKey(t.date) === monthKey,
    )
    .reduce((sum, t) => sum + t.amount, 0)
}

/** ok: <80% of limit, warning: 80-100%, over: >100%. No limit set -> always ok. */
export function getBudgetStatus(
  spend: number,
  budget: CategoryBudget | undefined,
): { tone: BudgetTone; ratio: number; limit: number } {
  const limit = budget?.monthlyLimit ?? 0
  if (limit <= 0) {
    return { tone: 'ok', ratio: 0, limit }
  }
  const ratio = spend / limit
  const tone: BudgetTone = ratio > 1 ? 'over' : ratio >= 0.8 ? 'warning' : 'ok'
  return { tone, ratio, limit }
}
