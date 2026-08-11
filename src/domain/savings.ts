import type { SavingsGoal } from '../types/models.ts'
import { parseMonthKey, todayISO, toMonthKey } from '../utils/date.ts'

export function getSavedAmount(goal: SavingsGoal): number {
  return goal.contributions.reduce((sum, c) => sum + c.amount, 0)
}

export function getGoalProgress(goal: SavingsGoal): number {
  if (goal.targetAmount <= 0) return 0
  return Math.min(1, getSavedAmount(goal) / goal.targetAmount)
}

/**
 * Monthly amount still needed to hit the target by targetDate, based on whole months remaining
 * from today. Returns null if there's no targetDate, the goal is already met, or the target
 * date has passed (no valid pace can be computed).
 */
export function getRequiredMonthlyPace(goal: SavingsGoal): number | null {
  if (!goal.targetDate) return null
  const remaining = goal.targetAmount - getSavedAmount(goal)
  if (remaining <= 0) return null

  const todayMonth = toMonthKey(todayISO())
  const targetMonth = toMonthKey(goal.targetDate)
  const today = parseMonthKey(todayMonth)
  const target = parseMonthKey(targetMonth)
  const monthsRemaining = (target.year - today.year) * 12 + (target.month - today.month)

  if (monthsRemaining <= 0) return null
  return remaining / monthsRemaining
}
