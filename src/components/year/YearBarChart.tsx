import type { YearSimRow } from '../../domain/balances.ts'
import { monthLabelsFromNow } from '../../utils/date.ts'

interface YearBarChartProps {
  rows: YearSimRow[]
}

export function YearBarChart({ rows }: YearBarChartProps) {
  const labels = monthLabelsFromNow()
  const max = Math.max(1, ...rows.flatMap((r) => [r.income, r.expense]))

  return (
    <div className="year-bar-chart">
      {rows.map((row) => (
        <div className="year-bar-group" key={row.monthIndex}>
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
          <span className="year-bar-label">{labels[row.monthIndex]}</span>
        </div>
      ))}
    </div>
  )
}
