import { useState } from 'react'
import { useBudget } from '../../state/BudgetContext.tsx'
import { SavingsGoalCard } from './SavingsGoalCard.tsx'
import { GoalFormModal } from './GoalFormModal.tsx'
import { AddContributionForm } from './AddContributionForm.tsx'
import '../../styles/savings.css'

export function SavingsGoalsView() {
  const { state, addSavingsGoal, addSavingsContribution, archiveSavingsGoal } = useBudget()
  const [goalFormOpen, setGoalFormOpen] = useState(false)
  const [contributionGoalId, setContributionGoalId] = useState<string | undefined>(undefined)

  const activeGoals = state.savingsGoals.filter((g) => !g.archived)

  return (
    <div className="savings-view">
      <div className="panel-header">
        <h2>Savings goals</h2>
        <button type="button" className="primary" onClick={() => setGoalFormOpen(true)}>
          + New goal
        </button>
      </div>

      {activeGoals.length === 0 ? (
        <p className="empty-state">No savings goals yet. Create one to start tracking progress.</p>
      ) : (
        <div className="savings-goal-grid">
          {activeGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onAddContribution={() => setContributionGoalId(goal.id)}
              onArchive={() => archiveSavingsGoal(goal.id)}
            />
          ))}
        </div>
      )}

      <GoalFormModal
        open={goalFormOpen}
        onClose={() => setGoalFormOpen(false)}
        onSubmit={(values) => addSavingsGoal(values)}
      />

      <AddContributionForm
        open={!!contributionGoalId}
        onClose={() => setContributionGoalId(undefined)}
        onSubmit={(amount, date, note) => {
          if (contributionGoalId) addSavingsContribution(contributionGoalId, amount, date, note)
        }}
      />
    </div>
  )
}
