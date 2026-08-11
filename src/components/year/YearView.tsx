import { useEffect, useMemo, useState } from 'react'
import { useBudget } from '../../state/BudgetContext.tsx'
import { computeYearTotals } from '../../domain/balances.ts'
import { monthsInYear } from '../../utils/date.ts'
import { YearNav } from './YearNav.tsx'
import { YearTable } from './YearTable.tsx'
import { YearBarChart } from './YearBarChart.tsx'
import '../../styles/year.css'

export function YearView() {
  const { state, ensureMonths } = useBudget()
  const [viewedYear, setViewedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    ensureMonths(monthsInYear(viewedYear))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedYear])

  const rows = useMemo(
    () => computeYearTotals(state.transactions, viewedYear),
    [state.transactions, viewedYear],
  )

  return (
    <div className="year-view">
      <YearNav
        year={viewedYear}
        onPrev={() => setViewedYear((y) => y - 1)}
        onNext={() => setViewedYear((y) => y + 1)}
        onThisYear={() => setViewedYear(new Date().getFullYear())}
      />
      <YearBarChart rows={rows} />
      <YearTable rows={rows} />
    </div>
  )
}
