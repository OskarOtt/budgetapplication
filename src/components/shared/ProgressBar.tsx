import type { BudgetTone } from '../../domain/budgets.ts'

interface ProgressBarProps {
  ratio: number
  tone: BudgetTone
}

export function ProgressBar({ ratio, tone }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100
  return (
    <div className="progress-bar" data-tone={tone}>
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
