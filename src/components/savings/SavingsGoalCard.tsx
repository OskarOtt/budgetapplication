import type { SavingsGoal } from '../../types/models.ts'
import { getGoalProgress, getRequiredMonthlyPace, getSavedAmount } from '../../domain/savings.ts'
import { ProgressBar } from '../shared/ProgressBar.tsx'
import { formatCurrency } from '../../utils/currency.ts'
import { formatDate } from '../../utils/date.ts'

interface SavingsGoalCardProps {
  goal: SavingsGoal
  onAddContribution: () => void
  onArchive: () => void
}

export function SavingsGoalCard({ goal, onAddContribution, onArchive }: SavingsGoalCardProps) {
  const saved = getSavedAmount(goal)
  const progress = getGoalProgress(goal)
  const pace = getRequiredMonthlyPace(goal)
  const tone = progress >= 1 ? 'ok' : progress >= 0.66 ? 'ok' : 'warning'

  return (
    <div className="savings-goal-card">
      <div className="savings-goal-header">
        <h3>{goal.name}</h3>
        <button type="button" onClick={onArchive} aria-label="Archive goal">
          Archive
        </button>
      </div>
      <p className="savings-goal-amount">
        {formatCurrency(saved)} / {formatCurrency(goal.targetAmount)}
      </p>
      <ProgressBar ratio={progress} tone={progress >= 1 ? 'ok' : tone} />
      {goal.targetDate && (
        <p className="savings-goal-target-date">Target: {formatDate(goal.targetDate)}</p>
      )}
      {pace !== null && (
        <p className="savings-goal-pace">Save {formatCurrency(pace)}/mo to hit your goal on time.</p>
      )}
      <button type="button" className="primary" onClick={onAddContribution}>
        Add contribution
      </button>
    </div>
  )
}
