import type { YearSimRow } from '../../domain/balances.ts'
import { formatCurrency } from '../../utils/currency.ts'
import { monthLabelsFromNow } from '../../utils/date.ts'

interface YearTableProps {
  rows: YearSimRow[]
}

export function YearTable({ rows }: YearTableProps) {
  const labels = monthLabelsFromNow()
  return (
    <table className="year-table">
      <thead>
        <tr>
          <th>Month</th>
          <th>Income</th>
          <th>Expenses</th>
          <th>Net</th>
          <th>Ending balance</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.monthIndex}>
            <td>{labels[row.monthIndex]}</td>
            <td className="income">{formatCurrency(row.income)}</td>
            <td className="expense">{formatCurrency(row.expense)}</td>
            <td className={row.net >= 0 ? 'income' : 'expense'}>{formatCurrency(row.net)}</td>
            <td className={row.endingBalance >= 0 ? '' : 'expense'}>
              {formatCurrency(row.endingBalance)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
