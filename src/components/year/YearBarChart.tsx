import type { YearMonthRow } from '../../domain/balances.ts'
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

interface YearBarChartProps {
  rows: YearMonthRow[]
}

export function YearBarChart({ rows }: YearBarChartProps) {
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.expense]))

  return (
    <div className="year-bar-chart">
      {rows.map((row) => {
        const { month } = parseMonthKey(row.monthKey)
        return (
          <div className="year-bar-group" key={row.monthKey}>
            <div className="year-bar-bars">
              <div
                className="year-bar income"
                style={{ height: `${(row.income / max) * 100}%` }}
                title={`Income: ${row.income}`}
              />
              <div
                className="year-bar expense"
                style={{ height: `${(row.expense / max) * 100}%` }}
                title={`Expense: ${row.expense}`}
              />
            </div>
            <span className="year-bar-label">{MONTH_SHORT[month - 1]}</span>
          </div>
        )
      })}
    </div>
  )
}
