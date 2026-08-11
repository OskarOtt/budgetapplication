import type { YearMonthRow } from '../../domain/balances.ts'
import { formatCurrency } from '../../utils/currency.ts'
import { parseMonthKey } from '../../utils/date.ts'

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

interface YearTableProps {
  rows: YearMonthRow[]
}

export function YearTable({ rows }: YearTableProps) {
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
        {rows.map((row) => {
          const { month } = parseMonthKey(row.monthKey)
          return (
            <tr key={row.monthKey}>
              <td>{MONTH_SHORT[month - 1]}</td>
              <td className="income">{formatCurrency(row.income)}</td>
              <td className="expense">{formatCurrency(row.expense)}</td>
              <td className={row.net >= 0 ? 'income' : 'expense'}>{formatCurrency(row.net)}</td>
              <td>{formatCurrency(row.endingBalance)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
