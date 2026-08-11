import type { BudgetTone } from '../../domain/budgets.ts'
import { ProgressBar } from '../shared/ProgressBar.tsx'
import { formatCurrency } from '../../utils/currency.ts'

interface CategoryBudgetBarProps {
  name: string
  icon?: string
  spend: number
  limit: number
  ratio: number
  tone: BudgetTone
}

export function CategoryBudgetBar({ name, icon, spend, limit, ratio, tone }: CategoryBudgetBarProps) {
  return (
    <div className="category-budget-bar">
      <div className="category-budget-info">
        <span>
          {icon ? `${icon} ` : ''}
          {name}
        </span>
        <span className={`category-budget-amounts tone-${tone}`}>
          {formatCurrency(spend)}
          {limit > 0 ? ` / ${formatCurrency(limit)}` : ''}
        </span>
      </div>
      <ProgressBar ratio={ratio} tone={tone} />
    </div>
  )
}
