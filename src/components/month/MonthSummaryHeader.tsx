import type { MonthTotals } from '../../domain/balances.ts'
import { formatCurrency } from '../../utils/currency.ts'

interface MonthSummaryHeaderProps {
  totals: MonthTotals
  startingBalance: number
}

export function MonthSummaryHeader({ totals, startingBalance }: MonthSummaryHeaderProps) {
  const endingBalance = startingBalance + totals.net
  return (
    <div className="summary-header">
      <div className="summary-item">
        <span className="summary-label">Income</span>
        <span className="summary-value income">{formatCurrency(totals.income)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Expenses</span>
        <span className="summary-value expense">{formatCurrency(totals.expense)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Net</span>
        <span className={`summary-value ${totals.net >= 0 ? 'income' : 'expense'}`}>
          {formatCurrency(totals.net)}
        </span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Starting balance</span>
        <span className="summary-value">{formatCurrency(startingBalance)}</span>
      </div>
      <div className="summary-item">
        <span className="summary-label">Ending balance</span>
        <span className="summary-value">{formatCurrency(endingBalance)}</span>
      </div>
    </div>
  )
}
