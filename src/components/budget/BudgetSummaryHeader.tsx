import type { MonthTotals } from '../../domain/balances.ts'
import { formatCurrency } from '../../utils/currency.ts'

interface BudgetSummaryHeaderProps {
  totals: MonthTotals
}

export function BudgetSummaryHeader({ totals }: BudgetSummaryHeaderProps) {
  const isPositive = totals.net >= 0
  return (
    <div className={`budget-summary-hero ${isPositive ? 'positive' : 'negative'}`}>
      <div className="budget-summary-hero-net">
        <span className="budget-summary-hero-label">
          {isPositive ? 'Left over each month' : 'Short each month'}
        </span>
        <span className="budget-summary-hero-value">{formatCurrency(Math.abs(totals.net))}</span>
      </div>
      <div className="budget-summary-hero-stats">
        <div className="budget-summary-stat">
          <span className="summary-label">Income</span>
          <span className="summary-value income">{formatCurrency(totals.income)}</span>
        </div>
        <div className="budget-summary-stat">
          <span className="summary-label">Expenses</span>
          <span className="summary-value expense">{formatCurrency(totals.expense)}</span>
        </div>
      </div>
    </div>
  )
}
